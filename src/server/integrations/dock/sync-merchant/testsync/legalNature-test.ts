"use server";

import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import { legalNatures } from "../../../../../../drizzle/schema";
import { LegalNature } from "../types";
import { eq } from "drizzle-orm";


async function insertLegalNaturee(legalNature: LegalNature) {
  try {
    const existing = await db.select().from(legalNatures).where(eq(legalNatures.slug, legalNature.slug));

    if (existing.length > 0) {
      console.log("LegalNature with this slug already exists. Skipping insert.");
      return; // Não realiza o insert
    }


    await db.insert(legalNatures).values(legalNature);
  } catch (error) {
    console.error("Error inserting legal nature:", error);
          }
}

export async function getOrCreateLegalNature(legalNature: LegalNature) {
  try {
    const result = await db.select({ slug: legalNatures.slug })
      .from(legalNatures)
      .where(sql`${legalNatures.slug} = ${legalNature.slug}`);
    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertLegalNaturee(legalNature);
      return legalNature.slug;
    }
  } catch (error) {
    console.error("Error getting or creating legal nature:", error);
  }
}
