"use server";

import { and, count, desc, eq, gte, like, lte, sql, sum } from "drizzle-orm";
import { transactions } from "../../../../drizzle/schema";
import { db } from "../../../server/db/index";

export type TransactionList = {
  transactions: Transaction[];
  totalCount: number;
  approved_count: number;
  pending_count: number;
  rejected_count: number;
  canceled_count: number;
  total_amount: number;
  revenue: number;
};

export type Transaction = typeof transactions.$inferSelect;

export async function getTransactions(
  search?: string,
  page: number = 1,
  pageSize: number = 100,
  status?: string,
  merchant?: string,
  dateFrom?: string,
  dateTo?: string,
  productType?: string
): Promise<TransactionList> {
  let conditions = [];

  if (search) {
    conditions.push(like(transactions.slug, `%${search}%`));
  }

  if (status) {
    conditions.push(like(transactions.transactionStatus, `%${status}%`));
  }

  if (merchant) {
    conditions.push(like(transactions.merchantName, `%${merchant}%`));
  }

  if (dateFrom) {
    conditions.push(
      gte(transactions.dtInsert, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(lte(transactions.dtInsert, new Date(dateTo).toISOString()));
  }

  if (productType) {
    conditions.push(eq(transactions.productType, productType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(transactions)
    .where(whereClause)
    .orderBy(desc(transactions.dtInsert))
    .offset((page - 1) * pageSize)
    .limit(pageSize);

  const countResult = await db
    .select({ count: count() })
    .from(transactions)
    .where(whereClause);

  // Calcular contagens por status
  const approvedCount = await db
    .select({ count: count() })
    .from(transactions)
    .where(
      and(whereClause, like(transactions.transactionStatus, "%APPROVED%"))
    );

  const pendingCount = await db
    .select({ count: count() })
    .from(transactions)
    .where(and(whereClause, like(transactions.transactionStatus, "%PENDING%")));

  const rejectedCount = await db
    .select({ count: count() })
    .from(transactions)
    .where(
      and(whereClause, like(transactions.transactionStatus, "%REJECTED%"))
    );

  const canceledCount = await db
    .select({ count: count() })
    .from(transactions)
    .where(
      and(whereClause, like(transactions.transactionStatus, "%CANCELED%"))
    );

  // Calcular valor total
  const totalAmount = await db
    .select({ sum: sum(transactions.totalAmount) })
    .from(transactions)
    .where(whereClause);

  const total = totalAmount[0].sum ? parseFloat(totalAmount[0].sum) : 0;
  const revenue = total * 0.08; // 8% de receita

  return {
    transactions: result,
    totalCount: countResult[0].count,
    approved_count: approvedCount[0].count,
    pending_count: pendingCount[0].count,
    rejected_count: rejectedCount[0].count,
    canceled_count: canceledCount[0].count,
    total_amount: total,
    revenue,
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

export async function getTotalTransactions(
  dateFrom: Date | null,
  dateTo: Date | null
) {
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
