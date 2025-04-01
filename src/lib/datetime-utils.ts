import { DateTime } from "luxon";

export function getDateUTC(date: string, timeZone: string) {
  // Passo 1: Interpretar os valores como pertencentes ao fuso horário especificado
  const dateTimezone = DateTime.fromISO(date, { zone: timeZone });

  // Passo 2: Converter para UTC
  const dateUTC = dateTimezone.toUTC();

  // Passo 3: Retornar objeto com as datas em formato ISO 8601
  return dateUTC.toISO();
}

export function detectTimeZone(): string {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return userTimeZone;
}
