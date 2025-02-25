"use server";

import { db } from "../../../server/db";
import { legalNatures } from "../../../../drizzle/schema";
import { eq, count, desc, ilike, or, and } from "drizzle-orm";

export type LegalNatureList = {
  legalNatures: typeof legalNatures.$inferSelect[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
};

export type LegalNatureDetail = typeof legalNatures.$inferSelect;
export type LegalNatureInsert = typeof legalNatures.$inferInsert;

export async function getLegalNatures(
  search: string,
  page: number,
  pageSize: number,
  name?: string,
  code?: string,
  active?: string,
  sortField: keyof typeof legalNatures.$inferSelect = 'id',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<LegalNatureList> {
  const offset = (page - 1) * pageSize;

  const whereConditions = [];

  if (search) {
    whereConditions.push(
      or(
        ilike(legalNatures.name, `%${search}%`),
        ilike(legalNatures.code, `%${search}%`)
      )
    );
  }

  if (name) {
    whereConditions.push(ilike(legalNatures.name, `%${name}%`));
  }

  if (code) {
    whereConditions.push(ilike(legalNatures.code, `%${code}%`));
  }

  if (active) {
    whereConditions.push(eq(legalNatures.active, active === 'true'));
  }

  const result = await db
    .select({
      id: legalNatures.id,
      slug: legalNatures.slug,
      name: legalNatures.name,
      active: legalNatures.active,
      dtinsert: legalNatures.dtinsert,
      dtupdate: legalNatures.dtupdate,
      code: legalNatures.code,
    })
    .from(legalNatures)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(sortOrder === 'desc' ? desc(legalNatures[sortField]) : legalNatures[sortField])
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(legalNatures)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    legalNatures: result.map((legalNature) => ({
      id: legalNature.id,
      slug: legalNature.slug || "",
      name: legalNature.name || "",
      active: legalNature.active || false,
      dtinsert: legalNature.dtinsert ? new Date(legalNature.dtinsert).toISOString() : null,
      dtupdate: legalNature.dtupdate ? new Date(legalNature.dtupdate).toISOString() : null,
      code: legalNature.code || "",
    })),
    totalCount,
    activeCount: result.filter(ln => ln.active).length,
    inactiveCount: result.filter(ln => !ln.active).length
  };
}

export async function getLegalNatureById(
  id: number
): Promise<LegalNatureDetail | null> {
  const result = await db
    .select()
    .from(legalNatures)
    .where(eq(legalNatures.id, id))
    .limit(1);

  return result[0] || null;
}

export async function insertLegalNature(legalNature: LegalNatureInsert) {
  const result = await db.insert(legalNatures).values(legalNature).returning({
    id: legalNatures.id,
  });

  return result[0].id;
}

export async function updateLegalNature(
  legalNature: LegalNatureDetail
): Promise<void> {
  await db
    .update(legalNatures)
    .set({
      name: legalNature.name,
      code: legalNature.code,
      dtupdate: new Date().toISOString(),
      active: legalNature.active,
    })
    .where(eq(legalNatures.id, legalNature.id));
}

export async function deleteLegalNature(id: number): Promise<void> {
  await db.delete(legalNatures).where(eq(legalNatures.id, id));
}
