"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
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
  or,
  sql,
  sum,
} from "drizzle-orm";
import { merchants, payout } from "../../../../drizzle/schema";

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
  merchant: string;
  total: number;
  status: string;
  producttype: MerchantProductType[];
};

export type GlobalSettlementResult = {
  globalSettlement: number;
  globalGross: number;
  merchants: MerchantData[];
  paymentMethods: PaymentMethodData[];
  brands: BrandData[];
};

export interface PaymentMethodData {
  name: string;
  totalSettlement: number;
  totalGross: number;
  percentage: number;
}

export interface BrandData {
  name: string;
  totalSettlement: number;
  totalGross: number;
  percentage: number;
}

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

export interface MerchantAgendaList {
  merchantAgenda: MerchantAgenda[];
  totalCount: number;
}
export interface DailyAmount {
  date: string;
  amount: number;
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
  search: string,
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
): Promise<MerchantAgendaList> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      merchantAgenda: [],
      totalCount: 0,
    };
  }

  const maxExpectedSettlementDate = await db
    .select({
      maxExpectedSettlementDate: max(payout.expectedSettlementDate),
    })
    .from(payout);

  const maxDate =
    maxExpectedSettlementDate[0]?.maxExpectedSettlementDate || new Date(0);

  const conditions = [
    eq(
      payout.expectedSettlementDate,
      typeof maxDate == "string" ? maxDate : maxDate.toISOString()
    ),
    or(ilike(merchants.name, `%${search}%`)),
  ];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }

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
  }

  if (settlementDateTo) {
    conditions.push(lte(payout.settlementDate, settlementDateTo));
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
      saleDate: payout.transactionDate,
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

  return {
    merchantAgenda: result.map((merchantAgendaMap) => ({
      merchant: merchantAgendaMap.merchant || "",
      saleDate: new Date(merchantAgendaMap.saleDate || ""),
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
  };
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
    .from(payout);

  const maxDate = new Date(maxDateResult[0]?.maxDate || 0);

  const conditions = [eq(payout.settlementDate, maxDate.toISOString())];

  // Add merchant access filter if user doesn't have full access
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
  const whereConditions = [];

  if (search) {
    whereConditions.push(ilike(merchants.name, `%${search}%`));
  }

  if (date) {
    const firstDayOfMonth = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), 1)
    );
    const lastDayOfMonth = new Date(
      Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
    );
    const today = new Date();

    // Permite visualizar meses passados, mas restringe datas futuras
    if (firstDayOfMonth > today) {
      return [];
    }

    whereConditions.push(
      gte(payout.settlementDate, firstDayOfMonth.toISOString())
    );
    whereConditions.push(
      lte(
        payout.settlementDate,
        firstDayOfMonth.getMonth() === today.getMonth() &&
          firstDayOfMonth.getFullYear() === today.getFullYear()
          ? today.toISOString()
          : lastDayOfMonth.toISOString()
      )
    );
    console.log(date);
    console.log(firstDayOfMonth);
    console.log(today);
    console.log(lastDayOfMonth);
  }

  // Mantém o filtro de dias da semana apenas para exibição no calendário
  whereConditions.push(
    sql`EXTRACT(DOW FROM ${payout.settlementDate}) NOT IN (0, 6)`
  );

  console.log(whereConditions);
  const merchantAgendaReceipts = await db
    .select({
      day: sql`DATE(${payout.settlementDate})`.as("day"),
      totalAmount: sql`SUM(${payout.settlementAmount})`.as("total_amount"),
    })
    .from(payout)
    .innerJoin(merchants, eq(merchants.id, payout.idMerchant))
    .where(whereConditions.length > 0 ? and(...whereConditions) : sql`1=1`)
    .groupBy(sql`DATE(${payout.settlementDate})`)
    .orderBy(sql`DATE(${payout.settlementDate})`);

  return merchantAgendaReceipts;
}

export async function getMerchantAgendaTotal(date: Date) {
  const firstDayOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), 1)
  );
  const lastDayOfMonth = new Date(
    Date.UTC(date.getFullYear(), date.getMonth() + 1, 0)
  );
  const today = new Date();

  // Permite visualizar meses passados, mas restringe datas futuras
  if (firstDayOfMonth > today) {
    return 0;
  }

  const result = await db
    .select({
      total: sql`SUM(${payout.settlementAmount})`,
    })
    .from(payout)
    .where(
      and(
        gte(payout.settlementDate, firstDayOfMonth.toISOString()),
        lte(
          payout.settlementDate,
          firstDayOfMonth.getMonth() === today.getMonth() &&
            firstDayOfMonth.getFullYear() === today.getFullYear()
            ? today.toISOString()
            : lastDayOfMonth.toISOString()
        )
      )
    );

  return Number(result[0]?.total) || 0;
}

