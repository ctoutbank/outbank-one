"use server";

import { db } from "@/server/db";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  merchants,
  merchantSettlements,
  settlements,
} from "../../../../drizzle/schema";

export interface SettlementsList {
  settlements: {
    id: number;
    slug: string | null;
    active: boolean | null;
    dtinsert: Date | null;
    dtupdate: Date | null;
    batch_amount: number | null;
    discount_fee_amount: number | null;
    net_settlement_amount: number | null;
    total_anticipation_amount: number | null;
    total_restituition_amount: number | null;
    pix_amount: number | null;
    pix_net_amount: number | null;
    pix_fee_amount: number | null;
    pix_cost_amount: number | null;
    pending_restituition_amount: number | null;
    total_credit_adjustment_amount: number | null;
    total_debit_adjustment_amount: number | null;
    total_settlement_amount: number | null;
    rest_rounding_amount: number | null;
    outstanding_amount: number | null;
    slug_customer: string | null;
    status: string | null;
    credit_status: string | null;
    debit_status: string | null;
    anticipation_status: string | null;
    pix_status: string | null;
    payment_date: Date | null;
    pending_financial_adjustment_amount: number | null;
    credit_adjustment_amount: number | null;
    debit_adjustment_amount: number | null;
  }[];
  totalCount: number;
}

export type SettlementDetail = {
  payment_date: string | null;
  batch_amount: string | null;
  total_anticipation_amount: string | null;
  total_restituition_amount: string | null;
  total_settlement_amount: string | null;
  debit_status: string | null;
  credit_status: string | null;
  anticipation_status: string | null;
  pix_status: string | null;
};

export type Order = {
  receivableUnit: string;
  productType: string;
  bank: string;
  agency: string;
  settlementUniqueNumber: string;
  accountNumber: string;
  accountType: string;
  amount: number;
  effectivePaymentDate: string; // ISO 8601 date format
  paymentNumber: string;
  status: string;
  corporateName: string;
  documentId: string;
};

export type MerchantSettlement = {
  id: number;
  merchant: string;
  batchamount: number;
  totalanticipationamount: number;
  pendingfinancialadjustmentamount: number;
  pendingrestitutionamount: number;
  totalsettlementamount: number;
  status: string;
  orders?: Order[];
};

export type MerchantSettlementList = {
  merchant_settlements: MerchantSettlement[];
  totalCount: number;
};
export type SettlementsInsert = typeof settlements.$inferInsert;
export type SettlementsDetail = typeof settlements.$inferSelect;
export type MerchantSettlementsInsert = typeof merchantSettlements.$inferInsert;
export type MerchantSettlementsDetail = typeof merchantSettlements.$inferSelect;

