"use server";

import { db } from "../../../server/db";
import { configurations } from "../../../../drizzle/schema";
import { eq, count, desc, ilike, or } from "drizzle-orm";

export interface ConfigurationList {
  configurations: {
    id: number;
    slug: string | null;
    active: boolean | null;
    lockCpAnticipationOrder: boolean | null;
    lockCnpAnticipationOrder: boolean | null;
    url: string | null;
    dtinsert: Date | null;
    dtupdate: Date | null;
  }[];
  totalCount: number;
}

export type ConfigurationDetail = typeof configurations.$inferSelect;
export type ConfigurationInsert = typeof configurations.$inferInsert;

export async function getConfigurations(
  search: string,
  page: number,
  pageSize: number
): Promise<ConfigurationList> {
  const offset = (page - 1) * pageSize;

  const result = await db
    .select()
    .from(configurations)
    .where(
      or(
        ilike(configurations.slug, `%${search}%`),
        ilike(configurations.url, `%${search}%`)
      )
    )
    .orderBy(desc(configurations.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(configurations);
  const totalCount = totalCountResult[0]?.count || 0;

  return {
    configurations: result.map((configuration) => ({
      id: configuration.id,
      slug: configuration.slug || "",
      active: configuration.active || false,
      lockCpAnticipationOrder: configuration.lockCpAnticipationOrder || false,
      lockCnpAnticipationOrder: configuration.lockCnpAnticipationOrder || false,
      url: configuration.url || "",
      dtinsert: configuration.dtinsert
        ? new Date(configuration.dtinsert)
        : new Date(),
      dtupdate: configuration.dtupdate
        ? new Date(configuration.dtupdate)
        : new Date(),
    })),
    totalCount,
  };
}

export async function getConfigurationById(
  id: number
): Promise<ConfigurationDetail | null> {
  const result = await db
    .select()
    .from(configurations)
    .where(eq(configurations.id, id))
    .limit(1);

  return result[0] || null;
}

export async function insertConfiguration(configuration: ConfigurationInsert) {
  const result = await db
    .insert(configurations)
    .values(configuration)
    .returning({
      id: configurations.id,
    });

  return result[0].id;
}

export async function updateConfiguration(
  configuration: ConfigurationDetail
): Promise<void> {
  await db
    .update(configurations)
    .set({
      slug: configuration.slug,
      active: configuration.active,
      lockCpAnticipationOrder: configuration.lockCpAnticipationOrder,
      lockCnpAnticipationOrder: configuration.lockCnpAnticipationOrder,
      url: configuration.url,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(configurations.id, configuration.id));
}

export async function deleteConfiguration(id: number): Promise<void> {
  await db.delete(configurations).where(eq(configurations.id, id));
}
