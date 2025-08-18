"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { getEndOfDay, getStartOfDay } from "@/lib/datetime-utils";
import { transactionProductTypeList } from "@/lib/lookuptables/lookuptables-transactions";
import { db } from "@/server/db";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  max,
  sql,
  sum,
} from "drizzle-orm";
import { unionAll } from "drizzle-orm/pg-core";
import {
  merchantPixSettlementOrders,
  merchants,
  merchantSettlementOrders,
  merchantSettlements,
  payout,
  payoutAntecipations,
  settlements,
} from "../../../../drizzle/schema";

export type MerchantBrand = {
  name: string;
  totalGross: number;
  totalSettlement: number;
};

export type MerchantProductType = {
  name: string;
  totalGross: number;
  totalSettlement: number;
  brand: MerchantBrand[];
};

export type MerchantData = {
  slug_merchant: string;
  merchant: string;
  total: number;
  status: string;
  product_types: MerchantProductType[];
};

export type ExcelDailyData = {
  slugMerchant: string;
  merchant: string;
  cnpj: string;
  nsu: string;
  saleDate: string;
  type: string;
  brand: string;
  installments: number;
  installmentNumber: number;
  installmentValue: string;
  transactionMdr: string;
  transactionMdrFee: string;
  transactionFee: string;
  settlementAmount: string;
  expectedDate: string;
  receivableAmount: string;
  settlementDate: string;
};

export type GlobalSettlementResult = {
  globalSettlement: number;
  globalGross: number;
  globalAdjustments: number;
  status: string;
  merchants: MerchantData[];
};

export interface MerchantAgenda {
  merchant: string;
  saleDate: Date;
  type: string;
  brand: string;
  installments: number;
  installmentNumber: number;
  grossAmount: number;
  feePercentage: number;
  feeAmount: number;
  netAmount: number;
  expectedSettlementDate: Date;
  settledAmount: number;
  settlementDate: Date;
  effectivePaymentDate: Date;
  paymentNumber: string;
  rnn: string;
}

export interface MerchantAgendaListType {
  merchantAgenda: MerchantAgenda[];
  totalCount: number;
  aggregates: {
    gross_amount: number;
    fee_amount: number;
    net_amount: number;
    total_sales: number;
    total_merchants: number;
    total_installments: number;
  };
}
export interface DailyAmount {
  date: string;
  amount: number;
  status: string;
  is_anticipation: boolean;
}

export interface MerchantAgendaExcelData {
  merchant: string;
  cnpj: string;
  nsu: string;
  saleDate: string;
  type: string;
  brand: string;
  installments: number;
  installmentNumber: number;
  installmentValue: string;
  transactionMdr: string;
  transactionMdrFee: string;
  transactionFee: string;
  settlementAmount: string;
  expectedDate: string;
  receivableAmount: string;
  settlementDate: string;
}

// Cache para armazenar dados de meses passados

