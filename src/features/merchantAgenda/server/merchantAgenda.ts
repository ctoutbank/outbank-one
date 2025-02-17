"use server";

import { db } from "@/server/db";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
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

export async function getMerchantAgenda(
  search: string,
  page: number,
  pageSize: number,
  sortField: string = "id",
  sortOrder: "asc" | "desc" = "desc"
): Promise<MerchantAgendaList> {
  const offset = (page - 1) * pageSize;

  const maxExpectedSettlementDate = await db
    .select({
      maxExpectedSettlementDate: max(payout.expectedSettlementDate),
    })
    .from(payout);

  const maxDate =
    maxExpectedSettlementDate[0]?.maxExpectedSettlementDate || new Date(0);
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
    .where(
      and(
        eq(
          payout.expectedSettlementDate,
          typeof maxDate == "string" ? maxDate : maxDate.toISOString()
        ),
        or(ilike(merchants.name, `%${search}%`))
      )
    )
    .orderBy(desc(payout.settlementDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(payout)
    .innerJoin(merchants, eq(payout.idMerchant, merchants.id))
    .where(
      and(
        eq(
          payout.expectedSettlementDate,
          typeof maxDate == "string" ? maxDate : maxDate.toISOString()
        ),
        or(ilike(merchants.name, `%${search}%`))
      )
    );
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
  const maxDateResult = await db
    .select({
      maxDate: max(payout.expectedSettlementDate),
    })
    .from(payout);

  const maxDate = new Date(maxDateResult[0]?.maxDate || 0);

  const countResult = await db
    .selectDistinct({
      count: count(payout.idMerchant),
    })
    .from(payout)
    .where(eq(payout.settlementDate, maxDate.toISOString()));

  const totalSettlementAmountResult = await db
    .select({
      totalSettlementAmount: sum(payout.settlementAmount),
    })
    .from(payout)
    .where(eq(payout.settlementDate, maxDate.toISOString()));

  const totalTaxAmountResult = await db
    .select({
      totalTaxAmount: sum(payout.transactionMdr),
    })
    .from(payout)
    .where(eq(payout.settlementDate, maxDate.toISOString()));

  return {
    count: countResult[0]?.count?.toString() || null,
    totalSettlementAmount:
      totalSettlementAmountResult[0]?.totalSettlementAmount?.toString() || null,
    totalTaxAmount: totalTaxAmountResult[0]?.totalTaxAmount?.toString() || null,
  };
}

export async function getMerchantAgendaReceipts() {
  const merchantAgendaReceipts = await db
    .select({
      day: sql`DATE(${payout.settlementDate})`.as("day"),
      totalAmount: sql`SUM(${payout.settlementAmount})`.as("total_amount"),
    })
    .from(payout)
    .groupBy(sql`DATE(${payout.settlementDate})`)
    .orderBy(sql`DATE(${payout.settlementDate})`);

  return merchantAgendaReceipts;
}

export async function getMerchantAgendaTotal(date: Date) {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const result = await db
    .select({
      total: sql`SUM(${payout.settlementAmount})`,
    })
    .from(payout)
    .where(
      and(
        gte(payout.settlementDate, firstDayOfMonth.toISOString()),
        lte(payout.settlementDate, lastDayOfMonth.toISOString())
      )
    );

  return result[0]?.total || null;
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
          AND (${payout.settlementDate} <= ${dateTo})`
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

export async function getGlobalSettlement(): Promise<GlobalSettlementResult> {
  const query = `
    WITH payout_filtered AS (
      SELECT *
      FROM payout
      WHERE settlement_date = '2025-01-02'
    ),
    global_total AS (
      SELECT SUM(settlement_amount) AS global_settlement_total
      FROM payout_filtered
    ),
    merchant_totals AS (
      SELECT 
        id_merchant, 
        SUM(settlement_amount) AS merchant_total,
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
    merchant_data AS (
      SELECT
        m.name AS merchant,
        mt.merchant_total AS total,
        mt.merchant_status AS status,
        COALESCE(
          jsonb_agg(
            jsonb_build_object(
              'name', pt.product_type,
              'totalGross', pt.product_gross_total,
              'totalSettlement', pt.product_settlement_total,
              'brand', (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'name', bt.brand,
                    'totalGross', bt.brand_gross_total,
                    'totalSettlement', bt.brand_settlement_total
                  )
                )
                FROM brand_totals bt
                WHERE bt.id_merchant = pt.id_merchant 
                  AND bt.product_type = pt.product_type
              )
            )
          ) FILTER (WHERE pt.product_type IS NOT NULL), '[]'::jsonb
        ) AS productType
      FROM product_totals pt
      JOIN merchant_totals mt ON pt.id_merchant = mt.id_merchant
      JOIN merchants m ON mt.id_merchant = m.id
      GROUP BY m.name, mt.merchant_total, mt.merchant_status
    )
    SELECT jsonb_build_object(
      'globalSettlement', (SELECT global_settlement_total FROM global_total),
      'merchants', (SELECT jsonb_agg(merchant_data) FROM merchant_data)
    ) AS result;
  `;

  // Executa a query utilizando o método raw do drizzle
  const result = await db.execute(query);
  console.log(result);

  // Supondo que o resultado retorne a coluna "result" da primeira linha.
  return result.rows[0].result as GlobalSettlementResult;
}
