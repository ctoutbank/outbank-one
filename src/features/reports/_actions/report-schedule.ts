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

  // Verifica relatórios para o mesmo dia
  await checkAndScheduleSameDayReports(reportsToSchedule, today);

  // Verifica relatórios para o próximo dia
  await checkAndScheduleSameDayReports(reportsToSchedule, tomorrow);

  console.log("\n[REPORT-SCHEDULE] Processo de agendamento finalizado");
}

async function checkAndScheduleSameDayReports(
  reports: any[],
  targetDate: Date
) {
  const isToday =
    format(targetDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  console.log(
    `[REPORT-SCHEDULE] Verificando relatórios para ${
      isToday ? "hoje" : "amanhã"
    }`
  );

  // Obtém a hora e minutos atuais no fuso horário de São Paulo
  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  console.log(`[REPORT-SCHEDULE] Hora atual em São Paulo: ${currentTime}`);

  for (const report of reports) {
    if (!report.shippingTime) continue;

    const [reportHour, reportMinute] = report.shippingTime.split(":");
    const [currentHour, currentMinute] = currentTime.split(":");

    const currentTimeNumber =
      parseInt(currentHour) * 60 + parseInt(currentMinute);
    const reportTimeNumber = parseInt(reportHour) * 60 + parseInt(reportMinute);

    console.log(currentTimeNumber);
    console.log(reportTimeNumber);
    // Se for hoje, só processa se o horário já passou
    // Se for amanhã, processa todos os relatórios
    if (isToday && reportTimeNumber <= currentTimeNumber) {
      console.log(
        `[REPORT-SCHEDULE] Relatório ID ${report.id} com horário ${report.shippingTime} já passou, pulando...`
      );
      continue;
    }

    console.log(
      `[REPORT-SCHEDULE] Verificando relatório ID ${
        report.id
      } para execução em ${isToday ? "hoje" : "amanhã"}`
    );

    const scheduleDateTime = combineDateAndTime(
      targetDate,
      report.shippingTime
    );

    // Verifica se o relatório já foi agendado para a data alvo
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
          sql`${sql.raw("1")} = 1`
        )
      );

    if (existingExecution.length > 0) {
      console.log(
        `[REPORT-SCHEDULE] Relatório já agendado para ${
          isToday ? "hoje" : "amanhã"
        }, pulando...`
      );
      continue;
    }

    // Verifica se o relatório deve ser executado baseado na recorrência
    const shouldExecute = checkIfShouldExecute(report, targetDate);
    if (!shouldExecute) {
      console.log(
        `[REPORT-SCHEDULE] Relatório não deve ser executado ${
          isToday ? "hoje" : "amanhã"
        }, pulando...`
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

    const filters = reportFiltersData.reduce(
      (acc: Record<string, any>, filter: any) => {
        let value: any = filter.filterValue;

        switch (filter.filterType) {
          case "NUMBER":
            value = Number(filter.filterValue);
            break;
          case "DATE":
            value = filter.filterValue;
            break;
          case "BOOLEAN":
            value = filter.filterValue.toLowerCase() === "true";
            break;
        }

        acc[filter.filterName] = value;
        return acc;
      },
      {} as Record<string, any>
    );

    // Cria o registro de execução
    const execution = await db
      .insert(reportExecution)
      .values({
        idReport: report.id,
        status: "SCHEDULED",
        scheduleDate: format(scheduleDateTime, "yyyy-MM-dd HH:mm:ss"),
        createdOn: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        filters,
        emailsSent: report.emails,
      })
      .returning();

    console.log(
      `[REPORT-SCHEDULE] Registro de execução criado para ${
        isToday ? "hoje" : "amanhã"
      } com ID: ${execution[0].id}`
    );
  }
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