export async function getMerchantAgendaExcelData(
  dateFrom: string,
  dateTo: string
) {
  const result = await db
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
  if (date == "" || date == null || date == undefined) {
    date = new Date().toISOString().split("T")[0];
  }

  const searchTerm = search ? `'${search}'` : "NULL";

  const query = `
    WITH payout_filtered AS (
      SELECT *
      FROM payout
      WHERE DATE(settlement_date) = DATE('${date}')
    ),
    global_total AS (
      SELECT 
        SUM(settlement_amount) AS global_settlement_total,
        SUM(installment_amount) AS global_gross_total
      FROM payout_filtered
    ),
    merchant_totals AS (
      SELECT 
        id_merchant, 
        SUM(settlement_amount) AS merchant_total,
        SUM(installment_amount) AS merchant_gross_total,
        CASE 
          WHEN COUNT(*) FILTER (WHERE status LIKE '%SETTLED%') > 0 THEN 'SETTLED'
          ELSE MIN(status)
        END AS merchant_status
      FROM payout_filtered
      GROUP BY id_merchant
    ),
    product_totals AS (
      SELECT 
        id_merchant, 
        product_type, 
        SUM(settlement_amount) AS product_settlement_total,
        SUM(installment_amount) AS product_gross_total
      FROM payout_filtered
      GROUP BY id_merchant, product_type
    ),
    product_percentages AS (
      SELECT 
        pt.id_merchant,
        pt.product_type,
        pt.product_settlement_total,
        pt.product_gross_total,
        ROUND((pt.product_settlement_total * 100.0 / mt.merchant_total), 2) AS product_percentage
      FROM product_totals pt
      JOIN merchant_totals mt ON pt.id_merchant = mt.id_merchant
    ),
    installment_totals AS (
      SELECT 
        id_merchant, 
        product_type, 
        installments,
        SUM(settlement_amount) AS installment_settlement_total,
        SUM(installment_amount) AS installment_gross_total
      FROM payout_filtered
      GROUP BY id_merchant, product_type, installments
    ),
    installment_percentages AS (
      SELECT 
        it.id_merchant,
        it.product_type,
        it.installments,
        it.installment_settlement_total,
        it.installment_gross_total,
        ROUND((it.installment_settlement_total * 100.0 / pt.product_settlement_total), 2) AS installment_percentage
      FROM installment_totals it
      JOIN product_totals pt ON it.id_merchant = pt.id_merchant AND it.product_type = pt.product_type
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
        bt.brand_gross_total,
        ROUND((bt.brand_settlement_total * 100.0 / pt.product_settlement_total), 2) AS brand_percentage
      FROM brand_totals bt
      JOIN product_totals pt ON bt.id_merchant = pt.id_merchant AND bt.product_type = pt.product_type
    ),
    merchant_data AS (
      SELECT
        m.name AS merchant,
        mt.merchant_total AS total,
        mt.merchant_gross_total AS gross_total,
        mt.merchant_status AS status,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name', pp.product_type,
              'totalGross', pp.product_gross_total,
              'totalSettlement', pp.product_settlement_total,
              'percentage', pp.product_percentage,
              'installments', (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'count', ip.installments,
                    'totalGross', ip.installment_gross_total,
                    'totalSettlement', ip.installment_settlement_total,
                    'percentage', ip.installment_percentage
                  )
                )
                FROM installment_percentages ip
                WHERE ip.id_merchant = pp.id_merchant 
                  AND ip.product_type = pp.product_type
              ),
              'brand', (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'name', bp.brand,
                    'totalGross', bp.brand_gross_total,
                    'totalSettlement', bp.brand_settlement_total,
                    'percentage', bp.brand_percentage
                  )
                )
                FROM brand_percentages bp
                WHERE bp.id_merchant = pp.id_merchant 
                  AND bp.product_type = pp.product_type
              )
            )
          ) FILTER (WHERE pp.product_type IS NOT NULL), '[]'::jsonb
        ) AS productType
      FROM product_percentages pp
      JOIN merchant_totals mt ON pp.id_merchant = mt.id_merchant
      JOIN merchants m ON mt.id_merchant = m.id
      WHERE (${searchTerm} IS NULL OR m.name ILIKE '%' || ${searchTerm} || '%')
      GROUP BY m.name, mt.merchant_total, mt.merchant_gross_total, mt.merchant_status
    ),
    payment_method_totals AS (
      SELECT 
        product_type,
        SUM(product_settlement_total) AS method_settlement_total,
        SUM(product_gross_total) AS method_gross_total
      FROM product_totals
      GROUP BY product_type
    ),
    payment_method_percentages AS (
      SELECT
        pmt.product_type,
        pmt.method_settlement_total,
        pmt.method_gross_total,
        ROUND((pmt.method_settlement_total * 100.0 / gt.global_settlement_total), 2) AS method_percentage
      FROM payment_method_totals pmt, global_total gt
    ),
    brand_summary_totals AS (
      SELECT 
        brand,
        SUM(brand_settlement_total) AS brand_settlement_total,
        SUM(brand_gross_total) AS brand_gross_total
      FROM brand_totals
      GROUP BY brand
    ),
    brand_summary_percentages AS (
      SELECT
        bst.brand,
        bst.brand_settlement_total,
        bst.brand_gross_total,
        ROUND((bst.brand_settlement_total * 100.0 / gt.global_settlement_total), 2) AS brand_percentage
      FROM brand_summary_totals bst, global_total gt
    )
    SELECT jsonb_build_object(
      'globalSettlement', (SELECT global_settlement_total FROM global_total),
      'globalGross', (SELECT global_gross_total FROM global_total),
      'merchants', (SELECT jsonb_agg(merchant_data) FROM merchant_data),
      'paymentMethods', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', product_type,
            'totalSettlement', method_settlement_total,
            'totalGross', method_gross_total,
            'percentage', method_percentage
          )
        )
        FROM payment_method_percentages
      ),
      'brands', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', brand,
            'totalSettlement', brand_settlement_total,
            'totalGross', brand_gross_total,
            'percentage', brand_percentage
          )
        )
        FROM brand_summary_percentages
      )
    ) AS result;
  `;

  try {
    const result = await db.execute(query);
    return result.rows[0].result as GlobalSettlementResult;
  } catch (error) {
    console.error("Erro ao executar consulta SQL:", error);
    throw new Error("Falha ao obter dados de liquidação global");
  }
}

