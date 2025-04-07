"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { db } from "@/server/db";
import { and, count, eq, inArray, sql } from "drizzle-orm";
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
  producttype: string;
  bank: string;
  agency: string;
  settlementuniquenumber: string;
  accountnumber: string;
  accounttype: string;
  amount: number;
  effectivepaymentdate: string; // ISO 8601 date format
  paymentnumber: string;
  status: string;
  corporatename: string;
  documentid: string;
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
      ? new Date(new Date().setDate(new Date().getDate() + 1))
          .toISOString()
          .split("T")[0]
      : dateTo;

  const result = await db.execute(
    sql`SELECT 
        s.slug,
        (s.batch_amount + s.pix_net_amount) AS batch_amount,
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
  console.log(result.rows);

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
        (s.batch_amount + s.pix_net_amount) AS batch_amount,
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

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // Build the merchant access condition
  let merchantAccessCondition = "";
  if (!userAccess.fullAccess) {
    if (userAccess.idMerchants.length === 0) {
      return {
        merchant_settlements: [],
        totalCount: 0,
      };
    }
    merchantAccessCondition = `AND m.id = ANY(ARRAY[${userAccess.idMerchants.join(
      ","
    )}])`;
  }

  const result = await db.execute(
    sql`SELECT 
        ms.id AS id,
        m.name AS merchant,
        (COALESCE(ms.batch_amount, 0) + COALESCE(ms.pix_net_amount, 0)) AS batchAmount,
        ms.total_settlement_amount AS totalSettlementAmount,
        ms.total_anticipation_amount AS totalAnticipationAmount,
        ms.pending_financial_adjustment_amount AS pendingFinancialAdjustmentAmount,
        ms.pending_restitution_amount AS pendingRestitutionAmount,
        ms.status AS status,
        c.customer_id AS customerId,
        ms.batch_amount AS batchAmount1,
        ms.pix_net_amount AS pixNetAmount,
        (
          SELECT JSON_AGG(orders)
          FROM (
            SELECT
              brand AS receivableUnit,
              product_type AS producttype,
              slug_payment_institution AS bank,
              bank_branch_number AS agency,
              settlement_unique_number AS settlementuniquenumber,
              account_number AS accountnumber,
              account_type AS accounttype,
              amount,
              effective_payment_date AS effectivepaymentdate,
              merchant_settlement_order_status AS status,
              corporate_name AS corporatename,
              document_id AS documentid,
              lock
            FROM merchant_settlement_orders mo
            WHERE mo.id_merchant_settlements = ms.id
            UNION ALL
            SELECT
              'PIX' AS receivableUnit,
              'PIX' AS producttype,
              compe_code AS bank,
              bank_branch_number AS agency,
              settlement_unique_number AS settlementuniquenumber,
              account_number AS accountnumber,
              account_type AS accounttype,
              total_settlement_amount AS amount,
              effective_payment_date AS effectivepaymentdate,
              status,
              corporate_name AS corporatename,
              document_id AS documentid,
              false AS lock
            FROM merchant_pix_settlement_orders mpo
            WHERE mpo.id_merchant_settlement = ms.id
          ) AS orders
        ) AS orders
      FROM merchant_settlements ms
      LEFT JOIN merchants m ON m.id = ms.id_merchant
      LEFT JOIN settlements s ON s.id = ms.id_settlement
      LEFT JOIN customers c ON c.id = ms.id_customer
      WHERE ((${settlementSlug} = '' AND s.payment_date = ${currentDay}) OR s.slug = ${settlementSlug}) 
        AND (${search} = '' OR m.name ILIKE '%' || ${search} || '%')
        ${sql.raw(merchantAccessCondition)}
      ORDER BY ms.id ASC
      LIMIT ${pageSize}
      OFFSET ${offset}`
  );
  console.log(result.rows);
  // Add merchant access control to count query
  const conditions = [
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
                eq(settlements.paymentDate, sql`${currentDay.toISOString()}`)
              )
              .limit(1)
          )[0]?.id
        ),
    sql`(${search} = '' OR ${merchants.name} ILIKE '%' || ${search} || '%')`,
  ];

  // Add merchant access filter to conditions if user doesn't have full access
  if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  }

  const totalCountResult = await db
    .select({ count: count() })
    .from(merchantSettlements)
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  const rows: MerchantSettlement[] = result.rows as MerchantSettlement[];

  return {
    merchant_settlements: rows,
    totalCount,
  };
}
