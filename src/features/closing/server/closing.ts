import { normalizeDateRange } from "@/features/transactions/serverActions/transaction";
import { getDateUTC } from "@/lib/datetime-utils";
import { db } from "@/server/db";
import { and, gte, lte, notInArray, sql } from "drizzle-orm";
import { transactions } from "../../../../drizzle/schema";

export type GetTotalTransactionsResult = {
  sum?: number;
  count?: number;
  revenue?: number;
};

export type TransactionsGroupedReport = {
  product_type: string;
  brand: string;
  count: number;
  total_amount: number;
  transaction_status: string;
  date: string;
};

export async function getTransactionsGroupedReport(
  dateFrom: string,
  dateTo: string
): Promise<TransactionsGroupedReport[]> {
  // Construir condições dinâmicas para a consulta SQL
  const conditions = [];

  // Adicionar condições de data (sempre presentes)
  if (dateFrom) {
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo");

    conditions.push(gte(transactions.dtInsert, dateFromUTC!));
  }

  if (dateTo) {
    console.log(dateTo);
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo");

    conditions.push(lte(transactions.dtInsert, dateToUTC!));
  }

  // Construir a cláusula WHERE
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  // Usar SQL para agrupar os resultados
  const result = await db.execute(sql`
    SELECT 
      product_type, 
      brand,
      count(1) as count,
      sum(total_amount) as total_amount, 
      transaction_status,
      DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo') as date
    FROM transactions
    LEFT JOIN terminals ON transactions.slug_terminal = terminals.slug
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
    GROUP BY product_type, brand, DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo'), transaction_status
    ORDER BY DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo') DESC
  `);
  console.log(result.rows as TransactionsGroupedReport[]);
  return result.rows as TransactionsGroupedReport[];
}

export async function getTotalTransactions(dateFrom: string, dateTo: string) {
  const conditions = [];
  const normalizeDate = await normalizeDateRange(dateFrom, dateTo);
  if (dateFrom) {
    console.log(normalizeDate.start);
    const dateFromUTC = getDateUTC(normalizeDate.start, "America/Sao_Paulo");
    console.log(dateFromUTC);
    conditions.push(gte(transactions.dtInsert, dateFromUTC!));
  }

  if (dateTo) {
    console.log(normalizeDate.end);
    const dateToUTC = getDateUTC(normalizeDate.end, "America/Sao_Paulo");
    console.log(dateToUTC);
    conditions.push(lte(transactions.dtInsert, dateToUTC!));
  }
  const statusFilter = notInArray(transactions.transactionStatus, [
    "CANCELED",
    "DENIED",
    "PROCESSING",
  ]);
  conditions.push(statusFilter);
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db.execute(sql`
    SELECT 
      SUM(total_amount) AS sum,
      COUNT(1) AS count,
      SUM(total_amount) * 0.08 AS revenue
    FROM transactions
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
  `);
  const data = result.rows as GetTotalTransactionsResult[];
  console.log(data);
  return data;
}
