"use server";

import { translateStatus } from "@/lib/utils";
import { db } from "@/server/db";
import { and, count, desc, eq, ilike, ne, sql, SQL } from "drizzle-orm";
import {
  categories,
  configurations,
  customers,
  merchants,
  merchantSettlementOrders,
  merchantSettlements,
  settlements,
} from "../../../../drizzle/schema";

export interface AnticipationList {
  anticipations: {
    slug: string;
    dtinsert: Date;
    productType: string;
    merchantName: string;
    merchantCnpj: string;
    customer: string;
    mcc: string;
    amount: number;
    status: string;
    anticipationRiskFactorCp: number;
    anticipationRiskFactorCnp: number;
  }[];
  totalCount: number;
}

export async function getAnticipations(
  search: string,
  page: number,
  pageSize: number,
  startDate?: string,
  endDate?: string,
  merchantSlug?: string,
  type?: string,
  status?: string
): Promise<AnticipationList> {
  const offset = (page - 1) * pageSize;

  // Build the where conditions
  const conditions: SQL[] = [];

  // Add search condition
  if (search) {
    const searchCondition = ilike(merchants.name, `%${search}%`);
    conditions.push(searchCondition);
  }

  // Add date range conditions
  if (startDate) {
    const startDateCondition = sql`${settlements.paymentDate} >= ${new Date(
      startDate
    ).toISOString()}`;
    conditions.push(startDateCondition);
  }
  if (endDate) {
    const endDateCondition = sql`${settlements.paymentDate} <= ${new Date(
      endDate
    ).toISOString()}`;
    conditions.push(endDateCondition);
  }

  // Add merchant filter
  if (merchantSlug && merchantSlug !== "all") {
    const merchantCondition = eq(merchants.slug, merchantSlug);
    conditions.push(merchantCondition);
  }

  if (type) {
    const typeCNP = eq(configurations.lockCnpAnticipationOrder, false);
    const typeCP = eq(configurations.lockCpAnticipationOrder, false);
    if (type === "CNP") {
      conditions.push(typeCNP);
    } else if (type === "CP") {
      conditions.push(typeCP);
    } else if (type === "Both") {
      conditions.push(typeCNP);
      conditions.push(typeCP);
    }
  }

  // Add status filter
  if (status) {
    const statusCondition = eq(settlements.anticipationStatus, status);
    conditions.push(statusCondition);
  }

  const anticipationFilter = eq(
    merchantSettlementOrders.productType,
    "ANTICIPATION"
  );
  conditions.push(anticipationFilter);
  const pendingFinancial = eq(
    merchantSettlements.pendingFinancialAdjustmentAmount,
    "0"
  );
  conditions.push(pendingFinancial);

  const result = await db
    .select({
      slug: settlements.slug,
      dtinsert: settlements.paymentDate,
      lockCnp: configurations.lockCnpAnticipationOrder,
      lockCp: configurations.lockCpAnticipationOrder,
      merchantName: merchants.name,
      merchantCnpj: merchants.idDocument,
      amount: settlements.totalAnticipationAmount,
      status: settlements.anticipationStatus,
      customer: customers.name,
      mcc: categories.mcc,
      anticipationRiskFactorCp: categories.anticipationRiskFactorCp,
      anticipationRiskFactorCnp: categories.anticipationRiskFactorCnp,
    })
    .from(settlements)
    .innerJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .innerJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .innerJoin(
      merchantSettlementOrders,
      eq(merchantSettlements.id, merchantSettlementOrders.idMerchantSettlements)
    )
    .innerJoin(configurations, eq(configurations.id, merchants.idConfiguration))
    .leftJoin(customers, eq(merchants.idCustomer, customers.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...conditions))
    .orderBy(desc(settlements.paymentDate))
    .groupBy(
      settlements.slug,
      settlements.paymentDate,
      configurations.lockCnpAnticipationOrder,
      configurations.lockCpAnticipationOrder,
      merchants.name,
      merchants.idDocument,
      settlements.totalAnticipationAmount,
      settlements.anticipationStatus,
      customers.name,
      categories.mcc,
      categories.anticipationRiskFactorCp,
      categories.anticipationRiskFactorCnp
    )
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count(sql`DISTINCT ${settlements.slug}` as SQL<number>) })
    .from(settlements)
    .innerJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .innerJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .innerJoin(
      merchantSettlementOrders,
      eq(merchantSettlements.id, merchantSettlementOrders.idMerchantSettlements)
    )
    .innerJoin(configurations, eq(configurations.id, merchants.idConfiguration))
    .where(and(...conditions));
  const totalCount = totalCountResult[0]?.count || 0;
  const mockData = [81, 92, 111, 104, 56, 220];
  return {
    anticipations: result.map((anticipation, index) => ({
      slug: anticipation.slug || "",
      dtinsert: anticipation.dtinsert
        ? new Date(anticipation.dtinsert)
        : new Date(),
      productType:
        !anticipation.lockCnp && !anticipation.lockCp
          ? "Ambas"
          : !anticipation.lockCnp
            ? "Cartão Não Presente"
            : !anticipation.lockCp
              ? "Cartão Presente"
              : "",
      merchantCnpj: anticipation.merchantCnpj || "",
      merchantName: anticipation.merchantName || "",
      amount: Number(anticipation.amount) || 0,
      status: translateStatus(anticipation.status || ""),
      customer: anticipation.customer || "",
      mcc: anticipation.mcc || "",
      anticipationRiskFactorCp: mockData[index] || 0,
      anticipationRiskFactorCnp: 0,
    })),
    totalCount,
  };
}

