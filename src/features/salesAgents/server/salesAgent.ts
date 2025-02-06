"use server";

import { db } from "../../../server/db";
import { salesAgents } from "../../../../drizzle/schema";

// Ensure the salesAgents schema includes the slug property

import { count, desc, eq, like, or, asc } from "drizzle-orm";

export type SalesAgentFull = {
  id: number;
  slug: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  active: boolean | null;
  dtinsert: Date | null;
  dtupdate: Date | null;
  documentId: string | null;
  slugCustomer: string | null;
};

export interface SalesAgentsList {
  salesAgents: SalesAgentFull[];
  totalCount: number;
}

export type SalesAgentesDetail = typeof salesAgents.$inferSelect;
export type SalesAgentesInsert = typeof salesAgents.$inferInsert;

export async function getSalesAgents(
  search: string,
  page: number,
  pageSize: number
): Promise<SalesAgentsList> {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select()
    .from(salesAgents)
    .where(
      or(
        like(salesAgents.firstName, `%${search}%`),
        like(salesAgents.lastName, `%${search}%`),
        like(salesAgents.email, `%${search}%`)
      )
    )
    .orderBy(desc(salesAgents.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(salesAgents);
  const totalCount = totalCountResult[0]?.count || 0;

  return {
    salesAgents: result.map((salesAgent) => ({
      id: salesAgent.id,
      slug: salesAgent.slug || "",
      firstName: salesAgent.firstName || "",
      lastName: salesAgent.lastName || "",
      email: salesAgent.email || "",
      active: salesAgent.active || null,
      dtinsert: salesAgent.dtinsert
        ? new Date(salesAgent.dtinsert)
        : new Date(),
      dtupdate: salesAgent.dtupdate
        ? new Date(salesAgent.dtupdate)
        : new Date(),
      documentId: salesAgent.documentId || "",
      slugCustomer: salesAgent.slugCustomer || "",
    })),
    totalCount,
  };
}

export async function insertSalesAgent(salesAgent: SalesAgentesInsert) {
  const result = await db.insert(salesAgents).values(salesAgent).returning({
    id: salesAgents.id,
  });

 return result[0].id;
  };


export async function getSalesAgentById(
  id: number
): Promise<SalesAgentesDetail | null> {
  const result = await db
    .select()
    .from(salesAgents)
    .where(eq(salesAgents.id, id))
    .limit(1);

  return result[0] || null;
}

export async function updateSalesAgent(
  salesAgent: SalesAgentesDetail
): Promise<void> {
  await db
    .update(salesAgents)
    .set({
      firstName: salesAgent.firstName,
      lastName: salesAgent.lastName,
      email: salesAgent.email,
      active: salesAgent.active,
      dtupdate: new Date().toISOString(),
      documentId: salesAgent.documentId,
      slugCustomer: salesAgent.slugCustomer,
    })
    .where(eq(salesAgents.id, salesAgent.id));
}
