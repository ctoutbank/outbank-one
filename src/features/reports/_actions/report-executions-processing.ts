import { resend } from "@/lib/resend";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { reportExecution, reports } from "../../../../drizzle/schema";
import { db } from "../../../server/db";
import reportsExecutionSalesGeneratePDF, {
  reportsExecutionSalesGenerateXLSX,
} from "./reports-execution-sales";
import { getTransactionsForReport } from "@/features/transactions/serverActions/transaction";
import { formatDate } from "@/lib/utils";

export async function reportExecutionsProcessing() {
  console.log(
    "[REPORT-PROCESSING] Iniciando processamento de relatórios agendados"
  );
  const now = new Date();
  console.log(
    `[REPORT-PROCESSING] Data/hora atual: ${format(now, "yyyy-MM-dd HH:mm:ss")}`
  );

  // Busca relatórios pendentes que devem ser executados agora
  const pendingExecutions = await db
    .select()
    .from(reportExecution)
    .where(eq(reportExecution.status, "SCHEDULED"))
    .limit(1);

  console.log(
    `[REPORT-PROCESSING] Total de relatórios pendentes: ${pendingExecutions.length}`
  );

  for (const execution of pendingExecutions) {
    console.log(
      `\n[REPORT-PROCESSING] Processando execução ID: ${execution.id}`
    );
    console.log(`[REPORT-PROCESSING] Relatório ID: ${execution.idReport}`);
    console.log(`[REPORT-PROCESSING] Data agendada: ${execution.scheduleDate}`);

    try {
      // Busca os detalhes do relatório
      const report = await db
        .select()
        .from(reports)
        .where(eq(reports.id, execution.idReport as number))
        .limit(1);

      if (!report.length) {
        throw new Error("Relatório não encontrado");
      }

      console.log(
        `[REPORT-PROCESSING] Título do relatório: ${report[0].title}`
      );
      console.log(
        `[REPORT-PROCESSING] Tipo do relatório: ${report[0].reportType}`
      );

      // Atualiza o status para PROCESSING
      await db
        .update(reportExecution)
        .set({
          status: "PROCESSING",
          executionStart: format(now, "yyyy-MM-dd HH:mm:ss"),
        })
        .where(eq(reportExecution.id, execution.id));

      console.log("[REPORT-PROCESSING] Status atualizado para PROCESSING");

      let pdfBytes: Uint8Array<ArrayBufferLike> | null = null;
      if (report[0].reportType === "VN") {
        const search = "";
        const pageNumber = 1;
        const pageSize = 100000;
        const status = undefined;
        const merchant = undefined;
        // Define a data de início como hoje às 03:00 explicitamente

        // Aumentar 3 horas nas datas
        const dateFromBase = new Date("2025-03-31 00:00:00");
        const dateToBase = new Date("2025-03-31 12:00:59");

        dateFromBase.setHours(dateFromBase.getHours() + 3);
        dateToBase.setHours(dateToBase.getHours() + 3);

        const dateFrom = dateFromBase
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);
        const dateTo = dateToBase
          .toISOString()
          .replace("T", " ")
          .substring(0, 19);

        console.log("dateFrom", dateFrom);
        console.log("dateTo", dateTo);

        const productType = undefined;

        const transactions = await getTransactionsForReport(
          search,
          pageNumber,
          pageSize,
          status,
          merchant,
          dateFrom,
          dateTo,
          productType
        );
        if (report[0].formatCode === "PDF") {
          pdfBytes = await reportsExecutionSalesGeneratePDF(transactions);
        } else if (report[0].formatCode === "XLSX") {
          pdfBytes = await reportsExecutionSalesGenerateXLSX(
            transactions,
            dateFrom,
            dateTo
          );
        } else {
          throw new Error("Formato de relatório não suportado");
        }
        console.log(
          "[REPORT-PROCESSING] Relatório de vendas gerado com sucesso"
        );
      }

      // Enviar email com o PDF
      // Obter os emails do relatório
      const emailsToSend = execution.emailsSent;

      if (
        !emailsToSend ||
        (typeof emailsToSend === "string" && emailsToSend.trim() === "")
      ) {
        throw new Error("Não há destinatários para enviar o relatório");
      }
      const emailList = Array.isArray(emailsToSend)
        ? emailsToSend
        : typeof emailsToSend === "string"
        ? emailsToSend.split(",").map((email) => email.trim())
        : [];

      if (emailList.length === 0) {
        throw new Error("Lista de emails para envio está vazia");
      }

      console.log(
        `[REPORT-PROCESSING] Enviando relatório para: ${emailList.join(", ")}`
      );

      if (pdfBytes) {
        console.log("[REPORT-PROCESSING] PDF Gerado: ", pdfBytes);
        await resend.emails.send({
          from: "noreply@outbank.cloud",
          to: emailList,
          subject: `Relatório de Vendas Outbank One`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
              <h2 style="color: #0066cc;">Relatório de Vendas Outbank One</h2>
              <p>Prezado(a) cliente,</p>
              <p>É com satisfação que enviamos o seu relatório de vendas do Outbank One, contendo todas as transações processadas no período de <strong>${formatDate(
                new Date(execution.scheduleDate)
              )}</strong> a <strong>${formatDate(
            new Date(execution.scheduleDate)
          )}</strong>.</p>
              <p>Este relatório inclui informações detalhadas sobre:</p>
              <ul>
                <li>Volume total de transações</li>
                <li>Valores por bandeira</li>
                <li>Tipos de transações</li>
                <li>Status das operações</li>
              </ul>
              <p>Utilize estas informações para otimizar suas estratégias de vendas e acompanhar o desempenho do seu negócio.</p>
              <p>Em caso de dúvidas, nossa equipe de suporte está à disposição.</p>
              <p style="margin-top: 30px;">Atenciosamente,<br>Equipe Outbank One</p>
            </div>
          `,
          attachments: [
            {
              filename: `relatorio-vendas-${format(
                new Date(),
                "yyyy-MM-dd-HH-mm-ss"
              )}.${report[0].formatCode?.toLowerCase() || "pdf"}`,
              content: Buffer.from(pdfBytes),
            },
          ],
        });
      } else {
        console.log("[REPORT-PROCESSING] PDF não gerado");
        throw new Error("PDF não gerado");
      }

      await db
        .update(reportExecution)
        .set({
          status: "SUCCESS",
          executionEnd: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        })
        .where(eq(reportExecution.id, execution.id));

      console.log("[REPORT-PROCESSING] Status atualizado para COMPLETED");
    } catch (error) {
      console.error(`[REPORT-PROCESSING] Erro ao processar relatório:`, error);

      await db
        .update(reportExecution)
        .set({
          status: "ERROR",
          errorMessage:
            error instanceof Error ? error.message : "Erro desconhecido",
          executionEnd: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        })
        .where(eq(reportExecution.id, execution.id));

      console.log("[REPORT-PROCESSING] Status atualizado para ERROR");
    }
  }

  console.log("\n[REPORT-PROCESSING] Processo de execução finalizado");
}