export async function getMerchantAgenda(
  page: number,
  pageSize: number,
  dateFrom?: string,
  dateTo?: string,
  establishment?: string,
  status?: string,
  cardBrand?: string,
  settlementDateFrom?: string,
  settlementDateTo?: string,
  expectedSettlementDateFrom?: string,
  expectedSettlementDateTo?: string
): Promise<MerchantAgendaListType> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      aggregates: {
        gross_amount: 0,
        fee_amount: 0,
        net_amount: 0,
        total_sales: 0,
        total_merchants: 0,
        total_installments: 0,
      },
      merchantAgenda: [],
      totalCount: 0,
    };
  }

  const conditions: any[] = [];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }
  conditions.push(eq(payout.idCustomer, userAccess.idCustomer));
  if (dateFrom) {
    conditions.push(
      gte(payout.transactionDate, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(
      lte(payout.transactionDate, new Date(dateTo).toISOString())
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status && status !== "all") {
    conditions.push(eq(payout.status, status));
  }

  if (cardBrand && cardBrand !== "all") {
    conditions.push(eq(payout.brand, cardBrand));
  }

  if (settlementDateFrom) {
    conditions.push(gte(payout.settlementDate, settlementDateFrom));
  } else {
    conditions.push(eq(payout.settlementDate, getStartOfDay()));
  }

  if (settlementDateTo) {
    conditions.push(lte(payout.settlementDate, settlementDateTo));
  } else {
    conditions.push(eq(payout.settlementDate, getEndOfDay()));
  }

  if (expectedSettlementDateFrom) {
    conditions.push(
      gte(payout.expectedSettlementDate, expectedSettlementDateFrom)
    );
  }

  if (expectedSettlementDateTo) {
    conditions.push(
      lte(payout.expectedSettlementDate, expectedSettlementDateTo)
    );
  }

  const result = await db
    .select({
      merchant: merchants.name,
      saleDate: payout.effectivePaymentDate,
      type: payout.type,
      brand: payout.brand,
      installmentNumber: payout.installmentNumber,
      installments: payout.installments,
      grossAmount: payout.installmentAmount,
      feePercentage: payout.transactionMdr,
      feeAmount: payout.transactionMdrFee,
      netAmount: payout.settlementAmount,
      expectedSettlementDate: payout.expectedSettlementDate,
      settledAmount: payout.receivableAmount,
      settlementDate: payout.settlementDate,
      effectivePaymentDate: payout.effectivePaymentDate,
      paymentNumber: payout.settlementUniqueNumber,
      rnn: payout.rrn,
    })
    .from(payout)
    .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(payout.settlementDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(payout)
    .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  const conditionSql =
    conditions.length > 0 ? sql`WHERE ${and(...conditions)}` : sql``;

  const qr = sql`
    SELECT
      SUM(distinct_payouts.installments) AS total_installments,
      COUNT(*) AS total_sales,
      SUM(distinct_payouts.installment_amount) AS total_gross_amount,
      SUM(distinct_payouts.transaction_mdr_fee) AS total_fee_amount,
      SUM(distinct_payouts.settlement_amount) AS total_net_amount,
      COUNT(DISTINCT distinct_payouts.id_merchant) AS total_merchants
    FROM (
      SELECT DISTINCT
        payout.id_merchant,
        payout.payout_id,
        payout.installments,
        payout.installment_amount,
        payout.transaction_mdr_fee,
        payout.settlement_amount
      FROM payout
      INNER JOIN merchants ON payout.id_merchant = merchants.id
      ${conditionSql}
    ) AS distinct_payouts;
  `;
  const aggregateResult = await db.execute(qr);
  const row = aggregateResult.rows[0];

  return {
    merchantAgenda: result.map((merchantAgendaMap) => ({
      merchant: merchantAgendaMap.merchant || "",
      saleDate: new Date(merchantAgendaMap.effectivePaymentDate || ""),
      type: merchantAgendaMap.type || "",
      brand: merchantAgendaMap.brand || "",
      installmentNumber: merchantAgendaMap.installmentNumber || 0,
      installments: merchantAgendaMap.installments || 0,
      grossAmount: Number(merchantAgendaMap.grossAmount) || 0,
      feePercentage: Number(merchantAgendaMap.feePercentage) || 0,
      feeAmount: Number(merchantAgendaMap.feeAmount) || 0,
      netAmount: Number(merchantAgendaMap.netAmount) || 0,
      expectedSettlementDate: new Date(
        merchantAgendaMap.expectedSettlementDate || ""
      ),
      settledAmount: Number(merchantAgendaMap.settledAmount) || 0,
      settlementDate: new Date(merchantAgendaMap.settlementDate || ""),
      effectivePaymentDate: new Date(
        merchantAgendaMap.effectivePaymentDate || ""
      ),
      paymentNumber: merchantAgendaMap.paymentNumber || "",
      rnn: merchantAgendaMap.rnn || "",
    })),
    totalCount,
    aggregates: {
      gross_amount: Number(row?.total_gross_amount) || 0,
      fee_amount: Number(row?.total_fee_amount) || 0,
      net_amount: Number(row?.total_net_amount) || 0,
      total_sales: Number(row?.total_sales) || 0,
      total_merchants: Number(row?.total_merchants) || 0,
      total_installments: Number(row?.total_installments) || 0,
    },
  };
}

export async function getMerchantAgendaExcel(
  dateFrom?: string,
  dateTo?: string,
  establishment?: string,
  status?: string,
  cardBrand?: string,
  settlementDateFrom?: string,
  settlementDateTo?: string,
  expectedSettlementDateFrom?: string,
  expectedSettlementDateTo?: string
): Promise<MerchantAgendaListType> {
  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      aggregates: {
        gross_amount: 0,
        fee_amount: 0,
        net_amount: 0,
        total_sales: 0,
        total_merchants: 0,
        total_installments: 0,
      },
      merchantAgenda: [],
      totalCount: 0,
    };
  }

  const conditions = [];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }
  conditions.push(eq(payout.idCustomer, userAccess.idCustomer));
  if (dateFrom) {
    conditions.push(
      gte(payout.transactionDate, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(
      lte(payout.transactionDate, new Date(dateTo).toISOString())
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status && status !== "all") {
    conditions.push(eq(payout.status, status));
  }

  if (cardBrand && cardBrand !== "all") {
    conditions.push(eq(payout.brand, cardBrand));
  }

  if (settlementDateFrom) {
    conditions.push(gte(payout.settlementDate, settlementDateFrom));
  } else {
    conditions.push(eq(payout.settlementDate, getStartOfDay()));
  }

  if (settlementDateTo) {
    conditions.push(lte(payout.settlementDate, settlementDateTo));
  } else {
    conditions.push(eq(payout.settlementDate, getEndOfDay()));
  }

  if (expectedSettlementDateFrom) {
    conditions.push(
      gte(payout.expectedSettlementDate, expectedSettlementDateFrom)
    );
  }

  if (expectedSettlementDateTo) {
    conditions.push(
      lte(payout.expectedSettlementDate, expectedSettlementDateTo)
    );
  }

  const result = await db
    .select({
      merchant: merchants.name,
      saleDate: payout.effectivePaymentDate,
      type: payout.type,
      brand: payout.brand,
      installmentNumber: payout.installmentNumber,
      installments: payout.installments,
      grossAmount: payout.installmentAmount,
      feePercentage: payout.transactionMdr,
      feeAmount: payout.transactionMdrFee,
      netAmount: payout.settlementAmount,
      expectedSettlementDate: payout.expectedSettlementDate,
      settledAmount: payout.receivableAmount,
      settlementDate: payout.settlementDate,
      effectivePaymentDate: payout.effectivePaymentDate,
      paymentNumber: payout.settlementUniqueNumber,
      rnn: payout.rrn,
    })
    .from(payout)
    .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(payout.settlementDate));

  const totalCountResult = await db
    .select({ count: count() })
    .from(payout)
    .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    merchantAgenda: result.map((merchantAgendaMap) => ({
      merchant: merchantAgendaMap.merchant || "",
      saleDate: new Date(merchantAgendaMap.effectivePaymentDate || ""),
      type: merchantAgendaMap.type || "",
      brand: merchantAgendaMap.brand || "",
      installmentNumber: merchantAgendaMap.installmentNumber || 0,
      installments: merchantAgendaMap.installments || 0,
      grossAmount: Number(merchantAgendaMap.grossAmount) || 0,
      feePercentage: Number(merchantAgendaMap.feePercentage) || 0,
      feeAmount: Number(merchantAgendaMap.feeAmount) || 0,
      netAmount: Number(merchantAgendaMap.netAmount) || 0,
      expectedSettlementDate: new Date(
        merchantAgendaMap.expectedSettlementDate || ""
      ),
      settledAmount: Number(merchantAgendaMap.settledAmount) || 0,
      settlementDate: new Date(merchantAgendaMap.settlementDate || ""),
      effectivePaymentDate: new Date(
        merchantAgendaMap.effectivePaymentDate || ""
      ),
      paymentNumber: merchantAgendaMap.paymentNumber || "",
      rnn: merchantAgendaMap.rnn || "",
    })),
    totalCount,
    aggregates: {
      gross_amount: 0,
      fee_amount: 0,
      net_amount: 0,
      total_sales: 0,
      total_merchants: 0,
      total_installments: 0,
    },
  };
}

export async function getMerchantAgendaExcelDailyData(
  date: string
): Promise<ExcelDailyData[]> {
  try {
    const formattedDate = new Date(date).toISOString().split("T")[0];

    const result = await db
      .select({
        merchant: merchants.name,
        slugMerchant: merchants.slug,
        cnpj: merchants.idDocument,
        nsu: payout.rrn,
        saleDate: payout.transactionDate,
        type: payout.productType,
        brand: payout.brand,
        installments: payout.installments,
        installmentNumber: payout.installmentNumber,
        installmentValue: payout.installmentAmount,
        transactionMdr: payout.transactionMdr,
        transactionMdrFee: payout.transactionMdrFee,
        transactionFee: payout.transactionFee,
        settlementAmount: payout.settlementAmount,
        expectedDate: payout.expectedSettlementDate,
        receivableAmount: payout.receivableAmount,
        settlementDate: payout.settlementDate,
      })
      .from(payout)
      .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
      .where(
        sql`COALESCE(${payout.settlementDate}, ${payout.expectedSettlementDate}) = ${formattedDate}`
      )
      .orderBy(payout.transactionDate);

    const data = result.map((row) => ({
      merchant: row.merchant || "",
      slugMerchant: row.slugMerchant || "",
      cnpj: row.cnpj || "",
      nsu: row.nsu || "",
      saleDate: row.saleDate || "",
      type: row.type || "",
      brand: row.brand || "",
      installments: row.installments || 0,
      installmentNumber: row.installmentNumber || 0,
      installmentValue: String(row.installmentValue || 0),
      transactionMdr: String(row.transactionMdr || 0),
      transactionMdrFee: String(row.transactionMdrFee || 0),
      transactionFee: String(row.transactionFee || 0),
      settlementAmount: String(row.settlementAmount || 0),
      expectedDate: row.expectedDate || "",
      receivableAmount: String(row.receivableAmount || 0),
      settlementDate: row.settlementDate || "",
    }));
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching excel data:", error);
    return [];
  }
}

export async function getMerchantAgendaInfo(): Promise<{
  count: string | null;
  totalSettlementAmount: string | null;
  totalTaxAmount: string | null;
}> {
  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  const maxDateResult = await db
    .select({
      maxDate: max(payout.expectedSettlementDate),
    })
    .from(payout)
    .where(eq(payout.idCustomer, userAccess.idCustomer));

  const maxDate = new Date(maxDateResult[0]?.maxDate || 0);

  const conditions = [eq(payout.settlementDate, maxDate.toISOString())];
  if (!userAccess.fullAccess) {
    if (userAccess.idMerchants.length === 0) {
      return {
        count: "0",
        totalSettlementAmount: "0",
        totalTaxAmount: "0",
      };
    }
    conditions.push(inArray(payout.idMerchant, userAccess.idMerchants));
  }
  conditions.push(eq(payout.idCustomer, userAccess.idCustomer));

  const countResult = await db
    .selectDistinct({
      count: count(payout.idMerchant),
    })
    .from(payout)
    .where(and(...conditions));

  const totalSettlementAmountResult = await db
    .select({
      totalSettlementAmount: sum(payout.settlementAmount),
    })
    .from(payout)
    .where(and(...conditions));

  const totalTaxAmountResult = await db
    .select({
      totalTaxAmount: sum(payout.transactionMdr),
    })
    .from(payout)
    .where(and(...conditions));

  return {
    count: countResult[0]?.count?.toString() || null,
    totalSettlementAmount:
      totalSettlementAmountResult[0]?.totalSettlementAmount?.toString() || null,
    totalTaxAmount: totalTaxAmountResult[0]?.totalTaxAmount?.toString() || null,
  };
}

export async function getMerchantAgendaReceipts(
  search: string | null,
  date?: Date
) {
  const whereDate = (() => {
    if (!date) return { start: null, end: null };
    const firstDay = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
    const lastDay = new Date(
      Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
    );
    const today = new Date();
    if (firstDay > today) return { start: null, end: null };
    const start = firstDay.toISOString().slice(0, 10);
    const end =
      firstDay.getMonth() === today.getMonth() &&
      firstDay.getFullYear() === today.getFullYear()
        ? today.toISOString().slice(0, 10)
        : lastDay.toISOString().slice(0, 10);
    return { start, end };
  })();

  const userAccess = await getUserMerchantsAccess();

  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }

  // Se não há data válida retorna array vazio
  if (date && !whereDate.start) return [];

  const query = sql`
    WITH filtered_payouts AS (
      SELECT
        p.settlement_unique_number AS sun,
        p.settlement_amount AS amt,
        p.status AS status,
        false AS isAnticipation,
        DATE(
          COALESCE(p.settlement_date, p.expected_settlement_date)
        )  AS day
      FROM ${payout} p
      JOIN ${merchants} m
        ON m.id = p.id_merchant
      WHERE
        p.status NOT IN ('CANCELLED')
        ${search ? sql`AND m.name ILIKE ${"%" + search + "%"}` : sql``}
        ${
          date
            ? sql`AND COALESCE(p.settlement_date, p.expected_settlement_date)
                 BETWEEN ${whereDate.start} AND ${whereDate.end}`
            : sql``
        }
        -- só dias úteis
        AND EXTRACT(
              DOW FROM COALESCE(p.settlement_date, p.expected_settlement_date)
            ) NOT IN (0, 6)
         ${userAccess.idCustomer ? sql`AND p.id_customer = ${userAccess.idCustomer}` : sql``}
         ${userAccess.fullAccess ? sql`` : userAccess.idMerchants.length > 0 ? sql`AND m.id IN (${userAccess.idMerchants.join(",")})` : sql``}

      UNION ALL

      SELECT
        pa.settlement_unique_number AS sun,
        pa.settlement_amount AS amt,
        pa.status AS status,
        true AS isAnticipation,
        -- data efetiva de liquidação (ou esperada se nulo)
        DATE(
          COALESCE(pa.settlement_date, pa.expected_settlement_date)
        )  AS day
      FROM ${payoutAntecipations} pa
      JOIN ${merchants} m
        ON m.id = pa.id_merchants
      WHERE
        pa.status NOT IN ('CANCELLED')
        ${search ? sql`AND m.name ILIKE ${"%" + search + "%"}` : sql``}
        ${
          date
            ? sql`AND COALESCE(pa.settlement_date, pa.expected_settlement_date)
                 BETWEEN ${whereDate.start} AND ${whereDate.end}`
            : sql``
        }
        -- só dias úteis
        AND EXTRACT(
              DOW FROM COALESCE(pa.settlement_date, pa.expected_settlement_date)
            ) NOT IN (0, 6)
            ${userAccess.idCustomer ? sql`AND pa.id_customer = ${userAccess.idCustomer}` : sql``}
            ${userAccess.fullAccess ? sql`` : userAccess.idMerchants.length > 0 ? sql`AND m.id IN (${userAccess.idMerchants.join(",")})` : sql``}

    ),
    daily_totals AS (
      SELECT
        day,
        COALESCE(SUM(amt), 0) AS total_payout,
        CASE
        WHEN COUNT(*) FILTER (WHERE status = 'PROVISIONED') > 0 THEN 'PROVISIONED'
        WHEN COUNT(*) FILTER (WHERE status NOT LIKE '%SETTLED%') = 0 THEN 'SETTLED'
        ELSE MIN(CASE WHEN status NOT LIKE '%SETTLED%' THEN status END)
        END AS status,
        BOOL_OR(isAnticipation) AS is_anticipation
      FROM filtered_payouts
      GROUP BY day
    ),
    daily_sets AS (
      SELECT DISTINCT
        fp.day,
        ms.id_settlement AS slug
      FROM filtered_payouts fp
      JOIN ${merchantSettlementOrders} mso
        ON mso.settlement_unique_number = fp.sun
      JOIN ${merchantSettlements} ms
        ON ms.id = mso.id_merchant_settlements

      UNION

      SELECT DISTINCT
        fp.day,
        ms2.id_settlement AS slug
      FROM filtered_payouts fp
      JOIN ${merchantPixSettlementOrders} mpso
        ON mpso.settlement_unique_number = fp.sun
      JOIN ${merchantSettlements} ms2
        ON ms2.id = mpso.id_merchant_settlement
    ),
    daily_adj AS (
      SELECT
        ds.day,
        COALESCE(SUM(s.debit_financial_adjustment_amount), 0) AS total_adj
      FROM ${settlements} s
      JOIN daily_sets ds
        ON ds.slug = s.id
      GROUP BY ds.day
    )
    SELECT
      dt.day,
      dt.total_payout - COALESCE(da.total_adj, 0) AS total_amount,
      dt.status,
      dt.is_anticipation
    FROM daily_totals dt
    LEFT JOIN daily_adj da
      ON da.day = dt.day
    ORDER BY dt.day
  `;

  const { rows } = await db.execute<{
    day: Date;
    total_amount: string;
    status: string;
    is_anticipation: boolean;
  }>(query);
  console.log(rows);
  return rows.map((r) => ({
    day: r.day,
    totalAmount: Number(r.total_amount),
    status: r.status,
    is_anticipation: r.is_anticipation,
  }));
}

