"use server";

import { db } from "@/server/db";
import { LegalNature } from "./types";
import { sql } from "drizzle-orm";


async function insertLegalNature(legalNature: LegalNature) {
  try {
    await db.execute(sql.raw(
      `INSERT INTO legal_natures (slug, active, dtinsert, dtupdate, name, code)
         VALUES (${legalNature.slug}, ${legalNature.active}, ${legalNature.dtInsert}, ${legalNature.dtUpdate}, ${legalNature.name}, ${legalNature.code})
         `
    ));
  } catch (error) {
    console.error("Error inserting legal nature:", error);
  }
}

export async function getOrCreateLegalNature(legalNature: LegalNature) {
  try {
    const result = await db.execute(sql.raw(
      `SELECT slug FROM legal_natures WHERE slug = ${legalNature.slug}`
    ));

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertLegalNature(legalNature);
      return legalNature.slug;
    }
  } catch (error) {
    console.error("Error getting or creating legal nature:", error);
  }
}