export async function getSettlements(
  status: string,
  dateFrom: string,
  dateTo: string,
  page: number,
  pageSize: number
): Promise<SettlementsList> {
  const offset = (page - 1) * pageSize;
  status = status == undefined || status == "" || status == null ? "0" : status;
  const dateF: string =
    dateFrom == undefined || dateFrom == "" || dateFrom == null
      ? "2024-02-23"
      : dateFrom;
  const dateT: string =
    dateTo == undefined || dateTo == "" || dateTo == null
      ? "	2025-01-30"
      : dateTo;
  const result = await db
    .select({
      id: settlements.id,
      slug: settlements.slug,
      active: settlements.active,
      dtinsert: settlements.dtinsert,
      dtupdate: settlements.dtupdate,
      batch_amount: settlements.batchAmount,
      discount_fee_amount: settlements.discountFeeAmount,
      net_settlement_amount: settlements.netSettlementAmount,
      total_anticipation_amount: settlements.totalAnticipationAmount,
      total_restituition_amount: settlements.totalRestitutionAmount,
      pix_amount: settlements.pixAmount,
      pix_net_amount: settlements.pixNetAmount,
      pix_fee_amount: settlements.pixFeeAmount,
      pix_cost_amount: settlements.pixCostAmount,
      pending_restituition_amount: settlements.pendingRestitutionAmount,
      total_credit_adjustment_amount: settlements.totalCreditAdjustmentAmount,
      total_debit_adjustment_amount: settlements.totalDebitAdjustmentAmount,
      total_settlement_amount: settlements.totalSettlementAmount,
      rest_rounding_amount: settlements.restRoundingAmount,
      outstanding_amount: settlements.outstandingAmount,
      slug_customer: settlements.slugCustomer,
      status: settlements.status,
      credit_status: settlements.creditStatus,
      debit_status: settlements.debitStatus,
      anticipation_status: settlements.anticipationStatus,
      pix_status: settlements.pixStatus,
      payment_date: settlements.paymentDate,
      pending_financial_adjustment_amount:
        settlements.pendingFinancialAdjustmentAmount,
      credit_adjustment_amount: settlements.creditFinancialAdjustmentAmount,
      debit_adjustment_amount: settlements.debitFinancialAdjustmentAmount,
    })

    .from(settlements)
    .where(
      sql`((${status} in ('0') OR ${settlements.status} in (${status}))) 
      AND (${settlements.paymentDate} >= ${dateF}) 
      AND (${settlements.paymentDate} <= ${dateT})`
    )
    .orderBy(desc(settlements.paymentDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(settlements);
  const totalCount = totalCountResult[0]?.count || 0;

  return {
    settlements: result.map((settlement) => ({
      id: settlement.id,
      slug: settlement.slug || null,
      active: settlement.active || null,
      dtinsert: settlement.dtinsert ? new Date(settlement.dtinsert) : null,
      dtupdate: settlement.dtupdate ? new Date(settlement.dtupdate) : null,
      batch_amount: Number(settlement.batch_amount),
      discount_fee_amount: Number(settlement.discount_fee_amount),
      net_settlement_amount: Number(settlement.net_settlement_amount),
      total_anticipation_amount: Number(settlement.total_anticipation_amount),
      total_restituition_amount: Number(settlement.total_restituition_amount),
      pix_amount: Number(settlement.pix_amount),
      pix_net_amount: Number(settlement.pix_net_amount),
      pix_fee_amount: Number(settlement.pix_fee_amount),
      pix_cost_amount: Number(settlement.pix_cost_amount),
      pending_restituition_amount: Number(
        settlement.pending_restituition_amount
      ),
      total_credit_adjustment_amount: Number(
        settlement.total_credit_adjustment_amount
      ),
      total_debit_adjustment_amount: Number(
        settlement.total_debit_adjustment_amount
      ),
      total_settlement_amount: Number(settlement.total_settlement_amount),
      rest_rounding_amount: Number(settlement.rest_rounding_amount),
      outstanding_amount: Number(settlement.outstanding_amount),
      slug_customer: settlement.slug_customer || null,
      status: settlement.status || null,
      credit_status: settlement.credit_status || null,
      debit_status: settlement.debit_status || null,
      anticipation_status: settlement.anticipation_status || null,
      pix_status: settlement.pix_status || null,
      payment_date: settlement.payment_date
        ? new Date(settlement.payment_date)
        : null,
      pending_financial_adjustment_amount: Number(
        settlement.pending_financial_adjustment_amount
      ),
      credit_adjustment_amount: Number(settlement.credit_adjustment_amount),
      debit_adjustment_amount: Number(settlement.debit_adjustment_amount),
    })),
    totalCount,
  };
}

export async function getSettlementBySlug(slug: string) {
  const result = await db.execute(
    sql`SELECT 
        s.batch_amount,
        s.total_anticipation_amount,
        s.total_restitution_amount,
        s.total_settlement_amount,
        s.credit_status,
        s.debit_status,
        s.anticipation_status,
        s.pix_status,
        s.payment_date
        FROM settlements s
        WHERE (${slug} = '' AND s.payment_date = (Select MAX(payment_date) from settlements)) OR s.slug = ${slug}`
  );
  return {
    settlement: result.rows as SettlementDetail[],
  };
}

export async function getMerchantSettlements(
  search: string,
  page: number,
  pageSize: number,
  settlementSlug: string
): Promise<MerchantSettlementList> {
  const offset = (page - 1) * pageSize;

  const result = await db.execute(
    sql`SELECT 
        ms.id AS id,
        m.name AS merchant,
        ms.batch_amount AS batchAmount,
        ms.total_settlement_amount AS totalSettlementAmount,
        ms.total_anticipation_amount AS totalAnticipationAmount,
        ms.pending_financial_adjustment_amount AS pendingFinancialAdjustmentAmount,
        ms.pending_restitution_amount AS pendingRestitutionAmount,
        ms.status AS status,
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'receivableUnit', mo.brand,
              'productType', mo.product_type,
              'bank', mo.slug_payment_institution,
              'agency', mo.bank_branch_number,
              'settlementUniqueNumber', mo.settlement_unique_number,
              'accountNumber', mo.account_number,
              'accountType', mo.account_type,
              'amount', mo.amount,
              'effectivePaymentDate', mo.effective_payment_date,
              'status', mo.merchant_settlement_order_status,
              'corporateName', mo.corporate_name,
              'documentId', mo.document_id
            )
          )
          FROM merchant_settlement_orders mo
          WHERE mo.id_merchant_settlements = ms.id
        ) AS orders
      FROM merchant_settlements ms
      LEFT JOIN merchants m ON m.id = ms.id_merchant
      LEFT JOIN settlements s ON s.id = ms.id_settlement
      WHERE (${settlementSlug} = '' AND s.payment_date = (Select MAX(payment_date) from settlements)) OR s.slug = ${settlementSlug} AND (${search} = '' OR m.name ILIKE '%' || ${search} || '%')
      GROUP BY 
        ms.id,
        m.name,
        ms.batch_amount,
        ms.total_settlement_amount,
        ms.total_anticipation_amount,
        ms.pending_financial_adjustment_amount,
        ms.pending_restitution_amount,
        ms.status 
      ORDER BY ms.id ASC
      LIMIT ${pageSize} OFFSET ${offset};`
  );

  const totalCountResult = await db
    .select({ count: count() })
    .from(merchantSettlements)
    .where(
      settlementSlug
        ? eq(
            merchantSettlements.idSettlement,
            (
              await db
                .select({ id: settlements.id })
                .from(settlements)
                .where(eq(settlements.slug, settlementSlug))
                .limit(1)
            )[0]?.id
          )
        : eq(
            merchantSettlements.idSettlement,
            (
              await db
                .select({ id: settlements.id })
                .from(settlements)
                .orderBy(desc(settlements.paymentDate))
                .limit(1)
            )[0]?.id
          )
    );

  const totalCount = totalCountResult[0]?.count || 0;

  const rows: MerchantSettlement[] = result.rows as MerchantSettlement[];

  return {
    merchant_settlements: rows,
    totalCount,
  };
}

export async function getSettlementById(
  id: number
): Promise<SettlementsDetail | null> {
  const result = await db
    .select()
    .from(settlements)
    .where(eq(settlements.id, id));

  return result[0] || null;
}
