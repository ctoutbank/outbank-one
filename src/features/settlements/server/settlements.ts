"use server";

import { db } from "@/server/db";
import { and, count, desc, eq, ilike, or, sql } from "drizzle-orm";
import {
  merchants,
  merchantSettlements,
  settlements,
} from "../../../../drizzle/schema";

export type SettlementObject = {
  slug: string;
  batch_amount: string;
  total_anticipation_amount: string;
  total_restitution_amount: string;
  total_settlement_amount: string;
  status: string;
  payment_date: string;
};

export interface SettlementsList {
  settlements: SettlementObject[];
  totalCount: number;
}

export type SettlementDetail = {
  payment_date: string | null;
  batch_amount: string | null;
  total_anticipation_amount: string | null;
  total_restitution_amount: string | null;
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
  lock: string;
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
  customerId: string;
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
  console.log(status);
  status =
    status == undefined || status == "" || status == null
      ? "0"
      : status.toUpperCase();
  const dateF: string =
    dateFrom == undefined || dateFrom == "" || dateFrom == null
      ? "2024-02-23"
      : dateFrom;
  const dateT: string =
    dateTo == undefined || dateTo == "" || dateTo == null
      ? "2025-01-30"
      : dateTo;

  const result = await db.execute(
    sql`SELECT 
        s.slug,
        s.batch_amount,
        s.total_anticipation_amount,
        s.total_restitution_amount,
        s.total_settlement_amount,
        s.status,
        s.payment_date
      FROM settlements s
      WHERE ((${status} = '0') OR s.status = ANY(string_to_array(${status}, ',')))
        AND (s.payment_date >= ${dateF}) 
        AND (s.payment_date <= ${dateT})
      ORDER BY s.payment_date DESC
      LIMIT ${pageSize} OFFSET ${offset};`
  );

  const totalCountResult = await db
    .select({ count: count() })
    .from(settlements)
    .where(
      sql`((${status} = '0') OR ${settlements.status} = ANY(string_to_array(${status}, ',')))
      AND (${settlements.paymentDate} >= ${dateF}) 
      AND (${settlements.paymentDate}<= ${dateT})`
    );

  const totalCount = totalCountResult[0]?.count || 0;

  const rows: SettlementObject[] = result.rows as SettlementObject[];

  return {
    settlements: rows,
    totalCount,
  };
}

export async function getSettlementBySlug(slug: string) {
  const currentDay = new Date();
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
        WHERE (${slug} = '' AND s.payment_date = ${currentDay}) OR s.slug = ${slug}`
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
  const currentDay = new Date();

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
        c.customer_id AS customerId,
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
              'documentId', mo.document_id,
              'lock', mo.lock
             
            )
          )
          FROM merchant_settlement_orders mo
          WHERE mo.id_merchant_settlements = ms.id
        ) AS orders
      FROM merchant_settlements ms
      LEFT JOIN merchants m ON m.id = ms.id_merchant
      LEFT JOIN settlements s ON s.id = ms.id_settlement
      LEFT JOIN customers c ON c.id = ms.id_customer
      WHERE (${settlementSlug} = '' AND s.payment_date = ${currentDay}) OR s.slug = ${settlementSlug} AND (${search} = '' OR m.name ILIKE '%' || ${search} || '%')
      ORDER BY ms.id ASC
      LIMIT ${pageSize} OFFSET ${offset};`
  );

  const totalCountResult = await db
    .select({ count: count() })
    .from(merchantSettlements)
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(
      and(
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
                  .where(
                    eq(
                      settlements.paymentDate,
                      sql`${currentDay.toISOString()}`
                    )
                  )
                  .limit(1)
              )[0]?.id
            ),
        sql`(${search} = '' OR ${merchants.name} ILIKE '%' || ${search} || '%')`
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
