"use server";

import {
  getCustomerByTentant,
  getUserMerchantsAccess,
} from "@/features/users/server/users";
import { and, count, desc, eq, inArray, sql } from "drizzle-orm";
import { cookies } from "next/headers";
import {
  customerCustomization,
  customers,
  financialAdjustmentMerchants,
  financialAdjustments,
  merchants,
} from "../../../../drizzle/schema";
import { db } from "../../../server/db";

export type FinancialAdjustmentFull = {
  id: number;
  externalId: number | null;
  slug: string | null;
  active: boolean | null;
  expectedSettlementDate: Date | null;
  reason: string | null;
  title: string | null;
  description: string | null;
  rrn: string | null;
  grossValue: string | null;
  recurrence: string | null;
  type: string | null;
  startDate: Date | null;
  endDate: string | null;
  dtinsert: Date | null;
  dtupdate: Date | null;
  merchants: MerchantInfo[];
  idCustomer: number | null;
};

export type MerchantInfo = {
  id: number;
  name: string | null;
  idDocument: string | null;
};

export interface FinancialAdjustmentsList {
  financialAdjustments: FinancialAdjustmentFull[];
  totalCount: number;
}

export type FinancialAdjustmentDetail =
  typeof financialAdjustments.$inferSelect;
export type FinancialAdjustmentInsert =
  typeof financialAdjustments.$inferInsert;
export type FinancialAdjustmentMerchantDetail =
  typeof financialAdjustmentMerchants.$inferSelect;
export type FinancialAdjustmentMerchantInsert =
  typeof financialAdjustmentMerchants.$inferInsert;

export async function getFinancialAdjustments(
  search: string,
  page: number,
  pageSize: number,
  type?: string,
  reason?: string,
  active?: string
): Promise<FinancialAdjustmentsList> {
  const customer = await getCustomerByTentant();

  // If user has no access and no full access, return empty result
  if (!customer) {
    return {
      financialAdjustments: [],
      totalCount: 0,
    };
  }
  const offset = (page - 1) * pageSize;

  const conditions = [];

  if (search) {
    conditions.push(
      sql`(${financialAdjustments.title} ILIKE ${`%${search}%`} OR ${financialAdjustments.description} ILIKE ${`%${search}%`})`
    );
  }

  if (type) {
    conditions.push(eq(financialAdjustments.type, type));
  }

  if (reason) {
    conditions.push(eq(financialAdjustments.reason, reason));
  }

  if (active !== undefined) {
    conditions.push(eq(financialAdjustments.active, active === "true"));
  }

  conditions.push(eq(customers.slug, customer.slug));

  // Primeiro, buscar os ajustes financeiros únicos
  const adjustmentsResult = await db
    .select({
      id: financialAdjustments.id,
      externalId: financialAdjustments.externalId,
      slug: financialAdjustments.slug,
      active: financialAdjustments.active,
      expectedSettlementDate: financialAdjustments.expectedSettlementDate,
      reason: financialAdjustments.reason,
      title: financialAdjustments.title,
      description: financialAdjustments.description,
      rrn: financialAdjustments.rrn,
      grossValue: financialAdjustments.grossValue,
      recurrence: financialAdjustments.recurrence,
      type: financialAdjustments.type,
      startDate: financialAdjustments.startDate,
      endDate: financialAdjustments.endDate,
      dtinsert: financialAdjustments.dtinsert,
      dtupdate: financialAdjustments.dtupdate,
      idCustomer: financialAdjustments.idCustomer,
    })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(financialAdjustments.id))
    .limit(pageSize)
    .offset(offset);

  // Para cada ajuste, buscar os merchants associados
  const adjustmentsWithMerchants = await Promise.all(
    adjustmentsResult.map(async (adjustment) => {
      const merchantsResult = await db
        .select({
          id: merchants.id,
          name: merchants.name,
          idDocument: merchants.idDocument,
        })
        .from(financialAdjustmentMerchants)
        .innerJoin(
          merchants,
          eq(financialAdjustmentMerchants.idMerchant, merchants.id)
        )
        .innerJoin(customers, eq(merchants.idCustomer, customers.id))
        .where(
          and(
            eq(
              financialAdjustmentMerchants.idFinancialAdjustment,
              adjustment.id
            ),
            eq(customers.slug, customer.slug)
          )
        );

      return {
        id: adjustment.id,
        externalId: adjustment.externalId,
        slug: adjustment.slug,
        active: adjustment.active,
        expectedSettlementDate: adjustment.expectedSettlementDate
          ? new Date(adjustment.expectedSettlementDate)
          : null,
        reason: adjustment.reason,
        title: adjustment.title,
        description: adjustment.description,
        rrn: adjustment.rrn,
        grossValue: adjustment.grossValue,
        recurrence: adjustment.recurrence,
        type: adjustment.type,
        startDate: adjustment.startDate ? new Date(adjustment.startDate) : null,
        endDate: adjustment.endDate,
        dtinsert: adjustment.dtinsert ? new Date(adjustment.dtinsert) : null,
        dtupdate: adjustment.dtupdate ? new Date(adjustment.dtupdate) : null,
        merchants: merchantsResult,
        idCustomer: adjustment.idCustomer,
      };
    })
  );

  const totalCountResult = await db
    .select({ count: count() })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    financialAdjustments: adjustmentsWithMerchants,
    totalCount,
  };
}

