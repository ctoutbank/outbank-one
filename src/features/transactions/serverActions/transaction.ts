"use server";

import { getUserMerchantSlugs } from "@/features/users/server/users";
import { getDateUTC } from "@/lib/datetime-utils";
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  like,
  lte,
  sql,
  sum,
} from "drizzle-orm";
import { terminals, transactions } from "../../../../drizzle/schema";
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
  const conditions = [];

  const userMerchants = await getUserMerchantSlugs();

  if (userMerchants.fullAccess) {
  } else {
    if (userMerchants.slugMerchants.length > 0) {
      conditions.push(
        inArray(transactions.slugMerchant, userMerchants.slugMerchants)
      );
    } else {
      return {
        transactions: [],
        totalCount: 0,
        approved_count: 0,
        pending_count: 0,
        rejected_count: 0,
        canceled_count: 0,
        total_amount: 0,
        revenue: 0,
      };
    }
  }

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
    console.log(dateFrom);
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo");
    console.log(dateFromUTC);

    conditions.push(gte(transactions.dtInsert, dateFromUTC!));
  }

  if (dateTo) {
    console.log(dateTo);
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo");
    console.log(dateToUTC);
    conditions.push(lte(transactions.dtInsert, dateToUTC!));
  }

  if (productType) {
    conditions.push(eq(transactions.productType, productType));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [result, stats] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(whereClause)
      .orderBy(desc(transactions.dtInsert))
      .offset((page - 1) * pageSize)
      .limit(pageSize),
    db
      .select({
        totalCount: count(),
        approved_count: count(
          and(like(transactions.transactionStatus, "%APPROVED%"))
        ),
        pending_count: count(
          and(like(transactions.transactionStatus, "%PENDING%"))
        ),
        rejected_count: count(
          and(like(transactions.transactionStatus, "%REJECTED%"))
        ),
        canceled_count: count(
          and(like(transactions.transactionStatus, "%CANCELED%"))
        ),
        total_amount: sum(transactions.totalAmount),
      })
      .from(transactions)
      .where(whereClause),
  ]);

  const total = stats[0].total_amount ? parseFloat(stats[0].total_amount) : 0;
  const revenue = total * 0.08;

  return {
    transactions: result,
    totalCount: stats[0].totalCount,
    approved_count: stats[0].approved_count,
    pending_count: stats[0].pending_count,
    rejected_count: stats[0].rejected_count,
    canceled_count: stats[0].canceled_count,
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
  const conditions = [];

  const userMerchants = await getUserMerchantSlugs();

  if (userMerchants.fullAccess) {
  } else {
    if (userMerchants.slugMerchants.length > 0) {
      conditions.push(
        inArray(transactions.slugMerchant, userMerchants.slugMerchants)
      );
    } else {
      return {
        sum: 0,
        count: 0,
        revenue: 0,
      };
    }
  }

  if (dateFrom && dateTo) {
    conditions.push(
      and(
        gte(transactions.dtInsert, dateFrom.toISOString()),
        lte(transactions.dtInsert, dateTo.toISOString())
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select({ sum: sum(transactions.totalAmount), count: count() })
    .from(transactions)
    .where(whereClause);

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
  const conditions = [];

  const userMerchants = await getUserMerchantSlugs();

  if (userMerchants.fullAccess) {
  } else {
    if (userMerchants.slugMerchants.length > 0) {
      conditions.push(
        inArray(transactions.slugMerchant, userMerchants.slugMerchants)
      );
    } else {
      return [];
    }
  }

  conditions.push(
    and(
      gte(transactions.dtInsert, dateFrom.toISOString()),
      lte(transactions.dtInsert, dateTo.toISOString())
    )
  );

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select({
      sum: sum(transactions.totalAmount),
      count: count(),
      date: sql`DATE(dt_update::TIMESTAMP)`,
    })
    .from(transactions)
    .where(whereClause)
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

export async function getTransactionsForReport(
  search?: string,
  status?: string,
  merchant?: string,
  dateFrom?: string,
  dateTo?: string,
  productType?: string
) {
  const conditions = [];

  const userMerchants = await getUserMerchantSlugs();

  if (userMerchants.fullAccess) {
  } else {
    if (userMerchants.slugMerchants.length > 0) {
      conditions.push(
        inArray(transactions.slugMerchant, userMerchants.slugMerchants)
      );
    } else {
      return [];
    }
  }

  if (search) {
    conditions.push(like(transactions.slug, `%${search}%`));
  }

  if (status) {
    conditions.push(like(transactions.transactionStatus, `%${status}%`));
  }

  if (merchant) {
    conditions.push(like(transactions.merchantName, `%${merchant}%`));
  }

  if (productType) {
    conditions.push(eq(transactions.productType, productType));
  }
  if (dateFrom) {
    console.log(dateFrom);
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo");
    console.log(dateFromUTC);

    conditions.push(gte(transactions.dtInsert, dateFromUTC!));
  }

  if (dateTo) {
    console.log(dateTo);
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo");
    console.log(dateToUTC);
    conditions.push(lte(transactions.dtInsert, dateToUTC!));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db
    .select()
    .from(transactions)
    .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
    .where(whereClause)
    .orderBy(desc(transactions.dtInsert))
    .limit(100000);

  return result;
}
