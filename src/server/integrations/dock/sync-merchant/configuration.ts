"use server";

import { db } from "@/server/db";

import { eq, sql } from "drizzle-orm";
import { configuration } from "./types";
import { configurations } from "../../../../../drizzle/schema";


async function insertConfiguration(configuration: configuration) {
  try {

    const existing = await db.select().from(configurations).where(eq(configurations.slug, configuration.slug));

    if (existing.length > 0) {
      console.log("Configuration with this slug already exists. Skipping insert.");
      return; // Não realiza o insert
    }

    const DtInsert = configuration.dtInsert ? new Date(configuration.dtInsert).toISOString() : null;
    const DtUpdate = configuration.dtUpdate ? new Date(configuration.dtUpdate).toISOString() : null;

    await db.insert(configurations).values({
      slug: configuration.slug,
      active: configuration.active,
      dtinsert: DtInsert,
      dtupdate: DtUpdate,
      lockCpAnticipationOrder: configuration.lockCpAnticipationOrder,
      lockCnpAnticipationOrder: configuration.lockCnpAnticipationOrder,
      url: configuration.url,
    });
  } catch (error) {
    console.error("Error inserting configuration:", error);
  }
}

export async function getOrCreateConfiguration(configuration: configuration) {
  try {
    const result = await db.select({ slug: configurations.slug })
      .from(configurations)
      .where(sql`${configurations.slug} = ${configuration.slug}`);
    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertConfiguration(configuration);
      return configuration.slug;
    }
  } catch (error) {
    console.error("Error getting or creating configuration:", error);
  }
}
