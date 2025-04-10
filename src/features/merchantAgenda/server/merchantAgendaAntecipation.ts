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
    or,
} from "drizzle-orm";
import { merchants, payoutAntecipations } from "../../../../drizzle/schema";

export interface MerchantAgendaAntecipation {
  merchantName: string | null;
  rrn: string | null;
  transactionDate: string | null;
  type: string | null;
  brand: string | null;
  installmentNumber: number | null;
  installmentAmount: number | null;
  transactionMdr: number | null;
  transactionMdrFee: number | null;
  settlementAmount: number | null;
  expectedSettlementDate: string | null;
  anticipatedAmount: number | null;
  anticipationDayNumber: number | null;
  anticipationMonthFee: number | null;
  anticipationFee: number | null;
  netAmount: number | null;
  anticipationCode: string | null;
  settlementDate: string | null;
  effectivePaymentDate: string | null;
  settlementUniqueNumber: string | null;
}

export interface MerchantAgendaAntecipationList {
  merchantAgendaAntecipations: MerchantAgendaAntecipation[];
  totalCount: number;
}

export async function getMerchantAgendaAntecipation(
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
): Promise<MerchantAgendaAntecipationList> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      merchantAgendaAntecipations: [],
      totalCount: 0,
    };
  }

  const conditions = [or(ilike(merchants.name, `%${search}%`))];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(
      inArray(payoutAntecipations.idMerchants, userAccess.idMerchants)
    );
  }

  if (dateFrom) {
    conditions.push(
      gte(payoutAntecipations.transactionDate, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(
      lte(payoutAntecipations.transactionDate, new Date(dateTo).toISOString())
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status && status !== "all") {
    conditions.push(eq(payoutAntecipations.status, status));
  }

  if (cardBrand && cardBrand !== "all") {
    conditions.push(eq(payoutAntecipations.brand, cardBrand));
  }

  if (settlementDateFrom) {
    conditions.push(
      gte(payoutAntecipations.settlementDate, settlementDateFrom)
    );
  }

  if (settlementDateTo) {
    conditions.push(lte(payoutAntecipations.settlementDate, settlementDateTo));
  }

  if (expectedSettlementDateFrom) {
    conditions.push(
      gte(
        payoutAntecipations.expectedSettlementDate,
        expectedSettlementDateFrom
      )
    );
  }

  if (expectedSettlementDateTo) {
    conditions.push(
      lte(payoutAntecipations.expectedSettlementDate, expectedSettlementDateTo)
    );
  }

  const result = await db
    .select({
      merchantName: merchants.name,
      rrn: payoutAntecipations.rrn,
      transactionDate: payoutAntecipations.transactionDate,
      type: payoutAntecipations.type,
      brand: payoutAntecipations.brand,
      installmentNumber: payoutAntecipations.installmentNumber,
      installmentAmount: payoutAntecipations.installmentAmount,
      transactionMdr: payoutAntecipations.transactionMdr,
      transactionMdrFee: payoutAntecipations.transactionMdrFee,
      settlementAmount: payoutAntecipations.settlementAmount,
      expectedSettlementDate: payoutAntecipations.expectedSettlementDate,
      anticipatedAmount: payoutAntecipations.anticipatedAmount,
      anticipationDayNumber: payoutAntecipations.anticipationDayNumber,
      anticipationMonthFee: payoutAntecipations.anticipationMonthFee,
      anticipationFee: payoutAntecipations.anticipationFee,
      netAmount: payoutAntecipations.netAmount,
      anticipationCode: payoutAntecipations.anticipationCode,
      settlementDate: payoutAntecipations.settlementDate,
      effectivePaymentDate: payoutAntecipations.effectivePaymentDate,
      settlementUniqueNumber: payoutAntecipations.settlementUniqueNumber,
    })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(payoutAntecipations.settlementDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    merchantAgendaAntecipations: result.map((item) => ({
      merchantName: item.merchantName,
      rrn: item.rrn,
      transactionDate: item.transactionDate,
      type: item.type,
      brand: item.brand,
      installmentNumber: item.installmentNumber,
      installmentAmount: item.installmentAmount
        ? Number(item.installmentAmount)
        : null,
      transactionMdr: item.transactionMdr ? Number(item.transactionMdr) : null,
      transactionMdrFee: item.transactionMdrFee
        ? Number(item.transactionMdrFee)
        : null,
      settlementAmount: item.settlementAmount
        ? Number(item.settlementAmount)
        : null,
      expectedSettlementDate: item.expectedSettlementDate,
      anticipatedAmount: item.anticipatedAmount
        ? Number(item.anticipatedAmount)
        : null,
      anticipationDayNumber: item.anticipationDayNumber,
      anticipationMonthFee: item.anticipationMonthFee
        ? Number(item.anticipationMonthFee)
        : null,
      anticipationFee: item.anticipationFee
        ? Number(item.anticipationFee)
        : null,
      netAmount: item.netAmount ? Number(item.netAmount) : null,
      anticipationCode: item.anticipationCode,
      settlementDate: item.settlementDate,
      effectivePaymentDate: item.effectivePaymentDate,
      settlementUniqueNumber: item.settlementUniqueNumber,
    })),
    totalCount,
  };
}