export async function getMerchantAgendaTotal(
  search: string | null,
  date: Date
): Promise<{ total: string; status: string }[] | undefined> {
  const userAccess = await getUserMerchantsAccess();
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }

  const firstDayOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), 1)
  );
  const lastDayOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
  );
  const today = new Date();

  // Permite visualizar meses passados, mas restringe datas futuras
  if (firstDayOfMonth > today) {
    return;
  }
  const start = firstDayOfMonth.toISOString().slice(0, 10);
  const end =
    firstDayOfMonth.getMonth() === today.getMonth() &&
    firstDayOfMonth.getFullYear() === today.getFullYear()
      ? today.toISOString().slice(0, 10)
      : lastDayOfMonth.toISOString().slice(0, 10);

  const query = sql`
      WITH
        payout_range AS (
          SELECT
            settlement_unique_number,
            settlement_amount,
            status
          FROM ${payout}
          INNER JOIN ${merchants} m
            ON m.id = ${payout}.id_merchant
          WHERE COALESCE(settlement_date, expected_settlement_date) BETWEEN ${start} AND ${end}
          ${search ? sql`AND m.name ILIKE ${"%" + search + "%"}` : sql``}
          ${userAccess.idCustomer ? sql`AND ${payout}.id_customer = ${userAccess.idCustomer}` : sql``}
          ${userAccess.fullAccess ? sql`` : userAccess.idMerchants.length > 0 ? sql`AND ${payout}.id_merchant IN (${userAccess.idMerchants.join(",")})` : sql``}
        ),
        unique_sets AS (
          -- via MerchantSettlementOrders
          SELECT DISTINCT
            ms.id_settlement
          FROM ${merchantSettlementOrders} mso
          JOIN ${merchantSettlements} ms
            ON ms.id = mso.id_merchant_settlements
          JOIN payout_range pr
            ON pr.settlement_unique_number = mso.settlement_unique_number
          WHERE 1 = 1 
            ${userAccess.idCustomer ? sql`AND ms.id_customer = ${userAccess.idCustomer}` : sql``}
            ${userAccess.fullAccess ? sql`` : userAccess.idMerchants.length > 0 ? sql`AND ms.id_merchant IN (${userAccess.idMerchants.join(",")})` : sql``}
          UNION
  
          -- via MerchantPixSettlementOrders
          SELECT DISTINCT
            ms2.id_settlement
          FROM ${merchantPixSettlementOrders} mpso
          JOIN ${merchantSettlements} ms2
            ON ms2.id = mpso.id_merchant_settlement
          JOIN payout_range pr2
            ON pr2.settlement_unique_number = mpso.settlement_unique_number
          WHERE 1 = 1 
            ${userAccess.idCustomer ? sql`AND ms2.id_customer = ${userAccess.idCustomer}` : sql``}
            ${userAccess.fullAccess ? sql`` : userAccess.idMerchants.length > 0 ? sql`AND ms2.id_merchant IN (${userAccess.idMerchants.join(",")})` : sql``}
        ),
        total_payout AS (
          SELECT COALESCE(SUM(settlement_amount), 0) AS total,
          CASE
          WHEN COUNT(*) FILTER (WHERE status = 'PROVISIONED') > 0 THEN 'PROVISIONED'
          WHEN COUNT(*) FILTER (WHERE status NOT LIKE '%SETTLED%') = 0 THEN 'SETTLED'
          ELSE MIN(CASE WHEN status NOT LIKE '%SETTLED%' THEN status END)
          END AS payout_status
          FROM payout_range
        ),
        total_adjustment AS (
          SELECT COALESCE(SUM(s.debit_financial_adjustment_amount), 0) AS total
          FROM ${settlements} s
          WHERE s.id IN (SELECT id_settlement FROM unique_sets)
        )
  
      SELECT
        tp.total - ta.total AS total,
        tp.payout_status
      FROM total_payout tp
      CROSS JOIN total_adjustment ta;
    `;
  const { rows } = await db.execute<{ total: string; payout_status: string }>(
    query
  );
  return rows.map((r) => ({
    total: r.total || "0",
    status: r.payout_status,
  }));
}

