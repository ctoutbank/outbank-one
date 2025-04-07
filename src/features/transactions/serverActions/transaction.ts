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
import { merchants, terminals, transactions } from "../../../../drizzle/schema";
import { db } from "../../../server/db/index";

export type TransactionsListRecord = {
  slug: string;
  dateInsert: string | null;
  nsu: string | null;
  id: string;
  merchantName: string | null;
  merchantCNPJ: string | null;
  terminalType: string | null;
  terminalLogicalNumber: string | null;
  method: string | null;
  productType: string | null;
  brand: string | null;
  transactionStatus: string | null;
  amount: number | null;
};

export type TransactionList = {
  transactions: TransactionsListRecord[];
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
      .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
      .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
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
  console.log("result", result);
  return {
    transactions: result.map((item) => ({
      slug: item.transactions.slug,
      dateInsert: item.transactions.dtInsert,
      nsu: item.transactions.muid || "",
      id: item.transactions.muid || "",
      merchantName: item.merchants?.name || "",
      merchantCNPJ: item.merchants?.idDocument || "",
      terminalType: item.terminals?.type || "",
      terminalLogicalNumber: item.terminals?.logicalNumber || "",
      method: item.transactions.methodType || "",
      productType: item.transactions.productType || "",
      brand: item.transactions.brand || "",
      transactionStatus: item.transactions.transactionStatus || "",
      amount: item.transactions.totalAmount
        ? parseFloat(item.transactions.totalAmount)
        : 0,
    })),
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
    .select({
      slug: transactions.slug,
      dateInsert: transactions.dtInsert,
      nsu: transactions.muid,
      id: transactions.muid,
      merchantName: merchants.name,
      merchantCNPJ: merchants.idDocument,
      terminalType: terminals.type,
      terminalLogicalNumber: terminals.logicalNumber,
      method: transactions.methodType,
      productType: transactions.productType,
      brand: transactions?.brand,
      transactionStatus: transactions.transactionStatus,
      amount: transactions.totalAmount,
    })
    .from(transactions)
    .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
    .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
    .where(whereClause)
    .orderBy(desc(transactions.dtInsert))
    .limit(100);

  return result as TransactionsListRecord[];
}

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
  dateTo: string,
  status?: string,
  productType?: string,
  terminalLogicalNumber?: string
): Promise<TransactionsGroupedReport[]> {
  // Construir condições dinâmicas para a consulta SQL
  const conditions = [];

  // Adicionar condições de data (sempre presentes)
  if (dateFrom) {
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo");
    conditions.push(gte(transactions.dtInsert, dateFromUTC!));
  }

  if (dateTo) {
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo");
    conditions.push(lte(transactions.dtInsert, dateToUTC!));
  }

  // Adicionar filtros condicionais opcionais
  if (status) {
    // Verificar se status contém múltiplos valores separados por vírgula
    const statusValues = status.split(",").map((s) => s.trim());
    if (statusValues.length > 1) {
      conditions.push(inArray(transactions.transactionStatus, statusValues));
    } else {
      conditions.push(eq(transactions.transactionStatus, status));
    }
  }

  if (productType) {
    // Verificar se productType contém múltiplos valores separados por vírgula
    const productTypeValues = productType.split(",").map((p) => p.trim());
    if (productTypeValues.length > 1) {
      conditions.push(inArray(transactions.productType, productTypeValues));
    } else {
      conditions.push(eq(transactions.productType, productType));
    }
  }

  if (terminalLogicalNumber) {
    conditions.push(eq(terminals.logicalNumber, terminalLogicalNumber));
  }

  // Construir a cláusula WHERE
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  console.log(whereClause);
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

  return result.rows as TransactionsGroupedReport[];
}
