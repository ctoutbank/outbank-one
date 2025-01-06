"use server";

import { db } from "@/server/db";
import { categorydock } from "./types";
import { eq } from 'drizzle-orm';
import { categories } from "../../../../../drizzle/schema";



export type newCategory = {
  slug: string;
  active: boolean;
  dtInsert: Date;
  dtUpdate: Date;
  name?: string;
  mcc?: string;
  cnae?: string;
  anticipationRiskFactorCp?: number;
  anticipationRiskFactorCnp?: number;
  waitingPeriodCp?: number;
  waitingPeriodCnp?: number;
  slugMerchant?: string;
};

async function insertCategory(category: categorydock) {
  try {
    await db.insert(categories).values({
      slug: category.slug,
      active: category.active,
      dtinsert: category.dtInsert ? category.dtInsert.toISOString() : null,
      dtupdate: category.dtUpdate ? category.dtUpdate.toISOString() : null,
      name: category.name || "",
      mcc: category.mcc || null,
      cnae: category.cnae || null,
      anticipationRiskFactorCp: category.anticipationRiskFactorCp || null,
      anticipationRiskFactorCnp: category.anticipationRiskFactorCnp || null,
      waitingPeriodCp: category.waitingPeriodCp || null,
      waitingPeriodCnp: category.waitingPeriodCnp || null
    });
  } catch (error) {
    throw new Error(`Erro ao inserir categoria: ${error}`);
  }
}

export async function getOrCreateCategory(category: categorydock) {
  try {
    const result = await db.select()
      .from(categories)
      .where(eq(categories.slug, category.slug));

    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertCategory(category);
      return category.slug;
    }
  } catch (error) {
    console.error("Error getting or creating category:", error);
    throw error;
  }
}
