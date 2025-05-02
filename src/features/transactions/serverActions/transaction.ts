"use server";

import { getUserMerchantSlugs } from "@/features/users/server/users";
import { getDateUTC } from "@/lib/datetime-utils";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  like,
  lte,
  notInArray,
  sql,
  sum,
} from "drizzle-orm";
import { merchants, terminals, transactions } from "../../../../drizzle/schema";
import { db } from "../../../server/db/index";

export type Transaction = typeof transactions.$inferSelect;
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
  salesChannel: string | null;
  productType: string | null;
  brand: string | null;
  transactionStatus: string | null;
  amount: number | null;
};
export type TransactionsList = {
  transactions: TransactionsListRecord[];
  totalCount: number;
};

export type MerchantTotal = {
  total: number;
};

export async function getTransactions(
  page: number = 1,
  pageSize: number = 100,
  status?: string,
  merchant?: string,
  dateFrom?: string,
  dateTo?: string,
  productType?: string,
  brand?: string,
  nsu?: string,
  method?: string,
  salesChannel?: string,
  terminal?: string,
  valueMin?: string,
  valueMax?: string,
  filterByUserMerchant?: boolean
): Promise<TransactionsList> {
  const conditions = [];

  if (filterByUserMerchant) {
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
        };
      }
    }
  }

  if (status) {
    console.log("status", status);
    conditions.push(like(transactions.transactionStatus, `%${status}%`));
    // Verificar se status contém múltiplos valores separados por vírgula
    const statusValues = status.split(",").map((s) => s.trim());
    if (statusValues.length > 1) {
      conditions.push(inArray(transactions.transactionStatus, statusValues));
    } else {
      conditions.push(eq(transactions.transactionStatus, status));
    }
  }

  if (merchant) {
    console.log("merchant", merchant);
    conditions.push(ilike(transactions.merchantName, `%${merchant}%`));
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
    console.log("productType", productType);

    // Verificar se productType contém múltiplos valores separados por vírgula
    const productTypeValues = productType.split(",").map((p) => p.trim());
    if (productTypeValues.length > 1) {
      conditions.push(inArray(transactions.productType, productTypeValues));
    } else {
      conditions.push(eq(transactions.productType, productType));
    }
  }

  // Adicionar novos filtros
  if (brand) {
    // Verificar se brand contém múltiplos valores separados por vírgula
    const brandValues = brand.split(",").map((b) => b.trim());
    if (brandValues.length > 1) {
      conditions.push(inArray(transactions.brand, brandValues));
    } else {
      conditions.push(eq(transactions.brand, brand));
    }
  }

  if (nsu) {
    conditions.push(eq(transactions.muid, nsu));
  }

  if (method) {
    // Verificar se method contém múltiplos valores separados por vírgula
    const methodValues = method.split(",").map((m) => m.trim());
    if (methodValues.length > 1) {
      conditions.push(inArray(transactions.methodType, methodValues));
    } else {
      conditions.push(eq(transactions.methodType, method));
    }
  }

  if (salesChannel) {
    // Verificar se salesChannel contém múltiplos valores separados por vírgula
    const salesChannelValues = salesChannel.split(",").map((s) => s.trim());
    if (salesChannelValues.length > 1) {
      conditions.push(inArray(transactions.salesChannel, salesChannelValues));
    } else {
      conditions.push(eq(transactions.salesChannel, salesChannel));
    }
  }

  if (terminal) {
    conditions.push(like(terminals.logicalNumber, `%${terminal}%`));
  }

  // Adicionar filtros de valor
  if (valueMin) {
    conditions.push(gte(transactions.totalAmount, valueMin));
  }

  if (valueMax) {
    conditions.push(lte(transactions.totalAmount, valueMax));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  console.log("whereClause", whereClause);

  let transactionList;
  let totalCount;
  if (page !== -1) {
    transactionList = await db
      .select()
      .from(transactions)
      .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
      .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
      .where(whereClause)
      .orderBy(desc(transactions.dtInsert))
      .offset((page - 1) * pageSize)
      .limit(pageSize);
    totalCount = await db
      .select({ count: count() })
      .from(transactions)
      .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
      .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
      .where(whereClause);
  } else {
    console.log("page -1");
    transactionList = await db
      .select()
      .from(transactions)
      .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
      .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
      .where(whereClause);
  }
  return {
    transactions: transactionList.map((item) => ({
      slug: item.transactions.slug,
      dateInsert: item.transactions.dtInsert,
      nsu: item.transactions.muid || "",
      id: item.transactions.muid || "",
      merchantName: item.merchants?.name || "",
      merchantCNPJ: item.merchants?.idDocument || "",
      terminalType: item.terminals?.type || "",
      terminalLogicalNumber: item.terminals?.logicalNumber || "",
      method: item.transactions.methodType || "",
      salesChannel: item.transactions.salesChannel || "",
      productType: item.transactions.productType || "",
      brand: item.transactions.brand || "",
      transactionStatus: item.transactions.transactionStatus || "",
      amount: item.transactions.totalAmount
        ? parseFloat(item.transactions.totalAmount)
        : 0,
    })),
    totalCount: totalCount ? totalCount[0].count : 0,
  };
}

