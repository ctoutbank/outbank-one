"use server";
import { db } from "@/server/db";
import { configurations } from "./types";
import { sql } from "drizzle-orm";

export async function getOrCreateCofiguration(configuration: configurations) {
  try {
    const result = await db.execute(sql.raw(
      `SELECT slug FROM configurations WHERE slug = ${configuration.slug}
      `
    ));

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertConfiguration(configuration);
      return configuration.slug;
    }
  } catch (error) {
    console.error("Error getting or creating configuration:", error);
  }
}

async function insertConfiguration(configuration: configurations) {
  try {
    await db.execute(sql.raw(
      `INSERT INTO configurations (slug, active, dtinsert,dtUpdate ,lock_cp_anticipation_order,lock_cnp_anticipation_order, url)
         VALUES (${configuration.slug}, ${configuration.active}, ${configuration.dtInsert}, ${configuration.dtUpdate}, ${configuration.lockCpAnticipationOrder}, ${configuration.lockCnpAnticipationOrder}, ${configuration.url})
         `,
    ));
    const slug = configuration.slug;

    return slug;
  } catch (error) {
    console.error("Error inserting configuration:", error);
  }
}
