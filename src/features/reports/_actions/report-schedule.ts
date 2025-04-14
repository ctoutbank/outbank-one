import { addDays, format } from "date-fns";
import {
  calculatePeriodDates,
  createScheduledDateTime,
  shouldExecuteReportBasedOnRecurrence,
} from "./utils/report-date";
import {
  createReportExecution,
  findExistingReportExecution,
  getRecurringReports,
  getReportFilterParameters,
} from "./utils/report-db";
import { logger } from "./utils/report-logger";

export async function scheduleReportsForNextDay() {
  logger.info("Iniciando processo de agendamento de relatórios");

  const today = new Date();
  const tomorrow = addDays(today, 1);
  logger.info(`Data de agendamento: ${format(tomorrow, "yyyy-MM-dd")}`);

  const recurringReports = await getRecurringReports();
  logger.info(`Total de relatórios encontrados: ${recurringReports.length}`);

  await processReportsForDate(recurringReports, today);
  await processReportsForDate(recurringReports, tomorrow);

  logger.info("Processo de agendamento finalizado");
}

async function processReportsForDate(reports: any[], targetDate: Date) {
  const isToday =
    format(targetDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  logger.info(`Verificando relatórios para ${isToday ? "hoje" : "amanhã"}`);

  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  logger.info(`Hora atual em São Paulo: ${currentTime}`);

  for (const report of reports) {
    if (!report.shippingTime) continue;

    const [reportHour, reportMinute] = report.shippingTime.split(":");
    const [currentHour, currentMinute] = currentTime.split(":");

    const currentTimeNumber =
      parseInt(currentHour) * 60 + parseInt(currentMinute);
    const reportTimeNumber = parseInt(reportHour) * 60 + parseInt(reportMinute);

    if (isToday && reportTimeNumber <= currentTimeNumber) {
      logger.info(
        `Relatório ID ${report.id} com horário ${report.shippingTime} já passou, pulando...`
      );
      continue;
    }

    logger.info(
      `Verificando relatório ID ${report.id} para execução em ${
        isToday ? "hoje" : "amanhã"
      }`
    );

    const scheduledDateTime = createScheduledDateTime(
      targetDate,
      report.shippingTime
    );
    const scheduleDateFormatted = format(
      scheduledDateTime,
      "yyyy-MM-dd HH:mm:ss"
    );

    const shouldExecute = shouldExecuteReportBasedOnRecurrence(
      report,
      targetDate
    );
    if (!shouldExecute) {
      logger.info(
        `Relatório não deve ser executado ${
          isToday ? "hoje" : "amanhã"
        }, pulando...`
      );
      continue;
    }

    const existingExecution = await findExistingReportExecution(
      report.id,
      scheduleDateFormatted
    );
    if (existingExecution.length > 0) {
      logger.info(
        `Relatório já agendado para ${isToday ? "hoje" : "amanhã"}, pulando...`
      );
      continue;
    }

    const reportFiltersData = await getReportFilterParameters(report.id);
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

    const { dateStart, dateEnd } = calculatePeriodDates(
      scheduleDateFormatted,
      report.periodCode,
      report.startTime,
      report.endTime
    );

    const execution = await createReportExecution(
      report.id,
      scheduleDateFormatted,
      filters,
      report.emails,
      dateStart,
      dateEnd
    );

    logger.info(
      `Registro de execução criado para ${
        isToday ? "hoje" : "amanhã"
      } com ID: ${execution[0].id}`
    );
  }
}