export async function getMerchantAgendaExcelData(
  dateFrom: string,
  dateTo: string
) {
  const payoutData = db
    .select({
      Merchant: merchants.name,
      CNPJ: merchants.idDocument,
      NSU: payout.rrn,
      SaleDate: payout.effectivePaymentDate,
      Type: payout.productType,
      Brand: payout.brand,
      Installments: payout.installments,
      InstallmentNumber: payout.installmentNumber,
      InstallmentValue: payout.installmentAmount,
      TransactionMdr: payout.transactionMdr,
      TransactionMdrFee: payout.transactionMdrFee,
      TransactionFee: payout.transactionFee,
      SettlementAmount: payout.settlementAmount,
      ExpectedDate: payout.expectedSettlementDate,
      ReceivableAmount: payout.receivableAmount,
      SettlementDate: payout.settlementDate,
    })
    .from(payout)
    .innerJoin(merchants, eq(merchants.id, payout.idMerchant))
    .where(
      sql`(${payout.settlementDate} >= ${dateFrom}) 
          AND (${payout.settlementDate} <= ${dateTo})
         `
    );

  const payoutAnticipationData = db
    .select({
      Merchant: merchants.name,
      CNPJ: merchants.idDocument,
      NSU: payoutAntecipations.rrn,
      SaleDate: payoutAntecipations.effectivePaymentDate,
      Type: payoutAntecipations.type,
      Brand: payoutAntecipations.brand,
      Installments: payoutAntecipations.installments,
      InstallmentNumber: payoutAntecipations.installmentNumber,
      InstallmentValue: payoutAntecipations.installmentAmount,
      TransactionMdr: payoutAntecipations.transactionMdr,
      TransactionMdrFee: payoutAntecipations.transactionMdrFee,
      TransactionFee: payoutAntecipations.transactionFee,
      SettlementAmount: payoutAntecipations.settlementAmount,
      ExpectedDate: payoutAntecipations.expectedSettlementDate,
      ReceivableAmount: payoutAntecipations.anticipatedAmount,
      SettlementDate: payoutAntecipations.settlementDate,
    })
    .from(payoutAntecipations)
    .innerJoin(merchants, eq(merchants.id, payoutAntecipations.idMerchants))
    .where(
      sql`(${payoutAntecipations.settlementDate} >= ${dateFrom}) 
          AND (${payoutAntecipations.settlementDate} <= ${dateTo})
         `
    );

  const result = await unionAll(payoutData, payoutAnticipationData);

  return result.map((item) => ({
    merchant: item.Merchant,
    cnpj: item.CNPJ,
    nsu: item.NSU,
    saleDate: item.SaleDate,
    type: item.Type,
    brand: item.Brand,
    installments: item.Installments,
    installmentNumber: item.InstallmentNumber,
    installmentValue: item.InstallmentValue,
    transactionMdr: item.TransactionMdr,
    transactionMdrFee: item.TransactionMdrFee,
    transactionFee: item.TransactionFee,
    settlementAmount: item.SettlementAmount,
    expectedDate: item.ExpectedDate,
    receivableAmount: item.ReceivableAmount,
    settlementDate: item.SettlementDate,
  })) as MerchantAgendaExcelData[];
}

