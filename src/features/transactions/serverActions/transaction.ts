"use server";

import { getUserMerchantSlugs } from "@/features/users/server/users";
import { getDateUTC } from "@/lib/datetime-utils";
import {
  and,
  count,
  eq,
  gte,
  ilike,
  inArray,
  like,
  lte,
  notInArray,
  sql,
} from "drizzle-orm";
import {
  categories,
  merchants, payout,
  solicitationBrandProductType,
  solicitationFee,
  solicitationFeeBrand,
  terminals,
  transactions
} from "../../../../drizzle/schema";
import { db } from "../../../server/db/index";

export type Transaction = typeof transactions.$inferSelect;
export type TransactionsListRecord = {
  slug: string;
  dtInsert: string | null;
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
  feeAdmin: number | null;
  transactionMdr: number | null;
  lucro: number | null;
  repasse: number | null;
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
    pageSize: number = 10,
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
  console.log("Entrei na função");

  if (filterByUserMerchant) {
    const userMerchants = await getUserMerchantSlugs();
    if (!userMerchants.fullAccess && userMerchants.slugMerchants.length > 0) {
      conditions.push(inArray(transactions.slugMerchant, userMerchants.slugMerchants));
    } else if (!userMerchants.fullAccess) {
      return { transactions: [], totalCount: 0 };
    }
  }

  if (status) {
    const statusValues = status.split(",").map((s) => s.trim());
    conditions.push(
        statusValues.length > 1
            ? inArray(transactions.transactionStatus, statusValues)
            : eq(transactions.transactionStatus, status)
    );
  }

  if (merchant) {
    conditions.push(ilike(transactions.merchantName, `%${merchant}%`));
  }

  if (dateFrom) {
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo");
    if (dateFromUTC) conditions.push(gte(transactions.dtInsert, dateFromUTC));
  }

  if (dateTo) {
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo");
    if (dateToUTC) conditions.push(lte(transactions.dtInsert, dateToUTC));
  }

  if (productType) {
    const values = productType.split(",").map((v) => v.trim());
    conditions.push(values.length > 1 ? inArray(transactions.productType, values) : eq(transactions.productType, productType));
  }

  if (brand) {
    const values = brand.split(",").map((v) => v.trim());
    conditions.push(values.length > 1 ? inArray(transactions.brand, values) : eq(transactions.brand, brand));
  }

  if (nsu) conditions.push(eq(transactions.muid, nsu));
  if (method) {
    const values = method.split(",").map((v) => v.trim());
    conditions.push(values.length > 1 ? inArray(transactions.methodType, values) : eq(transactions.methodType, method));
  }

  if (salesChannel) {
    const values = salesChannel.split(",").map((v) => v.trim());
    conditions.push(values.length > 1 ? inArray(transactions.salesChannel, values) : eq(transactions.salesChannel, salesChannel));
  }

  if (terminal) conditions.push(like(terminals.logicalNumber, `%${terminal}%`));
  if (valueMin) conditions.push(gte(transactions.totalAmount, valueMin));
  if (valueMax) conditions.push(lte(transactions.totalAmount, valueMax));

  const whereClause = conditions.length ? and(...conditions) : undefined;

  console.log("datas", dateFrom, dateTo)

  const baseQuery = db
      .select({
        slug: transactions.slug,
        dateInsert: transactions.dtInsert,
        nsu: transactions.muid,
        merchantName: merchants.name,
        merchantCNPJ: merchants.idDocument,
        terminalType: terminals.type,
        terminalLogicalNumber: terminals.logicalNumber,
        method: transactions.methodType,
        salesChannel: transactions.salesChannel,
        productType: transactions.productType,
        brand: transactions.brand,
        transactionStatus: transactions.transactionStatus,
        amount: transactions.totalAmount,
        feeAdmin: solicitationBrandProductType.feeAdmin,
        transactionMdr: payout.transactionMdr,
        })
      .from(transactions)
      .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
      .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
      .leftJoin(categories, eq(merchants.slugCategory, categories.slug))
      .leftJoin(solicitationFee, eq(categories.mcc, solicitationFee.mcc))
      .leftJoin(solicitationFeeBrand, and(
          eq(solicitationFeeBrand.solicitationFeeId, solicitationFee.id),
          eq(solicitationFeeBrand.brand, transactions.brand)
      ))
      .leftJoin(solicitationBrandProductType, and(
          eq(solicitationBrandProductType.solicitationFeeBrandId, solicitationFeeBrand.id),
          eq(solicitationBrandProductType.productType,
              sql`SPLIT_PART(${transactions.productType}, '_', 1)`
          )
      ))
      .leftJoin(
          payout,
          sql`${payout.payoutId}::uuid = ${transactions.slug}`
      )
      .where(whereClause)
      .orderBy(transactions.dtInsert);

  const transactionList = page === -1 ? await baseQuery : await baseQuery.limit(pageSize).offset((page - 1) * pageSize);


  const totalCount =
      page !== -1
          ? (await db.select({ count: count() }).from(transactions).where(whereClause))[0].count
          : transactionList.length;


  const result = transactionList.map((item) => {
    const amount = item.amount !== null ? parseFloat(item.amount.toString()) : null;
    const feeAdmin = item.feeAdmin !== null ? parseFloat(item.feeAdmin.toString()) : null;
    const transactionMdr = item.transactionMdr !== null ? parseFloat(item.transactionMdr) : null;

    const lucro = transactionMdr !== null && feeAdmin !== null
        ? transactionMdr - feeAdmin
        : null;

    const repasse = lucro !== null && amount !== null
        ? lucro * amount
        : null;

    return {
      slug: item.slug,
      dtInsert: item.dateInsert ?? null,
      nsu: item.nsu ?? null,
      id: item.nsu ?? '',
      merchantName: item.merchantName ?? null,
      merchantCNPJ: item.merchantCNPJ ?? null,
      terminalType: item.terminalType ?? null,
      terminalLogicalNumber: item.terminalLogicalNumber ?? null,
      method: item.method ?? null,
      salesChannel: item.salesChannel ?? null,
      productType: item.productType ?? null,
      brand: item.brand ?? null,
      transactionStatus: item.transactionStatus ?? null,
      amount,
      feeAdmin,
      transactionMdr,
      lucro,
      repasse,
    };
  });

  return {
    transactions: result,
    totalCount
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

export async function normalizeDateRange(
  start: string,
  end: string
): Promise<{ start: string; end: string }> {
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
export type GetTotalTransactionsResults = {
  total_transactions: number;
  total_volume: string; // Numeric vem como string
  gross_revenue: string;
  admin_cost: string;
  profit_margin_pct: string;
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

export async function getTotalTransactionsByMonth(
  dateFrom: string,
  dateTo: string,
  viewMode?: string
): Promise<GetTotalTransactionsByMonthResult[]> {
  const conditions: any[] = [];

  if (dateFrom) {
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo")!;
    conditions.push(gte(transactions.dtInsert, dateFromUTC));
  }
  if (dateTo) {
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo")!;
    conditions.push(lte(transactions.dtInsert, dateToUTC));
  }

  conditions.push(
    notInArray(transactions.transactionStatus, [
      "CANCELED",
      "DENIED",
      "PROCESSING",
    ])
  );

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${and(...conditions)}` : sql``;

  const isHourlyView = viewMode === "today" || viewMode === "yesterday";
  const isWeeklyView = viewMode === "week";
  const isMonthlyView = viewMode === "month";

  const dateExpression = isHourlyView
    ? sql`EXTRACT(HOUR FROM b.dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
    : isWeeklyView
      ? sql`EXTRACT(DOW FROM b.dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
      : isMonthlyView
        ? sql`EXTRACT(DAY FROM b.dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : sql`DATE_TRUNC('month', b.dt_insert AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`;

  const result = await db.execute(sql`
    WITH ranked_mtp AS (
      SELECT *,
        ROW_NUMBER() OVER (
          PARTITION BY id_merchant_price_group
          ORDER BY id
        ) AS rn
      FROM merchant_transaction_price
      WHERE installment_transaction_fee_start = 1
        AND installment_transaction_fee_end = 1
    ),
    filtered_mtp AS (
      SELECT *
      FROM ranked_mtp
      WHERE rn = 1
    ),
    base AS (
      SELECT
        transactions.total_amount,
        COALESCE(
          filtered_mtp.card_transaction_mdr
        ) AS applied_mdr,
        transactions.product_type,
        transactions.brand,
        categories.mcc,
        transactions.dt_insert
      FROM transactions
      LEFT JOIN merchants ON merchants.slug = transactions.slug_merchant
      LEFT JOIN categories ON categories.id = merchants.id_category
      LEFT JOIN merchant_price
        ON merchant_price.slug_merchant = transactions.slug_merchant
        AND merchant_price.active = TRUE
      LEFT JOIN merchant_price_group
        ON merchant_price_group.id_merchant_price = merchant_price.id
        AND merchant_price_group.brand = transactions.brand
        AND merchant_price_group.active = TRUE
      LEFT JOIN filtered_mtp
        ON filtered_mtp.id_merchant_price_group = merchant_price_group.id
        AND filtered_mtp.producttype = transactions.product_type
      ${whereClause}
    ),
    fee_lookup AS (
      SELECT
        sbpt.product_type,
        sbpt.fee_admin AS fee_admin,
        sbpt.no_card_fee_admin AS no_card_fee_admin,
        sfb.brand,
        sf.mcc
      FROM solicitation_fee sf
      JOIN solicitation_fee_brand sfb ON sfb.solicitation_fee_id = sf.id
      JOIN solicitation_brand_product_type sbpt
        ON sbpt.solicitation_fee_brand_id = sfb.id
      WHERE sf.status = 'COMPLETED' AND sbpt.transaction_fee_start IS NULL AND sbpt.transaction_fee_end IS NULL
    )
    SELECT
      ${dateExpression} AS date,
      SUM(b.total_amount) AS sum,
      COUNT(1) AS count,
      SUM(CASE
      WHEN b.applied_mdr = 0 THEN 0
      ELSE b.total_amount * (b.applied_mdr - 1.12)
      END
     )  AS revenue
    FROM base b
    LEFT JOIN fee_lookup fl
      ON fl.product_type = b.product_type
      AND fl.brand = b.brand
      AND fl.mcc = b.mcc
    GROUP BY date
    ORDER BY date ASC
  `);

  const rows = result.rows as Array<{
    date: string | number | Date;
    sum: string;
    count: number;
    revenue: string;
  }>;

  const totals: GetTotalTransactionsByMonthResult[] = rows.map((item) => ({
    bruto: parseFloat(item.sum || "0"),
    count: item.count,
    lucro: parseFloat(item.revenue || "0"),
    date: isHourlyView ? new Date(dateFrom) : (item.date as Date),
    hour: isHourlyView ? Number(item.date) : undefined,
    dayOfWeek: isWeeklyView ? Number(item.date) : undefined,
    dayOfMonth: isMonthlyView ? Number(item.date) : undefined,
  }));

  if (isHourlyView) {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    return hours.map(
      (hour) =>
        totals.find((t) => t.hour === hour) || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(dateFrom),
          hour,
        }
    );
  }

  if (isWeeklyView) {
    const days = Array.from({ length: 7 }, (_, i) => i);
    return days.map(
      (day) =>
        totals.find((t) => t.dayOfWeek === day) || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(dateFrom),
          dayOfWeek: day,
        }
    );
  }

  if (isMonthlyView) {
    const dateF = new Date(dateFrom);
    const lastDay = new Date(
      dateF.getFullYear(),
      dateF.getMonth() + 1,
      0
    ).getDate();
    const days = Array.from({ length: lastDay }, (_, i) => i + 1);
    const [year, month] = dateFrom.split("T")[0].split("-").map(Number);
    return days.map(
      (day) =>
        totals.find((t) => t.dayOfMonth === day) || {
          bruto: 0,
          count: 0,
          lucro: 0,
          date: new Date(year, month - 1, day),
          dayOfMonth: day,
        }
    );
  }

  return totals;
}

export async function getTotalMerchants() {
  const result = await db.execute(sql`
    SELECT 
      COUNT(1) AS total
    FROM merchants
  `);

  const data = result.rows as MerchantTotal[];
  console.log(data);
  return data;
}

export async function getTotalTransactions(
  dateFrom: string,
  dateTo: string
): Promise<GetTotalTransactionsResult[]> {
  const conditions = [];

  if (dateFrom) {
    const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo")!;
    conditions.push(gte(transactions.dtInsert, dateFromUTC));
    console.log(dateFromUTC);
  }
  if (dateTo) {
    const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo")!;
    conditions.push(lte(transactions.dtInsert, dateToUTC));
    console.log(dateToUTC);
  } 

  // ignorar transações inválidas
  conditions.push(
    notInArray(transactions.transactionStatus, [
      "CANCELED",
      "DENIED",
      "PROCESSING",
    ])
  );

  const whereClause =
    conditions.length > 0 ? sql`WHERE ${and(...conditions)}` : sql``;

  const result = await db.execute(sql`
  WITH ranked_mtp AS (
  SELECT *,
         ROW_NUMBER() OVER (
           PARTITION BY id_merchant_price_group
           ORDER BY id 
         ) AS rn
  FROM merchant_transaction_price
  WHERE installment_transaction_fee_start = 1
    AND installment_transaction_fee_end = 1
),
filtered_mtp AS (
  SELECT *
  FROM ranked_mtp
  WHERE rn = 1
),
base AS (
  SELECT
    transactions.total_amount,
    COALESCE(
      filtered_mtp.card_transaction_mdr
    ) AS applied_mdr,
    transactions.product_type, 
    transactions.brand,
    categories.mcc AS mcc
  FROM transactions 
  LEFT JOIN merchants ON merchants.slug = transactions.slug_merchant
  LEFT JOIN categories ON categories.id = merchants.id_category
  LEFT JOIN merchant_price
    ON merchant_price.slug_merchant = transactions.slug_merchant
   AND merchant_price.active = TRUE
  LEFT JOIN merchant_price_group
    ON merchant_price_group.id_merchant_price = merchant_price.id
   AND merchant_price_group.brand  = transactions.brand
   AND merchant_price_group.active = TRUE
  LEFT JOIN filtered_mtp 
    ON filtered_mtp.id_merchant_price_group = merchant_price_group.id
   AND filtered_mtp.producttype = transactions.product_type
  ${whereClause}
),
fee_lookup AS (
  SELECT
    solicitation_brand_product_type.product_type,
    solicitation_brand_product_type.fee_admin AS fee_admin,
    solicitation_brand_product_type.no_card_fee_admin AS no_card_fee_admin,
    solicitation_fee_brand.brand,
    solicitation_fee.mcc
  FROM solicitation_fee
  JOIN solicitation_fee_brand
    ON solicitation_fee_brand.solicitation_fee_id = solicitation_fee.id
  JOIN solicitation_brand_product_type 
    ON solicitation_brand_product_type.solicitation_fee_brand_id = solicitation_fee_brand.id
    WHERE solicitation_fee.status = 'COMPLETED' 
    AND  solicitation_brand_product_type.transaction_fee_start IS NULL
    AND  solicitation_brand_product_type.transaction_fee_end IS NULL
)
SELECT
  SUM(b.total_amount) AS sum,
  COUNT(1) AS count,
   SUM(CASE
  WHEN b.applied_mdr = 0 THEN 0
  ELSE b.total_amount * (b.applied_mdr - 1.12)
  END
  ) AS revenue
FROM base b
LEFT JOIN fee_lookup
  ON fee_lookup.product_type = b.product_type
  AND fee_lookup.brand = b.brand 
  AND fee_lookup.mcc = b.mcc`);

  return result.rows as GetTotalTransactionsResult[];
}
