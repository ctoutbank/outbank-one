"use server";

import { db } from "@/server/db";
import { count, desc, eq, ilike, or } from "drizzle-orm";
import { settlements } from "../../../../drizzle/schema";


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

export type SettlementsInsert = typeof settlements.$inferInsert;
export type SettlementsDetail = typeof settlements.$inferSelect;

export async function getSettlements(
  search: string,
  page: number,
  pageSize: number
): Promise<SettlementsList> {
  const offset = (page - 1) * pageSize;

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
      pending_financial_adjustment_amount: settlements.pendingFinancialAdjustmentAmount,
      credit_adjustment_amount: settlements.creditFinancialAdjustmentAmount,
      debit_adjustment_amount: settlements.debitFinancialAdjustmentAmount
    })

    .from(settlements)
    .where(
      or(
        ilike(settlements.status, `%${search}%`)
      )
    )
    .orderBy(desc(settlements.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db.select({ count: count() }).from(settlements);
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
      pending_restituition_amount: Number(settlement.pending_restituition_amount),
      total_credit_adjustment_amount: Number(settlement.total_credit_adjustment_amount),
      total_debit_adjustment_amount: Number(settlement.total_debit_adjustment_amount),
      total_settlement_amount: Number(settlement.total_settlement_amount),
      rest_rounding_amount: Number(settlement.rest_rounding_amount),
      outstanding_amount: Number(settlement.outstanding_amount),
      slug_customer: settlement.slug_customer || null,
      status: settlement.status || null,
      credit_status: settlement.credit_status || null,
      debit_status: settlement.debit_status || null,
      anticipation_status: settlement.anticipation_status || null,
      pix_status: settlement.pix_status || null,
      payment_date: settlement.payment_date ? new Date(settlement.payment_date) : null,
      pending_financial_adjustment_amount: Number(settlement.pending_financial_adjustment_amount),
      credit_adjustment_amount: Number(settlement.credit_adjustment_amount),
      debit_adjustment_amount: Number(settlement.debit_adjustment_amount)
    })),
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