export type TransactionsGroupedReport = {
  product_type: string;
  brand: string;
  count: number;
  total_amount: number;
  transaction_status: string;
  date: string;
};
function normalizeDateRange(
  start: string,
  end: string
): { start: string; end: string } {
  // Normaliza o início para 'YYYY-MM-DDT00:00:00'
  const startDate = start.split("T")[0] + "T00:00:00";

  // Extrai a data final e adiciona 1 dia
  const endDatePart = end.split("T")[0];
  const date = new Date(endDatePart + "T00:00:00Z");
  const nextDay = date.toISOString().split("T")[0];
  console.log(nextDay);

  // Final fica como 'YYYY-MM-DDT23:59:59'
  const endDate = `${nextDay}T23:59:59`;

  return { start: startDate, end: endDate };
}

export async function getTransactionsGroupedReport(
  dateFrom: string,
  dateTo: string,
  status?: string,
  productType?: string,
  brand?: string,
  method?: string,
  salesChannel?: string,
  terminal?: string,
  valueMin?: string,
  valueMax?: string,
  merchant?: string
): Promise<TransactionsGroupedReport[]> {
  // Construir condições dinâmicas para a consulta SQL
  const conditions = [];

  // Adicionar condições de data (sempre presentes)
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

  // Adicionar novos filtros
  if (brand) {
    // Verificar se brand contém múltiplos valores separados por vírgula
    const brandValues = brand.split(",").map((b) => b.trim());
    if (brandValues.length > 1) {
      conditions.push(inArray(transactions.brand, brandValues));
    } else {
      conditions.push(eq(transactions.brand, brand));
    }
  }

  if (method) {
    // Verificar se method contém múltiplos valores separados por vírgula
    const methodValues = method.split(",").map((m) => m.trim());
    if (methodValues.length > 1) {
      conditions.push(inArray(transactions.methodType, methodValues));
    } else {
      conditions.push(eq(transactions.methodType, method));
    }
  }

  if (salesChannel) {
    // Verificar se salesChannel contém múltiplos valores separados por vírgula
    const salesChannelValues = salesChannel.split(",").map((s) => s.trim());
    if (salesChannelValues.length > 1) {
      conditions.push(inArray(transactions.salesChannel, salesChannelValues));
    } else {
      conditions.push(eq(transactions.salesChannel, salesChannel));
    }
  }

  if (terminal) {
    conditions.push(like(terminals.logicalNumber, `%${terminal}%`));
  }

  // Adicionar filtros de valor
  if (valueMin) {
    conditions.push(gte(transactions.totalAmount, valueMin));
  }

  if (valueMax) {
    conditions.push(lte(transactions.totalAmount, valueMax));
  }

  if (merchant) {
    conditions.push(ilike(transactions.merchantName, `%${merchant}%`));
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
  console.log(result.rows as TransactionsGroupedReport[]);
  return result.rows as TransactionsGroupedReport[];
}

export type GetTotalTransactionsResult = {
  sum?: number;
  count?: number;
  revenue?: number;
};

export type GetTotalTransactionsByMonthResult = {
  bruto: number;
  lucro: number;
  count: number;
  date?: Date;
  hour?: number;
  dayOfWeek?: number;
  dayOfMonth?: number;
};

export async function getTotalTransactions(dateFrom: string, dateTo: string) {
  const conditions = [];
  const normalizeDate = normalizeDateRange(dateFrom, dateTo);
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

export async function getTotalTransactionsByMonth(
  dateFrom: string,
  dateTo: string,
  viewMode?: string
) {
  const conditions = [];
  const normalizeDate = normalizeDateRange(dateFrom, dateTo);
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

  const isHourlyView = viewMode === "today" || viewMode === "yesterday";
  const isWeeklyView = viewMode === "week";
  const isMonthlyView = viewMode === "month";

  const result = await db
    .select({
      sum: sum(transactions.totalAmount),
      count: count(),
      date: isHourlyView
        ? sql`EXTRACT(HOUR FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : isWeeklyView
        ? sql`EXTRACT(DOW FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : isMonthlyView
        ? sql`EXTRACT(DAY FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : sql`DATE(dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`,
    })
    .from(transactions)
    .where(whereClause)
    .groupBy(
      isHourlyView
        ? sql`EXTRACT(HOUR FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : isWeeklyView
        ? sql`EXTRACT(DOW FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : isMonthlyView
        ? sql`EXTRACT(DAY FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : sql`DATE(dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
    )
    .orderBy(
      isHourlyView
        ? sql`EXTRACT(HOUR FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo') ASC`
        : isWeeklyView
        ? sql`EXTRACT(DOW FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo') ASC`
        : isMonthlyView
        ? sql`EXTRACT(DAY FROM dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo') ASC`
        : sql`DATE(dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo') ASC`
    );

  const totals: GetTotalTransactionsByMonthResult[] = result.map((item) => ({
    bruto: item.sum ? parseFloat(item.sum) : 0,
    count: item.count,
    lucro: item.sum ? parseFloat(item.sum) * 0.08 : 0,
    date: isHourlyView ? new Date(dateFrom) : (item.date as Date),
    hour: isHourlyView ? Number(item.date) : undefined,
    dayOfWeek: isWeeklyView ? Number(item.date) : undefined,
    dayOfMonth: isMonthlyView ? Number(item.date) : undefined,
  }));

  // For hourly view, ensure we have all hours from 0 to 23
  if (isHourlyView) {
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return hours.map((hour) => {
      const existingData = totals.find((item) => item.hour === hour);
      console.log(existingData);
      return (
        existingData || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(dateFrom),
          hour,
        }
      );
    });
  }

  // For weekly view, ensure we have all days from 0 (Sunday) to 6 (Saturday)
  if (isWeeklyView) {
    const days = Array.from({ length: 7 }, (_, i) => i);

    return days.map((day) => {
      const existingData = totals.find((item) => item.dayOfWeek === day);
      return (
        existingData || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(dateFrom),
          dayOfWeek: day,
        }
      );
    });
  }

  // For monthly view, ensure we have all days from 1 to last day of month
  if (isMonthlyView) {
    const dateF = new Date(dateFrom);
    const lastDayOfMonth = new Date(
      dateF.getFullYear(),
      dateF.getMonth() + 1,
      0
    ).getDate();
    const days = Array.from({ length: lastDayOfMonth }, (_, i) => i + 1);
    const [year, month] = dateFrom.split("T")[0].split("-").map(Number);
    return days.map((day) => {
      const existingData = totals.find((item) => item.dayOfMonth === day);
      return (
        existingData || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(year, month, day),
          dayOfMonth: day,
        }
      );
    });
  }
  console.log(totals);
  return totals;
}

export async function getTotalMerchants(dateFrom: string, dateTo: string) {
  const conditions = [];
  const normalizeDate = normalizeDateRange(dateFrom, dateTo);
  if (dateFrom) {
    console.log(normalizeDate.start);
    const dateFromUTC = getDateUTC(normalizeDate.start, "America/Sao_Paulo");
    console.log(dateFromUTC);
    conditions.push(gte(merchants.dtinsert, dateFromUTC!));
  }

  if (dateTo) {
    console.log(normalizeDate.end);
    const dateToUTC = getDateUTC(normalizeDate.end, "America/Sao_Paulo");
    console.log(dateToUTC);
    conditions.push(lte(merchants.dtinsert, dateToUTC!));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const result = await db.execute(sql`
    SELECT 
      COUNT(1) AS count
    FROM merchants
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
  `);
  const data = result.rows as MerchantTotal[];
  console.log(data);
  return data;
}
