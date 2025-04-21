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
  ne,
  or,
} from "drizzle-orm";
import {
  merchants,
  merchantSettlements,
  settlements,
} from "../../../../drizzle/schema";

export interface MerchantAgendaAdjustment {
  merchantName: string | null;
  paymentDate: string | null;
  amount: number | null;
  type: string | null;
  title: string | null;
  reason: string | null;
  adjustmentType: string | null;
}

export interface MerchantAgendaAdjustmentList {
  merchantAgendaAdjustments: MerchantAgendaAdjustment[];
  totalCount: number;
}

export async function getMerchantAgendaAdjustment(
  search: string,
  page: number,
  pageSize: number,
  dateFrom?: string,
  dateTo?: string,
  establishment?: string
): Promise<MerchantAgendaAdjustmentList> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      merchantAgendaAdjustments: [],
      totalCount: 0,
    };
  }

  const conditions = [or(ilike(merchants.name, `%${search}%`))];

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(
      inArray(merchantSettlements.idMerchant, userAccess.idMerchants)
    );
  }

  if (dateFrom) {
    conditions.push(
      gte(settlements.paymentDate, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(
      lte(settlements.paymentDate, new Date(dateTo).toISOString())
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  const adjustmentFilter = ne(
    merchantSettlements.debitFinancialAdjustmentAmount,
    "0"
  );
  conditions.push(adjustmentFilter);

  const result = await db
    .select({
      merchantName: merchants.name,
      paymentDate: settlements.paymentDate,
      debitAmount: merchantSettlements.debitFinancialAdjustmentAmount,
      creditAmount: merchantSettlements.creditFinancialAdjustmentAmount,
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(settlements.paymentDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  // Transform the result to include both debit and credit entries when applicable
  const transformedResult = result.flatMap((item) => {
    const entries: MerchantAgendaAdjustment[] = [];

    if (item.debitAmount) {
      entries.push({
        merchantName: item.merchantName,
        paymentDate: item.paymentDate,
        amount: Number(item.debitAmount),
        type: "a débito",
        title: "",
        reason: "",
        adjustmentType: "",
      });
    }

    if (
      item.creditAmount &&
      item.creditAmount !== "0" &&
      item.creditAmount !== null &&
      item.creditAmount !== "0.00"
    ) {
      entries.push({
        merchantName: item.merchantName,
        paymentDate: item.paymentDate,
        amount: Number(item.creditAmount),
        type: "a crédito",
        title: "",
        reason: "",
        adjustmentType: "",
      });
    }

    return entries;
  });

  return {
    merchantAgendaAdjustments: transformedResult,
    totalCount,
  };
}
