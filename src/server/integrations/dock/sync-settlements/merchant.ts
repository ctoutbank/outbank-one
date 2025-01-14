"use server";

import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { Customer, Merchant } from "./types";
import { merchants } from "../../../../../drizzle/schema";

async function insertMerchant(merchant: Merchant) {
  try {
    const existing = await db
      .select()
      .from(merchants)
      .where(eq(merchants.slug, merchant.slug));

    if (existing.length > 0) {
      console.log(
        "merchants with this slug already exists. Skipping insert."
      );
      return; // Não realiza o insert
    }

    await db.insert(merchants).values(merchant);
  } catch (error) {
    console.error("Error inserting merchant:", error);
  }
}

export async function getOrCreateMerchant(merchant: Merchant) {
  try {
    const result = await db.select({ slug: merchants.slug })
         .from(merchants)
         .where(sql`${merchants.slug} = ${merchant.slug}`);
       if (result.length > 0) {
         return result[0].slug;
       } else {
         await insertMerchant(merchant);
         return merchant.slug;
       }
  } catch (error) {
    console.error("Error getting or creating merchant:", error);
  }
}
