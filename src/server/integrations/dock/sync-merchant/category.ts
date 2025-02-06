"use server";

import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { category } from "./types";
import { categories } from "../../../../../drizzle/schema";




async function insertCategory(category: category) {
  try { 
    const existing = await db.select().from(categories).where(eq(categories.slug, category.slug));

    if (existing.length > 0) {
      console.log("Category with this slug already exists. Skipping insert.");
      return; // Não realiza o insert
    }

    const DtInsert = category.dtInsert ? new Date(category.dtInsert).toISOString() : null;
    const DtUpdate = category.dtUpdate ? new Date(category.dtUpdate).toISOString() : null;

    await db.insert(categories).values({
      slug: category.slug,
      active: category.active,
      dtinsert: DtInsert,
      dtupdate: DtUpdate,
      name: category.name,
      mcc: category.mcc,
      cnae: category.cnae,
    });
  } catch (error) {
    console.error("Error inserting category:", error);
  }
}

export async function getOrCreateCategory(category: category ) {
  try {
    const result = await db.select({ slug: categories.slug })
      .from(categories)
      .where(sql`${categories.slug} = ${category.slug}`);
    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertCategory(category);
      return category.slug;
    }
  } catch (error) {
    console.error("Error getting or creating category:", error);
  }
}