export async function getGlobalSettlement(
  search: string | null,
  date: string
): Promise<GlobalSettlementResult> {
  const userAccess = await getUserMerchantsAccess();
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      globalSettlement: 0,
      globalGross: 0,
      globalAdjustments: 0,
      status: "",
      merchants: [],
    };
  }

  // 1) default da data para hoje, se não informado
  if (!date) {
    date = new Date().toISOString().slice(0, 10);
  }

  // 2) mapeamentos para tradução
  const productTypeMapping = transactionProductTypeList.reduce<
    Record<string, string>
  >((acc, { value, label }) => ({ ...acc, [value]: label }), {});
  productTypeMapping["pedido de antecipação"] = "Pedido de Antecipação";

  productTypeMapping["ajustes"] = "Ajustes";

  const query = `
    WITH
    -- 1. Filtra só os payouts do dia
    payout_filtered AS (
      SELECT  id_merchant,
      product_type,
      brand,
      settlement_amount,
      installment_amount,
      status
      FROM payout
      WHERE (
        (settlement_date IS NOT NULL AND DATE(settlement_date) = DATE('${date}'))
        OR
        (settlement_date IS NULL AND DATE(expected_settlement_date) = DATE('${date}'))
      )
      AND status NOT IN ('CANCELLED')
      ${userAccess.idCustomer ? `AND payout.id_customer = '${userAccess.idCustomer}'` : ""}
      ${userAccess.fullAccess ? "" : userAccess.idMerchants.length > 0 ? `AND payout.id_merchant IN (${userAccess.idMerchants.join(",")})` : ""}
    
      UNION ALL
      
      SELECT
      pa.id_merchants AS id_merchant,
      'pedido de antecipação' AS product_type,
      '' AS brand,
      pa.settlement_amount,
      pa.installment_amount,
      '' as status
      FROM payout_antecipations pa
      WHERE DATE(pa.settlement_date) = DATE('${date}')
      ${userAccess.idCustomer ? `AND pa.id_customer = '${userAccess.idCustomer}'` : ""}
      ${userAccess.fullAccess ? "" : userAccess.idMerchants.length > 0 ? `AND pa.id_merchants IN (${userAccess.idMerchants.join(",")})` : ""}
   
    ),

    -- 2. Soma ajustes por merchant
    merchant_adjustments AS (
      SELECT
      ms.id_merchant,
      ms.debit_financial_adjustment_amount AS total_adj
      FROM merchant_settlements ms
      JOIN settlements s
        ON s.id = ms.id_settlement
      WHERE ms.debit_financial_adjustment_amount IS NOT NULL
      AND ms.debit_financial_adjustment_amount > 0 
      AND s.status NOT IN ('CANCELLED') 
      AND DATE(s.payment_date) = DATE('${date}')
      ${userAccess.idCustomer ? `AND ms.id_customer = '${userAccess.idCustomer}'` : ""}
      ${userAccess.fullAccess ? "" : userAccess.idMerchants.length > 0 ? `AND ms.id_merchant IN (${userAccess.idMerchants.join(",")})` : ""}
      GROUP BY ms.id_merchant, ms.debit_financial_adjustment_amount
    ),
    -- Antecipações Eventuais
    merchant_anticipations AS (
      SELECT 
      pa.id_merchants,
      SUM(pa.installment_amount),
      SUM(pa.settlement_amount)
      FROM payout_antecipations pa
      WHERE DATE(pa.settlement_date) = DATE('${date}')
      ${userAccess.idCustomer ? `AND pa.id_customer = '${userAccess.idCustomer}'` : ""}
      ${userAccess.fullAccess ? "" : userAccess.idMerchants.length > 0 ? `AND pa.id_merchants IN (${userAccess.idMerchants.join(",")})` : ""}
      GROUP BY pa.id_merchants
    ),
    -- 3. Totais globais
    global_total AS (
      SELECT
        SUM(pf.settlement_amount) AS global_settlement_total,
        SUM(pf.installment_amount)  AS global_gross_total,
        CASE
        WHEN COUNT(*) FILTER (WHERE status = 'PROVISIONED') > 0 THEN 'PROVISIONED'
        WHEN COUNT(*) FILTER (WHERE status NOT LIKE '%SETTLED%') = 0 THEN 'SETTLED'
        ELSE MIN(CASE WHEN status NOT LIKE '%SETTLED%' THEN status END)
        END AS status
      FROM payout_filtered pf
    ),
    -- 4. Totais por merchant, já subtraindo ajustes
    merchant_totals AS (
      SELECT
        pf.id_merchant,
        SUM(pf.settlement_amount) - COALESCE(ma.total_adj, 0) AS merchant_total,
        CASE
        WHEN COUNT(*) FILTER (WHERE status = 'PROVISIONED') > 0 THEN 'PROVISIONED'
        WHEN COUNT(*) FILTER (WHERE status NOT LIKE '%SETTLED%') = 0 THEN 'SETTLED'
        ELSE MIN(CASE WHEN status NOT LIKE '%SETTLED%' THEN status END)
        END AS merchant_status
      FROM payout_filtered pf
      LEFT JOIN merchant_adjustments ma
        ON ma.id_merchant = pf.id_merchant
      GROUP BY pf.id_merchant, ma.total_adj
    ),
    -- 5. Totais por product_type originais
    product_totals AS (
      SELECT
        id_merchant,
        product_type,
        SUM(settlement_amount)   AS product_settlement_total,
        SUM(installment_amount)  AS product_gross_total
      FROM payout_filtered
      GROUP BY id_merchant, product_type

      UNION ALL

      -- 6. Ajustes transformado em product_type extra (valor negativo)
      SELECT
       ms.id_merchant  AS id_merchant,
      'ajustes' AS product_type,
      - ms.debit_financial_adjustment_amount AS product_settlement_total,
      0 AS product_gross_total
      FROM merchant_settlements ms
      JOIN settlements s
        ON s.id = ms.id_settlement
      JOIN payout_filtered pf
        ON pf.id_merchant = ms.id_merchant
      WHERE ms.debit_financial_adjustment_amount IS NOT NULL
        AND ms.debit_financial_adjustment_amount > 0
        AND DATE(s.payment_date) = DATE('${date}')
        AND s.status NOT IN ('CANCELLED')
      GROUP BY ms.id_merchant, ms.debit_financial_adjustment_amount

    ),

    -- 7. Passa adiante sem mexer
    product_percentages AS (
      SELECT
        pt.id_merchant,
        pt.product_type,
        pt.product_settlement_total,
        pt.product_gross_total
      FROM product_totals pt
      JOIN merchant_totals mt
        ON mt.id_merchant = pt.id_merchant
    ),
    brand_totals AS (
      SELECT 
        id_merchant, 
        product_type, 
        brand, 
        SUM(settlement_amount) AS brand_settlement_total,
        SUM(installment_amount) AS brand_gross_total
      FROM payout_filtered
      GROUP BY id_merchant, product_type, brand
    ),
    brand_percentages AS (
      SELECT 
        bt.id_merchant,
        bt.product_type,
        bt.brand,
        bt.brand_settlement_total,
        bt.brand_gross_total
      FROM brand_totals bt
      JOIN product_totals pt ON bt.id_merchant = pt.id_merchant AND bt.product_type = pt.product_type
    ),

    -- 8. Monta cada merchant com seu array de product_types
    merchant_data AS (
      SELECT
        m.name               AS merchant,
        m.slug               AS slug_merchant,
        mt.merchant_total    AS total,
        mt.merchant_status   AS status,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name',             pp.product_type,
              'totalGross',       pp.product_gross_total,
              'totalSettlement',  pp.product_settlement_total,
              'brand',  (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'name', bp.brand,
                    'totalGross', bp.brand_gross_total,
                    'totalSettlement', bp.brand_settlement_total
                  )
                )
                FROM brand_percentages bp
                WHERE bp.id_merchant = pp.id_merchant 
                  AND bp.product_type = pp.product_type
              )  
            )
            ORDER BY pp.product_type
          ) FILTER (WHERE pp.product_type IS NOT NULL),
          '[]'::jsonb
        ) AS product_types

      FROM product_percentages pp
      JOIN merchant_totals mt
        ON mt.id_merchant = pp.id_merchant
      JOIN merchants m
        ON m.id = pp.id_merchant
      WHERE (${search ? `'${search}' IS NULL OR m.name ILIKE '%${search}%'` : "TRUE"})
      GROUP BY
        m.name, m.slug,
        mt.merchant_total,
        mt.merchant_status
    )

    -- 9. Resultado final
    SELECT jsonb_build_object(
      'globalSettlement', (SELECT global_settlement_total FROM global_total),
      'globalGross',      (SELECT global_gross_total      FROM global_total),
      'status',           (SELECT status FROM global_total),
      'globalAdjustments', (SELECT SUM(total_adj)     FROM merchant_adjustments),
      'merchants',        (SELECT jsonb_agg(merchant_data ORDER BY merchant_data.merchant DESC)  FROM merchant_data)
    ) AS result;
  `;

  // 4) executa e traduz
  try {
    const { rows } = await db.execute<{ result: any }>(query);
    const data = rows[0].result as GlobalSettlementResult;

    // depois de vir do banco, só ajustar o nome de display
    data.merchants = data.merchants?.map((m) => ({
      ...m,
      product_types: m.product_types?.map((pt) => ({
        ...pt,
        // traduz “ajustes” e também os outros do seu dicionário
        name: productTypeMapping[pt.name] || pt.name,
      })),
    }));

    return data;
  } catch (err) {
    console.error("Erro ao executar consulta SQL:", err);
    throw new Error("Falha ao obter dados de liquidação global");
  }
}
