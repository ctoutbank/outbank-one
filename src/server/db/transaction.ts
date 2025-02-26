"use server";

import { and, count, desc, gte, lte, sql, sum } from "drizzle-orm";
import { transactions } from "../../../drizzle/schema";
import { db } from "./index";

export type TransactionList = {
  transactions: Transaction[];
  totalCount: number;
};

export type Transaction = typeof transactions.$inferSelect;

export async function getTransactions(page: number = 1, limit: number = 100) {
  const result = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.dtInsert))
    .offset((page - 1) * limit)
    .limit(limit);

  const totalCount = await db.select({ count: count() }).from(transactions);

  return {
    transactions: result,
    totalCount: totalCount[0].count,
  };
}

export type GetTotalTransactionsResult = {
  sum: number;
  count: number;
  revenue: number;
};
export type GetTotalTransactionsByMonthResult = {
  bruto: number;
  lucro: number;
  count: number;
  date?: Date;
};

export async function getTotalTransactions(dateFrom: Date | null, dateTo: Date | null) {
  const result = await db
    .select({ sum: sum(transactions.totalAmount), count: count() })
    .from(transactions)
    .where(
      and(
        gte(transactions.dtInsert, dateFrom?.toISOString() || ""),
        lte(transactions.dtInsert, dateTo?.toISOString() || "")
      )
    );

  const totals: GetTotalTransactionsResult[] = result.map((item) => ({
    sum: item.sum ? parseFloat(item.sum) : 0,
    count: item.count,
    revenue: item.sum ? parseFloat(item.sum) * 0.08 : 0,
  }));

  return totals[0];
}

export async function getTotalTransactionsByMonth(
  dateFrom: Date,
  dateTo: Date
) {
  const result = await db
    .select({
      sum: sum(transactions.totalAmount),
      count: count(),
      date: sql`DATE(dt_update::TIMESTAMP)`,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.dtInsert, dateFrom.toISOString()),
        lte(transactions.dtInsert, dateTo.toISOString())
      )
    )
    .groupBy(sql`DATE(dt_update::TIMESTAMP)`)
    .orderBy(sql`DATE(dt_update::TIMESTAMP) ASC`);

  const totals: GetTotalTransactionsByMonthResult[] = result.map((item) => ({
    bruto: item.sum ? parseFloat(item.sum) : 0,
    count: item.count,
    lucro: item.sum ? parseFloat(item.sum) * 0.08 : 0,
    date: item.date as Date,
  }));

  return totals;
}