export async function getFinancialAdjustmentById(
  id: number
): Promise<FinancialAdjustmentFull | null> {
  const customer = await getCustomerByTentant();
  const result = await db
    .select({
      id: financialAdjustments.id,
      externalId: financialAdjustments.externalId,
      slug: financialAdjustments.slug,
      active: financialAdjustments.active,
      expectedSettlementDate: financialAdjustments.expectedSettlementDate,
      reason: financialAdjustments.reason,
      title: financialAdjustments.title,
      description: financialAdjustments.description,
      rrn: financialAdjustments.rrn,
      grossValue: financialAdjustments.grossValue,
      recurrence: financialAdjustments.recurrence,
      type: financialAdjustments.type,
      startDate: financialAdjustments.startDate,
      endDate: financialAdjustments.endDate,
      dtinsert: financialAdjustments.dtinsert,
      dtupdate: financialAdjustments.dtupdate,
      idCustomer: financialAdjustments.idCustomer,
    })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(
      and(eq(financialAdjustments.id, id), eq(customers.slug, customer.slug))
    )
    .limit(1);

  if (!result[0]) return null;

  // Buscar merchants associados
  const merchantsResult = await db
    .select({
      id: merchants.id,
      name: merchants.name,
      idDocument: merchants.idDocument,
    })
    .from(financialAdjustmentMerchants)
    .innerJoin(
      merchants,
      eq(financialAdjustmentMerchants.idMerchant, merchants.id)
    )
    .innerJoin(customers, eq(merchants.idCustomer, customers.id))
    .where(
      and(
        eq(financialAdjustmentMerchants.idFinancialAdjustment, id),
        eq(customers.slug, customer.slug)
      )
    );

  return {
    ...result[0],
    dtinsert: result[0].dtinsert ? new Date(result[0].dtinsert) : null,
    dtupdate: result[0].dtupdate ? new Date(result[0].dtupdate) : null,
    merchants: merchantsResult,
    expectedSettlementDate: result[0].expectedSettlementDate
      ? new Date(result[0].expectedSettlementDate)
      : null,
    startDate: result[0].startDate ? new Date(result[0].startDate) : null,
  };
}

export async function insertFinancialAdjustment(
  adjustment: FinancialAdjustmentInsert
): Promise<number> {
  // Obter o customer ID usando a consulta especificada
  const cookieStore = cookies();
  const tenant = cookieStore.get("tenant")?.value;
  const customer = await db
    .select({
      id: customers.id,
    })
    .from(customerCustomization)
    .innerJoin(customers, eq(customerCustomization.customerId, customers.id))
    .where(eq(customerCustomization.slug, tenant || ""))
    .limit(1);

  if (!customer[0]) {
    throw new Error("Customer não encontrado para o tenant atual");
  }

  const result = await db
    .insert(financialAdjustments)
    .values({
      ...adjustment,
      idCustomer: customer[0].id, // Associar o customer ID
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
      active: adjustment.active ?? true,
    })
    .returning({
      id: financialAdjustments.id,
    });

  return result[0].id;
}

