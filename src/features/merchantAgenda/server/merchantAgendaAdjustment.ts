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
  sql,
  sum,
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

export interface AdjustmentDashboardStats {
  totalAdjustments: number;

  totalSettledAdjustments: number;
  totalSettledAdjustmentsValue: number;
  settledCreditAdjustments: number;
  settledCreditAdjustmentsValue: number;
  settledDebitAdjustments: number;
  settledDebitAdjustmentsValue: number;

  totalPartiallySettledAdjustments: number;
  totalPartiallySettledAdjustmentsValue: number;
  partiallySettledCreditAdjustments: number;
  partiallySettledCreditAdjustmentsValue: number;
  partiallySettledDebitAdjustments: number;
  partiallySettledDebitAdjustmentsValue: number;

  totalPendingAdjustments: number;
  totalPendingAdjustmentsValue: number;
  pendingCreditAdjustments: number;
  pendingCreditAdjustmentsValue: number;
  pendingDebitAdjustments: number;
  pendingDebitAdjustmentsValue: number;

  firstTransactionDate?: string;
  lastTransactionDate?: string;
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

/**
 * Obtém estatísticas de ajustes da agenda do comerciante para o dashboard
 *
 * Esta função recupera estatísticas detalhadas sobre ajustes financeiros,
 * incluindo contagens totais, valores e datas de transações.
 *
 * @param dateFrom - Data inicial para filtrar transações
 * @param dateTo - Data final para filtrar transações
 * @param establishment - Nome do estabelecimento para filtrar
 * @returns Estatísticas de ajustes para o dashboard
 */
export async function getMerchantAgendaAdjustmentStats(
  dateFrom?: string,
  dateTo?: string,
  establishment?: string
): Promise<AdjustmentDashboardStats> {
  // Obtém o acesso do usuário aos comerciantes
  const userAccess = await getUserMerchantsAccess();

  // Se o usuário não tiver acesso e nem acesso total, retorna resultado vazio
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      totalAdjustments: 0,

      totalSettledAdjustments: 0,
      totalSettledAdjustmentsValue: 0,
      settledCreditAdjustments: 0,
      settledCreditAdjustmentsValue: 0,
      settledDebitAdjustments: 0,
      settledDebitAdjustmentsValue: 0,

      totalPartiallySettledAdjustments: 0,
      totalPartiallySettledAdjustmentsValue: 0,
      partiallySettledCreditAdjustments: 0,
      partiallySettledCreditAdjustmentsValue: 0,
      partiallySettledDebitAdjustments: 0,
      partiallySettledDebitAdjustmentsValue: 0,

      totalPendingAdjustments: 0,
      totalPendingAdjustmentsValue: 0,
      pendingCreditAdjustments: 0,
      pendingCreditAdjustmentsValue: 0,
      pendingDebitAdjustments: 0,
      pendingDebitAdjustmentsValue: 0,

      firstTransactionDate: undefined,
      lastTransactionDate: undefined,
    };
  }

  const conditions = [];

  // Adiciona filtro de acesso ao comerciante se o usuário não tiver acesso total
  if (!userAccess.fullAccess) {
    conditions.push(
      inArray(merchantSettlements.idMerchant, userAccess.idMerchants)
    );
  }

  // Filtro por data de transação (início)
  if (dateFrom) {
    conditions.push(
      gte(settlements.paymentDate, new Date(dateFrom).toISOString())
    );
  }

  // Filtro por data de transação (fim)
  if (dateTo) {
    conditions.push(
      lte(settlements.paymentDate, new Date(dateTo).toISOString())
    );
  }

  // Filtro por nome do estabelecimento
  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  // Filtro para garantir que estamos pegando apenas ajustes
  conditions.push(
    or(
      ne(merchantSettlements.debitFinancialAdjustmentAmount, "0"),
      ne(merchantSettlements.creditFinancialAdjustmentAmount, "0")
    )
  );

  // Buscar datas de transação
  const dateStats = await db
    .select({
      minTransactionDate: sql<string>`MIN(${settlements.paymentDate})`,
      maxTransactionDate: sql<string>`MAX(${settlements.paymentDate})`,
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions));

  // Contadores para ajustes liquidados
  const settledStats = await db
    .select({
      totalCount: count(),
      totalDebitValue: sum(merchantSettlements.debitFinancialAdjustmentAmount),
      totalCreditValue: sum(
        merchantSettlements.creditFinancialAdjustmentAmount
      ),
      debitCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.debitFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
      creditCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.creditFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions, eq(settlements.status, "SETTLED")));

  // Contadores para ajustes parcialmente liquidados
  const partiallySettledStats = await db
    .select({
      totalCount: count(),
      totalDebitValue: sum(merchantSettlements.debitFinancialAdjustmentAmount),
      totalCreditValue: sum(
        merchantSettlements.creditFinancialAdjustmentAmount
      ),
      debitCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.debitFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
      creditCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.creditFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions, eq(settlements.status, "PARTIALLY_SETTLED")));

  // Contadores para ajustes pendentes
  const pendingStats = await db
    .select({
      totalCount: count(),
      totalDebitValue: sum(merchantSettlements.debitFinancialAdjustmentAmount),
      totalCreditValue: sum(
        merchantSettlements.creditFinancialAdjustmentAmount
      ),
      debitCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.debitFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
      creditCount: sql<number>`SUM(CASE WHEN ${merchantSettlements.creditFinancialAdjustmentAmount} <> '0' THEN 1 ELSE 0 END)`,
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions, eq(settlements.status, "PENDING")));

  // Contador total de ajustes
  const totalStats = await db
    .select({
      totalCount: count(),
    })
    .from(settlements)
    .leftJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .leftJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .where(and(...conditions));

  return {
    totalAdjustments: Number(totalStats[0]?.totalCount || 0),

    totalSettledAdjustments: Number(settledStats[0]?.totalCount || 0),
    totalSettledAdjustmentsValue:
      Number(settledStats[0]?.totalDebitValue || 0) +
      Number(settledStats[0]?.totalCreditValue || 0),
    settledCreditAdjustments: Number(settledStats[0]?.creditCount || 0),
    settledCreditAdjustmentsValue: Number(
      settledStats[0]?.totalCreditValue || 0
    ),
    settledDebitAdjustments: Number(settledStats[0]?.debitCount || 0),
    settledDebitAdjustmentsValue: Number(settledStats[0]?.totalDebitValue || 0),

    totalPartiallySettledAdjustments: Number(
      partiallySettledStats[0]?.totalCount || 0
    ),
    totalPartiallySettledAdjustmentsValue:
      Number(partiallySettledStats[0]?.totalDebitValue || 0) +
      Number(partiallySettledStats[0]?.totalCreditValue || 0),
    partiallySettledCreditAdjustments: Number(
      partiallySettledStats[0]?.creditCount || 0
    ),
    partiallySettledCreditAdjustmentsValue: Number(
      partiallySettledStats[0]?.totalCreditValue || 0
    ),
    partiallySettledDebitAdjustments: Number(
      partiallySettledStats[0]?.debitCount || 0
    ),
    partiallySettledDebitAdjustmentsValue: Number(
      partiallySettledStats[0]?.totalDebitValue || 0
    ),

    totalPendingAdjustments: Number(pendingStats[0]?.totalCount || 0),
    totalPendingAdjustmentsValue:
      Number(pendingStats[0]?.totalDebitValue || 0) +
      Number(pendingStats[0]?.totalCreditValue || 0),
    pendingCreditAdjustments: Number(pendingStats[0]?.creditCount || 0),
    pendingCreditAdjustmentsValue: Number(
      pendingStats[0]?.totalCreditValue || 0
    ),
    pendingDebitAdjustments: Number(pendingStats[0]?.debitCount || 0),
    pendingDebitAdjustmentsValue: Number(pendingStats[0]?.totalDebitValue || 0),

    firstTransactionDate: dateStats[0]?.minTransactionDate,
    lastTransactionDate: dateStats[0]?.maxTransactionDate,
  };
}
