import { addDays, format } from "date-fns";
import { and, eq, sql } from "drizzle-orm";
import {
  reportExecution,
  reportFilters,
  reportFiltersParam,
  reports,
} from "../../../../drizzle/schema";
import { db } from "../../../server/db";

export async function scheduleReportsForNextDay() {
  console.log(
    "[REPORT-SCHEDULE] Iniciando processo de agendamento de relatórios"
  );
  const today = new Date();
  const tomorrow = addDays(today, 1);
  console.log(
    `[REPORT-SCHEDULE] Data de agendamento: ${format(tomorrow, "yyyy-MM-dd")}`
  );

  // Busca todos os relatórios que precisam ser agendados
  const reportsToSchedule = await db
    .select()
    .from(reports)
    .where(
      and(
        // Verifica se o relatório tem código de recorrência
        sql`${reports.recurrenceCode} IS NOT NULL`,
        // Verifica se o relatório tem horário de envio
        sql`${reports.shippingTime} IS NOT NULL`
      )
    );

  console.log(
    `[REPORT-SCHEDULE] Total de relatórios encontrados: ${reportsToSchedule.length}`
  );

  for (const report of reportsToSchedule) {
    console.log(`\n[REPORT-SCHEDULE] Processando relatório ID: ${report.id}`);
    console.log(`[REPORT-SCHEDULE] Título: ${report.title}`);
    console.log(`[REPORT-SCHEDULE] Recorrência: ${report.recurrenceCode}`);
    console.log(`[REPORT-SCHEDULE] Horário: ${report.shippingTime}`);

    const scheduleDateTime = combineDateAndTime(
      tomorrow,
      report.shippingTime || "00:00:00"
    );

    // Verifica se o relatório já foi agendado para amanhã
    const existingExecution = await db
      .select()
      .from(reportExecution)
      .where(
        and(
          eq(reportExecution.idReport, report.id),
          eq(
            reportExecution.scheduleDate,
            format(scheduleDateTime, "yyyy-MM-dd HH:mm:ss")
          ),
          // Adiciona uma condição que sempre será verdadeira mas evita cache
          sql`${sql.raw("1")} = 1`
        )
      );

    if (existingExecution.length > 0) {
      console.log(existingExecution);
      console.log(
        `[REPORT-SCHEDULE] Relatório já agendado para amanhã, pulando...`
      );
      continue;
    }

    // Verifica se o relatório deve ser executado amanhã baseado na recorrência
    const shouldExecute = checkIfShouldExecute(report, tomorrow);
    if (!shouldExecute) {
      console.log(
        `[REPORT-SCHEDULE] Relatório não deve ser executado amanhã, pulando...`
      );
      continue;
    }

    // Busca os filtros do relatório
    const reportFiltersData = await db
      .select({
        filterName: reportFiltersParam.name,
        filterValue: reportFilters.value,
        filterType: reportFiltersParam.type,
      })
      .from(reportFilters)
      .innerJoin(
        reportFiltersParam,
        eq(reportFilters.idReportFilterParam, reportFiltersParam.id)
      )
      .where(eq(reportFilters.idReport, report.id));

    console.log(
      `[REPORT-SCHEDULE] Filtros encontrados: ${reportFiltersData.length}`
    );

    // Converte os filtros para o formato esperado
    const filters = reportFiltersData.reduce(
      (acc: Record<string, any>, filter: any) => {
        // Converte o valor do filtro baseado no tipo
        let value: any = filter.filterValue;

        switch (filter.filterType) {
          case "NUMBER":
            value = Number(filter.filterValue);
            break;
          case "DATE":
            value = filter.filterValue; // Mantém como string no formato da data
            break;
          case "BOOLEAN":
            value = filter.filterValue.toLowerCase() === "true";
            break;
          // Adicione outros tipos conforme necessário
        }

        acc[filter.filterName] = value;
        return acc;
      },
      {} as Record<string, any>
    );

    console.log("[REPORT-SCHEDULE] Filtros convertidos:", filters);

    // Combina a data de amanhã com o horário de envio do relatório

    console.log(
      `[REPORT-SCHEDULE] Data/hora de agendamento: ${format(
        scheduleDateTime,
        "yyyy-MM-dd HH:mm:ss"
      )}`
    );

    // Cria o registro de execução
    const execution = await db
      .insert(reportExecution)
      .values({
        idReport: report.id,
        status: "SCHEDULED",
        scheduleDate: format(scheduleDateTime, "yyyy-MM-dd HH:mm:ss"),
        createdOn: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        filters, // Agora preenchido com os filtros do relatório
        emailsSent: report.emails,
      })
      .returning();

    console.log(
      `[REPORT-SCHEDULE] Registro de execução criado com ID: ${execution[0].id}`
    );
  }

  console.log("\n[REPORT-SCHEDULE] Processo de agendamento finalizado");
}

function checkIfShouldExecute(
  report: typeof reports.$inferSelect,
  date: Date
): boolean {
  const dayOfWeek = format(date, "EEEE").toLowerCase();
  const dayOfMonth = format(date, "d");

  console.log(
    `[REPORT-SCHEDULE] Verificando execução para dia ${dayOfWeek} (${dayOfMonth})`
  );

  switch (report.recurrenceCode) {
    case "DIA":
      return true;
    case "SEM":
      return report.dayWeek?.toLowerCase() === dayOfWeek;
    case "MES":
      return report.dayMonth === dayOfMonth;
    default:
      return false;
  }
}

function combineDateAndTime(date: Date, time: string): Date {
  // O time vem no formato "HH:mm:ss" da tabela
  const [hours, minutes, seconds] = time.split(":").map(Number);

  console.log(
    `[REPORT-SCHEDULE] Combinando data ${format(
      date,
      "yyyy-MM-dd"
    )} com horário ${time}`
  );

  // Cria uma nova data combinando a data fornecida com o horário
  const combinedDate = new Date(date);
  combinedDate.setHours(hours, minutes, seconds, 0);

  return combinedDate;
}