export type MerchantDD = {
  slug: string;
  name: string;
};

export async function getMerchantDD(): Promise<MerchantDD[]> {
  const result = await db
    .select({
      slug: merchants.slug,
      name: merchants.name,
    })
    .from(merchants)
    .where(ne(merchants.slug, ""));

  return result.map((merchant) => ({
    slug: merchant.slug || "",
    name: merchant.name?.toUpperCase() || "",
  }));
}

export interface EventualAnticipationList {
  anticipations: {
    dtinsert: Date;
    type: string;
    merchantName: string;
    merchantCnpj: string;
    customer: string;
    mcc: string;
    amount: number;
    status: string;
    anticipationRiskFactorCp: number;
    anticipationRiskFactorCnp: number;
    expectedSettlementDate: Date;
    totalExpectedAmount: number;
    totalBlockedAmount: number;
    totalAvailableAmount: number;
    requestedAmount: number;
  }[];
  totalCount: number;
}

export async function getEventualAnticipations(
  search: string,
  page: number,
  pageSize: number,
  startDate?: string,
  endDate?: string,
  merchantSlug?: string,
  type?: string,
  status?: string,
  expectedSettlementStartDate?: string,
  expectedSettlementEndDate?: string
): Promise<EventualAnticipationList> {
  const offset = (page - 1) * pageSize;

  // Build the where conditions
  const conditions: SQL[] = [];

  // Add search condition
  if (search) {
    const searchCondition = ilike(merchants.name, `%${search}%`);
    conditions.push(searchCondition);
  }

  // Add date range conditions
  if (startDate) {
    const startDateCondition = sql`${settlements.paymentDate} >= ${new Date(
      startDate
    ).toISOString()}`;
    conditions.push(startDateCondition);
  }
  if (endDate) {
    const endDateCondition = sql`${settlements.paymentDate} <= ${new Date(
      endDate
    ).toISOString()}`;
    conditions.push(endDateCondition);
  }

  if (expectedSettlementStartDate) {
    const expectedStartDateCondition = sql`${
      settlements.paymentDate
    } >= ${new Date(expectedSettlementStartDate).toISOString()}`;
    conditions.push(expectedStartDateCondition);
  }
  if (expectedSettlementEndDate) {
    const expectedEndDateCondition = sql`${
      settlements.paymentDate
    } <= ${new Date(expectedSettlementEndDate).toISOString()}`;
    conditions.push(expectedEndDateCondition);
  }

  // Add merchant filter
  if (merchantSlug && merchantSlug !== "all") {
    const merchantCondition = eq(merchants.slug, merchantSlug);
    conditions.push(merchantCondition);
  }

  // Add type filter
  if (type) {
    const typeCNP = eq(configurations.lockCnpAnticipationOrder, false);
    const typeCP = eq(configurations.lockCpAnticipationOrder, false);
    if (type === "CNP") {
      conditions.push(typeCNP);
    } else if (type === "CP") {
      conditions.push(typeCP);
    } else if (type === "Both") {
      conditions.push(typeCNP);
      conditions.push(typeCP);
    }
  }

  // Add status filter
  if (status) {
    const statusCondition = eq(settlements.anticipationStatus, status);
    conditions.push(statusCondition);
  }

  const anticipationFilter = eq(
    merchantSettlementOrders.productType,
    "ANTICIPATION"
  );
  conditions.push(anticipationFilter);
  const pendingFinancial = ne(
    merchantSettlements.pendingFinancialAdjustmentAmount,
    "0"
  );
  conditions.push(pendingFinancial);

  const result = await db
    .select({
      slug: settlements.slug,
      dtinsert: settlements.dtinsert,
      lockCnp: configurations.lockCnpAnticipationOrder,
      lockCp: configurations.lockCpAnticipationOrder,
      merchantName: merchants.name,
      merchantCnpj: merchants.idDocument,
      amount: settlements.totalAnticipationAmount,
      status: settlements.anticipationStatus,
      customer: customers.name,
      mcc: categories.mcc,
      anticipationRiskFactorCp: categories.anticipationRiskFactorCp,
      anticipationRiskFactorCnp: categories.anticipationRiskFactorCnp,
      expectedSettlementDate: settlements.paymentDate,
      totalExpectedAmount: sql`'0'`,
      totalBlockedAmount: sql`'0'`,
      totalAvailableAmount: sql`'0'`,
      requestedAmount: settlements.totalAnticipationAmount,
    })
    .from(settlements)
    .innerJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .innerJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .innerJoin(
      merchantSettlementOrders,
      eq(merchantSettlements.id, merchantSettlementOrders.idMerchantSettlements)
    )
    .innerJoin(configurations, eq(configurations.id, merchants.idConfiguration))
    .leftJoin(customers, eq(merchants.idCustomer, customers.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...conditions))
    .orderBy(desc(settlements.paymentDate))
    .groupBy(
      settlements.slug,
      settlements.dtinsert,
      settlements.paymentDate,
      configurations.lockCnpAnticipationOrder,
      configurations.lockCpAnticipationOrder,
      merchants.name,
      merchants.idDocument,
      settlements.totalAnticipationAmount,
      settlements.anticipationStatus,
      customers.name,
      categories.mcc,
      categories.anticipationRiskFactorCp,
      categories.anticipationRiskFactorCnp,
      settlements.totalSettlementAmount,
      settlements.debitFinancialAdjustmentAmount
    )
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count(sql`DISTINCT ${settlements.slug}` as SQL<number>) })
    .from(settlements)
    .innerJoin(
      merchantSettlements,
      eq(settlements.id, merchantSettlements.idSettlement)
    )
    .innerJoin(merchants, eq(merchantSettlements.idMerchant, merchants.id))
    .innerJoin(
      merchantSettlementOrders,
      eq(merchantSettlements.id, merchantSettlementOrders.idMerchantSettlements)
    )
    .innerJoin(configurations, eq(configurations.id, merchants.idConfiguration))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    anticipations: result.map((anticipation) => ({
      dtinsert: anticipation.dtinsert
        ? new Date(anticipation.dtinsert)
        : new Date(),
      type:
        !anticipation.lockCnp && !anticipation.lockCp
          ? "Ambas"
          : !anticipation.lockCnp
            ? "Cartão Não Presente"
            : !anticipation.lockCp
              ? "Cartão Presente"
              : "",
      merchantCnpj: anticipation.merchantCnpj || "",
      merchantName: anticipation.merchantName || "",
      amount: Number(anticipation.amount) || 0,
      status: translateStatus(anticipation.status || ""),
      customer: anticipation.customer || "",
      mcc: anticipation.mcc || "",
      anticipationRiskFactorCp: 5,
      anticipationRiskFactorCnp: 0,
      expectedSettlementDate: anticipation.expectedSettlementDate
        ? new Date(anticipation.expectedSettlementDate)
        : new Date(),
      totalExpectedAmount: Number(anticipation.totalExpectedAmount) || 0,
      totalBlockedAmount: Number(anticipation.totalBlockedAmount) || 0,
      totalAvailableAmount: Number(anticipation.totalAvailableAmount) || 0,
      requestedAmount: Number(anticipation.requestedAmount) || 0,
    })),
    totalCount,
  };
}
