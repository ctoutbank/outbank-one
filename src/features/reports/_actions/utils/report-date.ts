import { logger } from "@/features/reports/_actions/utils/report-logger";
import { format } from "date-fns";
import { DateTime } from "luxon";

export function createScheduledDateTime(date: Date, time: string): Date {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  console.log(
    `[REPORT-SCHEDULE] Combinando data ${format(
      date,
      "yyyy-MM-dd"
    )} com horário ${time}`
  );

  const scheduledDate = new Date(date);
  scheduledDate.setHours(hours, minutes, seconds, 0);

  return scheduledDate;
}

export function shouldExecuteReportBasedOnRecurrence(
  report: { recurrenceCode: string; dayWeek?: string; dayMonth?: string },
  targetDate: Date
): boolean {
  const dayOfWeek = format(targetDate, "EEEE").toLowerCase();
  const dayOfMonth = format(targetDate, "d");

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

export function calculatePeriodDates(
  scheduleDate: string,
  periodCode: string,
  startTime: string | null,
  endTime: string | null
) {
  const scheduleDateTime = DateTime.fromFormat(
    scheduleDate,
    "yyyy-MM-dd HH:mm:ss",
    { zone: "America/Sao_Paulo" }
  );

  if (!scheduleDateTime.isValid) {
    throw new Error(
      `Data de agendamento inválida: ${scheduleDate} - ${scheduleDateTime.invalidReason}`
    );
  }

  let dateStart: DateTime;
  let dateEnd: DateTime;

  switch (periodCode) {
    case "DT": // Dia Atual
      dateStart = scheduleDateTime.startOf("day");
      dateEnd = scheduleDateTime.endOf("day");
      break;

    case "DA": // Dia Anterior
      dateStart = scheduleDateTime.minus({ days: 1 }).startOf("day");
      dateEnd = scheduleDateTime.minus({ days: 1 }).endOf("day");
      break;

    case "SA": // Semana Atual (Domingo a Sábado)
      dateStart = scheduleDateTime.startOf("week");
      dateEnd = scheduleDateTime.endOf("week");
      break;

    case "SR": // Semana Anterior (Domingo a Sábado)
      dateStart = scheduleDateTime.minus({ weeks: 1 }).startOf("week");
      dateEnd = scheduleDateTime.minus({ weeks: 1 }).endOf("week");
      break;

    case "MA": // Mês Atual
      dateStart = scheduleDateTime.startOf("month");
      dateEnd = scheduleDateTime.endOf("month");
      break;

    case "MR": // Mês Anterior
      dateStart = scheduleDateTime.minus({ months: 1 }).startOf("month");
      dateEnd = scheduleDateTime.minus({ months: 1 }).endOf("month");
      break;

    default:
      throw new Error(`Código de período inválido: ${periodCode}`);
  }

  // Aplica os horários do relatório
  if (startTime) {
    const [hours, minutes] = startTime.split(":").map(Number);
    dateStart = dateStart.set({
      hour: hours,
      minute: minutes,
      second: 0,
      millisecond: 0,
    });
  }

  if (endTime) {
    const [hours, minutes] = endTime.split(":").map(Number);
    dateEnd = dateEnd.set({
      hour: hours,
      minute: minutes,
      second: 59,
      millisecond: 999,
    });
  }
  logger.info("Datas processadas", {
    dateStart: dateStart.toJSDate(),
    dateEnd: dateEnd.toJSDate(),
  });
  return { dateStart, dateEnd };
}