export async function getDailyStatistics(date: string): Promise<{
  paymentMethods: PaymentMethodData[];
  brands: BrandData[];
}> {
  if (!date) {
    return {
      paymentMethods: [],
      brands: [],
    };
  }

  const query = `
    WITH payout_filtered AS (
      SELECT *
      FROM payout
      WHERE DATE(settlement_date) = DATE('${date}')
    ),
    global_total AS (
      SELECT 
        SUM(receivable_amount) AS global_settlement_total
      FROM payout_filtered
    ),
    payment_method_totals AS (
      SELECT 
        product_type,
        SUM(settlement_amount) AS method_settlement_total,
        SUM(installment_amount) AS method_gross_total
      FROM payout_filtered
      GROUP BY product_type
    ),
    payment_method_percentages AS (
      SELECT
        pmt.product_type,
        pmt.method_settlement_total,
        pmt.method_gross_total,
        ROUND((pmt.method_settlement_total * 100.0 / NULLIF(gt.global_settlement_total, 0)), 2) AS method_percentage
      FROM payment_method_totals pmt, global_total gt
    ),
    brand_summary_totals AS (
      SELECT 
        brand,
        SUM(settlement_amount) AS brand_settlement_total,
        SUM(installment_amount) AS brand_gross_total
      FROM payout_filtered
      GROUP BY brand
    ),
    brand_summary_percentages AS (
      SELECT
        bst.brand,
        bst.brand_settlement_total,
        bst.brand_gross_total,
        ROUND((bst.brand_settlement_total * 100.0 / NULLIF(gt.global_settlement_total, 0)), 2) AS brand_percentage
      FROM brand_summary_totals bst, global_total gt
    )
    SELECT jsonb_build_object(
      'paymentMethods', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', product_type,
            'totalSettlement', method_settlement_total,
            'totalGross', method_gross_total,
            'percentage', method_percentage
          )
        )
        FROM payment_method_percentages
      ),
      'brands', (
        SELECT jsonb_agg(
          jsonb_build_object(
            'name', brand,
            'totalSettlement', brand_settlement_total,
            'totalGross', brand_gross_total,
            'percentage', brand_percentage
          )
        )
        FROM brand_summary_percentages
      )
    ) AS result;
  `;

  try {
    const result = await db.execute(query);
    const stats = (result.rows[0]?.result as {
      paymentMethods?: PaymentMethodData[];
      brands?: BrandData[];
    }) || { paymentMethods: [], brands: [] };

    return {
      paymentMethods: stats.paymentMethods || [],
      brands: stats.brands || [],
    };
  } catch (error) {
    console.error(
      "Erro ao executar consulta SQL para estatísticas diárias:",
      error
    );
    return {
      paymentMethods: [],
      brands: [],
    };
  }
}
