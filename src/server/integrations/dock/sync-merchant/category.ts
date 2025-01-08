"use server";

import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import { category } from "./types";


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

async function insertCategory(category: category) {
  try {
    await db.execute(sql.raw(
      `INSERT INTO categories (slug, active, dtinsert, dtupdate, name, mcc, cnae, anticipation_risk_factor_cp	, anticipation_risk_factor_cnp, waiting_period_cp, waiting_period_cnp)
             VALUES (${category.slug}, ${category.active}, ${category.dtInsert}, ${category.dtUpdate}, ${category.name}, ${category.mcc}, ${category.cnae}, ${category.anticipationRiskFactorCp}, ${category.anticipationRiskFactorCnp}, ${category.waitingPeriodCp}, ${category.waitingPeriodCnp})
             `,
     
    ));
  } catch (error) {
    console.error("Error inserting category:", error);
  }
}

export async function getOrCreateCategory(category: category ) {
  try {
    const result = await db.execute(sql.raw(
      `SELECT slug FROM categories WHERE slug = ${category.slug}`,
    ));

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertCategory(category);
      return category.slug;
    }
  } catch (error) {
    console.error("Error getting or creating category:", error);
  }
}
