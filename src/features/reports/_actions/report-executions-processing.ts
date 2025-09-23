import {
  getPendingReportExecutions,
  getReportById,
  updateReportExecutionCompletion,
  updateReportExecutionStatus,
} from "@/features/reports/_actions/utils/report-db";
import { ReportFilter } from "@/features/reports/_actions/utils/report-types";
import { DateTime } from "luxon";
import {
  sendReportEmail,
  validateAndProcessEmails,
} from "./utils/report-email";
import { generateSalesReport } from "./utils/report-generator";
import { logger } from "./utils/report-logger";
import { uploadReportFile } from "./utils/report-upload";

export async function reportExecutionsProcessing() {
  logger.info("Iniciando processamento de relatórios agendados");

  const pendingExecutions = await getPendingReportExecutions();
  if (pendingExecutions.length === 0) {
    logger.info("Nenhum relatório pendente para processamento");
    return;
  }

  logger.info("Relatórios pendentes para processamento", {
    pendingExecutions,
  });

  for (const execution of pendingExecutions) {
    // Definindo o tipo para os filtros do relatório

    // Convertendo a string JSON para objeto e mapeando os nomes dos atributos
    let filters: ReportFilter = {};
    try {
      filters =
        typeof execution.filters === "string"
          ? JSON.parse(execution.filters)
          : execution.filters;

      logger.info("Filtros processados para execução", { filters });
    } catch (error) {
      logger.error("Erro ao processar filtros do relatório", { error });
      filters = {};
    }

    try {
      const report = await getReportById(execution.idReport as number);
      logger.info("Processando relatório", {
        executionId: execution.id,
        reportTitle: report.title,
        reportType: report.reportType,
      });

      await updateReportExecutionStatus(execution.id, "PROCESSING", new Date());

      let excelBytes: Uint8Array | null = null;
      const dateStart = DateTime.fromISO(execution.reportFilterStartDate!, {
        zone: "America/Sao_Paulo",
      })
        .toUTC()
        .toISO();
      const dateEnd = DateTime.fromISO(execution.reportFilterEndDateTime!, {
        zone: "America/Sao_Paulo",
      })
        .toUTC()
        .toISO();

      logger.info("Datas processadas", {
        dateStart,
        dateEnd,
      });
      try {
        if (!report.periodCode) {
          throw new Error("Código de período não definido");
        }

        if (report.reportType === "VN") {
          excelBytes = await generateSalesReport(
            report,
            dateStart!,
            dateEnd!,
            filters
          );
        }

        if (!excelBytes) {
          throw new Error("Relatório não gerado");
        }

        const uploadResult = await uploadReportFile(
          excelBytes,
          `relatorio-${report.title}-${execution.scheduleDate}.xlsx`,
          "application/xlsx"
        );
        const emailList = validateAndProcessEmails(execution.emailsSent);

        await sendReportEmail(emailList, uploadResult, execution, report);
        logger.info("Relatório enviado com sucesso", {
          recipients: emailList,
          fileUrl: uploadResult.fileURL,
        });

        await updateReportExecutionCompletion(
          execution.id,
          "SUCCESS",
          uploadResult.fileId,
          new Date()
        );
      } catch (error) {
        logger.error("Erro ao processar datas", {
          error: error instanceof Error ? error.message : "Erro desconhecido",
          scheduleDate: execution.scheduleDate,
          periodCode: report.periodCode,
          startTime: report.startTime,
          endTime: report.endTime,
        });
        throw error;
      }
    } catch (error) {
      logger.error("Erro ao processar relatório", {
        error: error instanceof Error ? error.message : "Erro desconhecido",
        executionId: execution.id,
      });
      await updateReportExecutionStatus(
        execution.id,
        "ERROR",
        new Date(),
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    }
  }

  logger.info("Processamento de relatórios concluído");
}
