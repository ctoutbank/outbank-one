"use server";

import { db } from "@/server/db";
import { asc, count, desc, eq, ilike, or } from "drizzle-orm";
import { categories, merchants, payout } from "../../../../drizzle/schema";
import { te } from "date-fns/locale";

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

export async function getMerchantAgenda(
  search: string,
  page: number,
  pageSize: number,
  sortField: string = "id",
  sortOrder: "asc" | "desc" = "desc"
): Promise<MerchantAgendaList> {
  const offset = (page - 1) * pageSize;

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
    .where(or(ilike(merchants.name, `%${search}%`)))
    .orderBy(desc(payout.settlementDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db.select({ count: count() }).from(payout);
  const totalCount = totalCountResult[0]?.count || 0;

  console.log(sortField, sortOrder);

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
