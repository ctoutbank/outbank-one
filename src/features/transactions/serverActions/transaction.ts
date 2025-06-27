"use server";

import { getUserMerchantSlugs } from "@/features/users/server/users";
import { getDateUTC } from "@/lib/datetime-utils";
import { GetTransactionsResponse } from "@/server/integrations/dock/dock-transactions-type";
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
  merchants,
  payout,
  solicitationBrandProductType,
  solicitationFee,
  solicitationFeeBrand,
  terminals,
  transactions,
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

  if (filterByUserMerchant) {
    const userMerchants = await getUserMerchantSlugs();
    if (!userMerchants.fullAccess && userMerchants.slugMerchants.length > 0) {
      conditions.push(
        inArray(transactions.slugMerchant, userMerchants.slugMerchants)
      );
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
    conditions.push(
      values.length > 1
        ? inArray(transactions.productType, values)
        : eq(transactions.productType, productType)
    );
  }

  if (brand) {
    const values = brand.split(",").map((v) => v.trim());
    conditions.push(
      values.length > 1
        ? inArray(transactions.brand, values)
        : eq(transactions.brand, brand)
    );
  }

  if (nsu) conditions.push(eq(transactions.muid, nsu));
  if (method) {
    const values = method.split(",").map((v) => v.trim());
    conditions.push(
      values.length > 1
        ? inArray(transactions.methodType, values)
        : eq(transactions.methodType, method)
    );
  }

  if (salesChannel) {
    const values = salesChannel.split(",").map((v) => v.trim());
    conditions.push(
      values.length > 1
        ? inArray(transactions.salesChannel, values)
        : eq(transactions.salesChannel, salesChannel)
    );
  }

  if (terminal) conditions.push(like(terminals.logicalNumber, `%${terminal}%`));
  if (valueMin) conditions.push(gte(transactions.totalAmount, valueMin));
  if (valueMax) conditions.push(lte(transactions.totalAmount, valueMax));

  const whereClause = conditions.length ? and(...conditions) : undefined;

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
      transactionMdr: sql<number>`p2.transaction_mdr`,
    })
    .from(transactions)
    .leftJoin(merchants, eq(transactions.slugMerchant, merchants.slug))
    .leftJoin(terminals, eq(transactions.slugTerminal, terminals.slug))
    .leftJoin(categories, eq(merchants.slugCategory, categories.slug))
    .leftJoin(solicitationFee, eq(categories.mcc, solicitationFee.mcc))
    .leftJoin(
      solicitationFeeBrand,
      and(
        eq(solicitationFeeBrand.solicitationFeeId, solicitationFee.id),
        eq(solicitationFeeBrand.brand, transactions.brand)
      )
    )
    // LATERAL JOIN para pegar o maior installment_number
    .leftJoin(
      sql`LATERAL (
        SELECT p2.transaction_mdr, p2.installment_number
        FROM ${payout} AS p2
        WHERE p2.payout_id::uuid = ${transactions.slug}
        ORDER BY p2.installment_number DESC
        LIMIT 1
      ) AS p2`,
      sql`TRUE`
    )
    // JOIN no solicitationBrandProductType com o BETWEEN
    .leftJoin(
      solicitationBrandProductType,
      and(
        eq(
          solicitationBrandProductType.solicitationFeeBrandId,
          solicitationFeeBrand.id
        ),
        eq(
          solicitationBrandProductType.productType,
          sql`SPLIT_PART(${transactions.productType}, '_', 1)`
        ),
        sql`p2.installment_number BETWEEN ${solicitationBrandProductType.transactionFeeStart} AND ${solicitationBrandProductType.transactionFeeEnd}`
      )
    )
    .where(whereClause)
    .orderBy(transactions.dtInsert);

  const transactionList =
    page === -1
      ? await baseQuery
      : await baseQuery.limit(pageSize).offset((page - 1) * pageSize);

  const totalCount =
    page !== -1
      ? (
          await db
            .select({ count: count() })
            .from(transactions)
            .where(whereClause)
        )[0].count
      : transactionList.length;

  const result = transactionList.map((item) => {
    const amount =
      item.amount !== null ? parseFloat(item.amount.toString()) : null;
    const feeAdmin =
      item.feeAdmin !== null ? parseFloat(item.feeAdmin.toString()) : null;
    const transactionMdr =
      item.transactionMdr !== null
        ? parseFloat(item.transactionMdr.toString())
        : null;

    const lucro =
      transactionMdr !== null && feeAdmin !== null
        ? transactionMdr - feeAdmin
        : null;

    const repasse = lucro !== null && amount !== null ? lucro * amount : null;

    return {
      slug: item.slug,
      dtInsert: item.dateInsert ?? null,
      nsu: item.nsu ?? null,
      id: item.nsu ?? "",
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
    totalCount,
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

export type TransactionsDashboardTotals = {
  product_type: string;
  count: number;
  total_amount: number;
};

export type CancelledTransactions = {
  count: number;
};

export type TotalTransactionsByDay = {
  date: string;
  total_amount: number;
  lucro: number;
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
  const startTime = performance.now();
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
      "PENDING",
    ])
  );

  conditions.push(eq(solicitationFee.status, "COMPLETED"));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const isHourlyView = viewMode === "today" || viewMode === "yesterday";
  const isWeeklyView = viewMode === "week";
  const isMonthlyView = viewMode === "month";

  const dateExpression = isHourlyView
    ? sql`EXTRACT(HOUR FROM ${transactions.dtInsert} AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
    : isWeeklyView
      ? sql`EXTRACT(DOW FROM ${transactions.dtInsert} AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
      : isMonthlyView
        ? sql`EXTRACT(DAY FROM ${transactions.dtInsert} AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`
        : sql`DATE_TRUNC('month', ${transactions.dtInsert} AT TIME ZONE 'utc' AT TIME ZONE 'America/Sao_Paulo')`;

  const result = await db.execute(sql`
   SELECT
      ${dateExpression}                       AS date,
      SUM(transactions.total_amount)::TEXT    AS sum,
      COUNT(1)::INT                           AS count,
      SUM(
        CASE
          WHEN transactions.method_type = 'CP' THEN
            CASE
              WHEN COALESCE(payout.transaction_mdr, 0) = 0 THEN 0
              ELSE 
              CASE 
                WHEN transactions.brand = 'PIX'
                THEN (transactions.total_amount * 
                (COALESCE(payout.transaction_mdr, 0)/100)) - solicitation_fee.card_pix_mdr_admin 
              ELSE
              transactions.total_amount *
                (COALESCE(payout.transaction_mdr, 0)/100 - COALESCE(solicitation_bp.fee_admin, 0)/100)
            END
            END
          WHEN transactions.method_type = 'CNP' THEN
            CASE
              WHEN COALESCE(payout.transaction_mdr, 0) = 0 THEN 0
              ELSE transactions.total_amount *
                (
                  COALESCE(payout.transaction_mdr, 0)/100
                  - COALESCE(
                      CASE
                        WHEN transactions.brand = 'PIX'
                        THEN solicitation_fee.non_card_pix_mdr_admin
                        ELSE solicitation_bp.no_card_fee_admin
                      END
                    , 0)/100
                )
            END
          ELSE 0
        END
      )::TEXT AS revenue
    FROM transactions
    LEFT JOIN merchants
      ON transactions.slug_merchant = merchants.slug
    LEFT JOIN categories
      ON merchants.id_category = categories.id
    LEFT JOIN solicitation_fee
      ON categories.mcc = solicitation_fee.mcc
    LEFT JOIN solicitation_fee_brand AS sfb
      ON sfb.solicitation_fee_id = solicitation_fee.id
      AND sfb.brand = transactions.brand
    LEFT JOIN ${payout} AS payout
      ON payout.payout_id::uuid = transactions.slug
    LEFT JOIN solicitation_brand_product_type AS solicitation_bp
      ON solicitation_bp.solicitation_fee_brand_id = sfb.id
      AND solicitation_bp.product_type = SPLIT_PART(transactions.product_type, '_', 1)
      AND payout.installments BETWEEN solicitation_bp.transaction_fee_start
                                  AND solicitation_bp.transaction_fee_end
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
    GROUP BY ${dateExpression}
    ORDER BY ${dateExpression};
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
  console.log(totals);

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
  const endTime = performance.now();
  console.log(
    `getTotalTransactionsByMonth executed in ${endTime - startTime} ms`
  );
  return totals;
}

export async function getTotalMerchants() {
  const startTime = performance.now();
  const result = await db.execute(sql`
    SELECT 
      COUNT(1) AS total
    FROM merchants
  `);
  const endTime = performance.now();
  console.log(`getTotalMerchants executed in ${endTime - startTime} ms`);
  const data = result.rows as MerchantTotal[];
  return data;
}

export async function getTotalTransactions(
  dateFrom: string,
  dateTo: string
): Promise<GetTotalTransactionsResult[]> {
  const startTime = performance.now();
  // Converte datas para UTC se fornecidas
  const dateFromUTC = dateFrom
    ? getDateUTC(dateFrom, "America/Sao_Paulo")!
    : null;
  const dateToUTC = dateTo ? getDateUTC(dateTo, "America/Sao_Paulo")! : null;

  const result = await db.execute(sql`
    WITH filtered_transactions AS (
      SELECT *
      FROM transactions t
      WHERE
        t.transaction_status NOT IN ('CANCELED', 'DENIED', 'PROCESSING', 'PENDING')
        ${dateFromUTC ? sql`AND t.dt_insert >= ${dateFromUTC}` : sql``}
        ${dateToUTC ? sql`AND t.dt_insert <= ${dateToUTC}` : sql``}
    ),
    latest_payout AS (
      SELECT DISTINCT ON (p.payout_id)
        p.payout_id,
        p.transaction_mdr,
        p.installment_number
      FROM payout p
      ORDER BY p.payout_id, p.installment_number DESC
    ),
    merchant_info AS (
      SELECT
        ft.*,
        m.id_category,
        c.mcc,
        sf.id                AS sf_id,
        sf.card_pix_mdr_admin,
        sf.non_card_pix_mdr_admin
      FROM filtered_transactions ft
      JOIN merchants m ON ft.slug_merchant = m.slug
      JOIN categories c ON m.id_category = c.id
      JOIN solicitation_fee sf
        ON c.mcc = sf.mcc
       AND sf.status = 'COMPLETED'
    ),
    joined_data AS (
      SELECT
        mi.*,
        lp.transaction_mdr,
        lp.installment_number,
        sfb.id              AS sfb_id,
        sbpt.fee_admin,
        sbpt.no_card_fee_admin
      FROM merchant_info mi
      LEFT JOIN latest_payout lp
        ON lp.payout_id::uuid = mi.slug
      LEFT JOIN solicitation_fee_brand sfb
        ON sfb.solicitation_fee_id = mi.sf_id
       AND sfb.brand = mi.brand
      LEFT JOIN solicitation_brand_product_type sbpt
        ON sbpt.solicitation_fee_brand_id = sfb.id
       AND sbpt.product_type = SPLIT_PART(mi.product_type, '_', 1)
       AND lp.installment_number BETWEEN sbpt.transaction_fee_start AND sbpt.transaction_fee_end
    ),
    final_data AS (
      SELECT
        total_amount,
        method_type,
        product_type,
        COALESCE(transaction_mdr, 0) AS mdr,
        COALESCE(
          CASE
            WHEN product_type ILIKE 'PIX' AND method_type = 'CP'  THEN card_pix_mdr_admin
            WHEN product_type ILIKE 'PIX' AND method_type = 'CNP' THEN non_card_pix_mdr_admin
            WHEN method_type = 'CP'                               THEN fee_admin
            WHEN method_type = 'CNP'                              THEN no_card_fee_admin
            ELSE 0
          END
        , 0) AS admin_fee
      FROM joined_data
    )
    SELECT
      COUNT(*)                 AS count,
      SUM(total_amount)::TEXT  AS sum,
      SUM(
        CASE
          WHEN mdr = 0 THEN 0
          ELSE total_amount * ((mdr - admin_fee) / 100.0)
        END
      )::TEXT                  AS revenue
    FROM final_data;
  `);

  const endTime = performance.now();
  console.log(`getTotalTransactions executed in ${endTime - startTime} ms`);
  return result.rows as GetTotalTransactionsResult[];
}

async function fetchData(slug: string) {
  try {
    const response = await fetch(
      `${process.env.DOCK_API_URL_TRANSACTIONS}/v1/financial_transactions?slug=${slug}`,
      {
        headers: {
          Authorization: process.env.DOCK_API_KEY || "", // Replace with your actual token
        },
      }
    ); // Replace with your API URL

    const data: GetTransactionsResponse = await response.json();
    console.log(data);
    return data.objects;
  } catch (error: any) {
    console.error("Error fetching API data:", error.message);
    throw error;
  }
}

function removeHifensDoUUID(uuid: string): string {
  return uuid.replace(/-/g, "");
}

export async function correctTransactions() {
  try {
    const result = await db.execute(sql`
      SELECT slug FROM transactions
      WHERE rrn IS NULL
    `);

    const resultRows = result.rows as { slug: string }[];
    console.log(resultRows);
    for (const row of resultRows) {
      try {
        const data = await fetchData(removeHifensDoUUID(row.slug));
        console.log(data);
        if (data.length > 0) {
          const transaction = data[0];
          console.log(transaction);
          if (transaction.rrn) {
            console.log("Atualizando rrn");
            await db
              .update(transactions)
              .set({ rrn: transaction.rrn })
              .where(eq(transactions.slug, row.slug));
          } else {
            console.log("Não atualizando rrn");
          }
        }
      } catch (error) {
        console.error(`Error processing transaction ${row.slug}:`, error);
        console.log("Interrompendo o loop devido a erro.");
        break; // Interrompe o loop em caso de erro
      }
    }
  } catch (error) {
    console.error("Error in correctTransactions:", error);
    throw error; // Re-throw to handle at caller level
  }
}

export async function getCancelledTransactions(
  dateFrom: string,
  dateTo: string
): Promise<CancelledTransactions[]> {
  const startTime = performance.now();
  const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo")!;
  const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo")!;

  const result = await db.execute(sql`
    SELECT 
     COUNT(1) AS count
    FROM transactions
    WHERE dt_insert >= ${dateFromUTC} 
      AND dt_insert < ${dateToUTC}
      AND transaction_status = 'DENIED'
  `);
  const endTime = performance.now();
  console.log(`getCancelledTransactions executed in ${endTime - startTime} ms`);
  return result.rows as CancelledTransactions[];
}

export async function getRawTransactionsByDate(
  dateFrom: string,
  dateTo: string
): Promise<TotalTransactionsByDay[]> {
  const startTime = performance.now();
  const dateFromUTC = getDateUTC(dateFrom, "America/Sao_Paulo")!;
  const dateToUTC = getDateUTC(dateTo, "America/Sao_Paulo")!;

  const result = await db.execute(sql`
    WITH filtered_transactions AS (
      SELECT *
      FROM transactions t
      WHERE
        t.transaction_status NOT IN ('CANCELED', 'DENIED', 'PROCESSING', 'PENDING')
        AND t.dt_insert >= ${dateFromUTC}
        AND t.dt_insert < ${dateToUTC}
    ),
    latest_payout AS (
      SELECT DISTINCT ON (p.payout_id)
        p.payout_id,
        p.transaction_mdr,
        p.installment_number
      FROM payout p
      ORDER BY p.payout_id, p.installment_number DESC
    ),
    merchant_info AS (
      SELECT
        ft.*,
        m.id_category,
        c.mcc,
        sf.id                AS sf_id,
        sf.card_pix_mdr_admin,
        sf.non_card_pix_mdr_admin
      FROM filtered_transactions ft
      JOIN merchants m ON ft.slug_merchant = m.slug
      JOIN categories c ON m.id_category = c.id
      JOIN solicitation_fee sf
        ON c.mcc = sf.mcc
       AND sf.status = 'COMPLETED'
    ),
    joined_data AS (
      SELECT
        mi.*,
        lp.transaction_mdr,
        lp.installment_number,
        sfb.id              AS sfb_id,
        sbpt.fee_admin,
        sbpt.no_card_fee_admin
      FROM merchant_info mi
      LEFT JOIN latest_payout lp
        ON lp.payout_id::uuid = mi.slug
      LEFT JOIN solicitation_fee_brand sfb
        ON sfb.solicitation_fee_id = mi.sf_id
       AND sfb.brand = mi.brand
      LEFT JOIN solicitation_brand_product_type sbpt
        ON sbpt.solicitation_fee_brand_id = sfb.id
       AND sbpt.product_type = SPLIT_PART(mi.product_type, '_', 1)
       AND lp.installment_number BETWEEN sbpt.transaction_fee_start AND sbpt.transaction_fee_end
    ),
    final_data AS (
      SELECT
        total_amount,
        method_type,
        product_type,
        dt_insert,
        COALESCE(transaction_mdr, 0) AS mdr,
        COALESCE(
          CASE
            WHEN product_type ILIKE 'PIX' AND method_type = 'CP'  THEN card_pix_mdr_admin
            WHEN product_type ILIKE 'PIX' AND method_type = 'CNP' THEN non_card_pix_mdr_admin
            WHEN method_type = 'CP'                               THEN fee_admin
            WHEN method_type = 'CNP'                              THEN no_card_fee_admin
            ELSE 0
          END
        , 0) AS admin_fee
      FROM joined_data
    )
    SELECT
      DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo') as date,
      SUM(total_amount)::NUMERIC AS total_amount,
      SUM(
        CASE
          WHEN mdr = 0 THEN 0
          ELSE total_amount * ((mdr - admin_fee) / 100.0)
        END
      )::NUMERIC AS lucro
    FROM final_data
    GROUP BY DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo')
    ORDER BY DATE(dt_insert at time zone 'utc' at time zone 'America/Sao_Paulo');
  `);
  const endTime = performance.now();
  console.log(`getRawTransactionsByDate executed in ${endTime - startTime} ms`);
  console.log(result.rows as TotalTransactionsByDay[]);
  return result.rows as TotalTransactionsByDay[];
}

export async function getTransactionsDashboardTotals(
  dateFrom: string,
  dateTo: string
): Promise<TransactionsDashboardTotals[]> {
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

  conditions.push(
    sql`transactions.transaction_status NOT IN ('CANCELED', 'DENIED', 'PROCESSING', 'PENDING')`
  );

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
  console.log(whereClause);
  const result = await db.execute(sql`
    SELECT 
      product_type, 
      count(1) as count,
      sum(total_amount) as total_amount
    FROM transactions
    ${whereClause ? sql`WHERE ${whereClause}` : sql``}
    GROUP BY product_type
  `);
  console.log(result.rows as TransactionsDashboardTotals[]);
  return result.rows as TransactionsDashboardTotals[];
}
