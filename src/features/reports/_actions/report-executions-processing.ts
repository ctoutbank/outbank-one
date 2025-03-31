import { resend } from "@/lib/resend";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { reportExecution, reports } from "../../../../drizzle/schema";
import { db } from "../../../server/db";
import reportsExecutionSalesGeneratePDF from "./reports-execution-sales";

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
        pdfBytes = await reportsExecutionSalesGeneratePDF();
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
          subject: `Relatório: ${report[0].title}`,
          html: `<p>Segue em anexo o relatório "${report[0].title}".</p>`,
          attachments: [
            {
              filename: `relatorio-${
                report[0]?.reportType?.toLowerCase() || "desconhecido"
              }.pdf`,
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