export async function updateFinancialAdjustment(
  adjustment: FinancialAdjustmentDetail
): Promise<void> {
  await db
    .update(financialAdjustments)
    .set({
      ...adjustment,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(financialAdjustments.id, adjustment.id));
}

export async function deleteFinancialAdjustment(id: number): Promise<void> {
  // Primeiro deletar os merchants associados
  await db
    .delete(financialAdjustmentMerchants)
    .where(eq(financialAdjustmentMerchants.idFinancialAdjustment, id));

  // Depois deletar o ajuste financeiro
  await db.delete(financialAdjustments).where(eq(financialAdjustments.id, id));
}

// Funções para gerenciar merchants associados
export async function addMerchantToFinancialAdjustment(
  idFinancialAdjustment: number,
  idMerchant: number
): Promise<number> {
  const result = await db
    .insert(financialAdjustmentMerchants)
    .values({
      idFinancialAdjustment,
      idMerchant,
      active: true,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
    })
    .returning({
      id: financialAdjustmentMerchants.id,
    });

  return result[0].id;
}

export async function removeMerchantFromFinancialAdjustment(
  idFinancialAdjustment: number,
  idMerchant: number
): Promise<void> {
  await db
    .delete(financialAdjustmentMerchants)
    .where(
      and(
        eq(
          financialAdjustmentMerchants.idFinancialAdjustment,
          idFinancialAdjustment
        ),
        eq(financialAdjustmentMerchants.idMerchant, idMerchant)
      )
    );
}

export async function getMerchantsForFinancialAdjustment(
  idFinancialAdjustment: number
): Promise<MerchantInfo[]> {
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }
  const result = await db
    .select({
      id: merchants.id,
      name: merchants.name,
      idDocument: merchants.idDocument,
    })
    .from(financialAdjustmentMerchants)
    .innerJoin(
      merchants,
      eq(financialAdjustmentMerchants.idMerchant, merchants.id)
    )
    .where(
      and(
        eq(
          financialAdjustmentMerchants.idFinancialAdjustment,
          idFinancialAdjustment
        ),
        eq(merchants.idCustomer, userAccess.idCustomer),
        userAccess.idMerchants.length > 0
          ? inArray(merchants.id, userAccess.idMerchants)
          : undefined
      )
    );

  return result.map((merchant) => ({
    ...merchant,
    name: merchant.name?.toUpperCase() ?? null,
  }));
}

// Função para buscar todos os merchants disponíveis
export async function getAllMerchants(): Promise<MerchantInfo[]> {
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return [];
  }
  const result = await db
    .select({
      id: merchants.id,
      name: merchants.name,
      idDocument: merchants.idDocument,
    })
    .from(merchants)
    .where(
      and(
        eq(merchants.active, true),
        eq(merchants.idCustomer, userAccess.idCustomer),
        userAccess.idMerchants.length > 0
          ? inArray(merchants.id, userAccess.idMerchants)
          : undefined
      )
    )
    .orderBy(merchants.name);

  return result.map((merchant) => ({
    ...merchant,
    name: merchant.name?.toUpperCase() ?? null,
  }));
}

// Estatísticas para dashboard
export type FinancialAdjustmentStats = {
  totalAdjustments: number;
  activeAdjustments: number;
  totalValue: number;
  typeStats: {
    [key: string]: number;
  };
  reasonStats: {
    [key: string]: number;
  };
};

export async function getFinancialAdjustmentStats(): Promise<FinancialAdjustmentStats> {
  const customer = await getCustomerByTentant();

  // If user has no access and no full access, return empty result
  if (!customer) {
    return {
      totalAdjustments: 0,
      activeAdjustments: 0,
      totalValue: 0,
      typeStats: {},
      reasonStats: {},
    };
  }
  const totalResult = await db
    .select({ count: count() })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(eq(customers.slug, customer.slug));

  const activeResult = await db
    .select({ count: count() })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(
      and(
        eq(financialAdjustments.active, true),
        eq(customers.slug, customer.slug)
      )
    );

  const valueResult = await db
    .select({
      total: sql<number>`COALESCE(SUM(CAST(${financialAdjustments.grossValue} AS DECIMAL)), 0)`,
    })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(
      and(
        eq(financialAdjustments.active, true),
        eq(customers.slug, customer.slug)
      )
    );

  const typeStatsResult = await db
    .select({
      type: financialAdjustments.type,
      count: count(),
    })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(
      and(
        eq(financialAdjustments.active, true),
        eq(customers.slug, customer.slug)
      )
    )
    .groupBy(financialAdjustments.type);

  const reasonStatsResult = await db
    .select({
      reason: financialAdjustments.reason,
      count: count(),
    })
    .from(financialAdjustments)
    .innerJoin(customers, eq(financialAdjustments.idCustomer, customers.id))
    .where(
      and(
        eq(financialAdjustments.active, true),
        eq(customers.slug, customer.slug)
      )
    )
    .groupBy(financialAdjustments.reason);

  const typeStats: { [key: string]: number } = {};
  typeStatsResult.forEach((stat) => {
    if (stat.type) {
      typeStats[stat.type] = stat.count;
    }
  });

  const reasonStats: { [key: string]: number } = {};
  reasonStatsResult.forEach((stat) => {
    if (stat.reason) {
      reasonStats[stat.reason] = stat.count;
    }
  });

  return {
    totalAdjustments: totalResult[0]?.count || 0,
    activeAdjustments: activeResult[0]?.count || 0,
    totalValue: valueResult[0]?.total || 0,
    typeStats,
    reasonStats,
  };
}
