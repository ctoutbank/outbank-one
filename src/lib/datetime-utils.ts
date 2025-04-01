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

export function convertUTCToSaoPaulo(
  utcDate: string,
  formatoBrasileiro: boolean = false
): string {
  if (!utcDate) {
    throw new Error("Data UTC não pode ser vazia");
  }

  // Normalizar o formato da data (substituir espaço por T e adicionar Z se necessário)
  const normalizedDate = utcDate
    .replace(" ", "T")
    .replace(/(\d{2}:\d{2}:\d{2})$/, "$1Z");

  // Passo 1: Criar objeto DateTime a partir da data UTC
  const dateUTC = DateTime.fromISO(normalizedDate, { zone: "utc" });

  // Verificar se a data é válida
  if (!dateUTC.isValid) {
    throw new Error(`Data UTC inválida: ${dateUTC.invalidReason} - ${dateUTC.invalidExplanation}
Formato esperado: YYYY-MM-DD HH:mm:ss ou YYYY-MM-DDTHH:mm:ssZ`);
  }

  // Passo 2: Converter para o fuso horário de São Paulo
  const dateSP = dateUTC.setZone("America/Sao_Paulo");

  // Verificar se a conversão foi bem sucedida
  if (!dateSP.isValid) {
    throw new Error(
      `Erro na conversão para fuso horário de São Paulo: ${dateSP.invalidReason}`
    );
  }

  // Passo 3: Retornar a data no formato solicitado
  if (formatoBrasileiro) {
    return dateSP.toFormat("dd/MM/yyyy HH:mm:ss");
  }

  const result = dateSP.toISO();
  if (!result) {
    throw new Error(`Erro ao formatar data: ${dateSP.toString()}`);
  }

  return result;
}

export function convertUTCToSaoPauloBR(utcDate: string): string {
  return convertUTCToSaoPaulo(utcDate, true);
}
