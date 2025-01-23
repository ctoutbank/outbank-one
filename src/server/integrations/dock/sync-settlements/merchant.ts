"use server";

import { db } from "@/server/db";
import { merchants } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";
import { Merchant } from "./types";

async function insertMerchant(
  merchant: Merchant[]
): Promise<{ id: number; slug: string | null }[] | null> {
  try {
    const inserted = await db
      .insert(merchants)
      .values(merchant)
      .returning({ id: merchants.id, slug: merchants.slug });
    return inserted;
  } catch (error) {
    console.error("Error inserting merchant:", error);
    return null;
  }
}

export async function getOrCreateMerchants(merchants: Merchant[]) {
  try {
    const slugs = merchants.map((merchant) => merchant.slug);
    const merchantIds = await getIdBySlugs("merchants", slugs);

    const filteredList = merchants.filter(
      (merchant) =>
        !merchantIds?.some(
          (existingMerchant) => existingMerchant.slug === merchant.slug
        )
    );

    if (filteredList.length > 0) {
      const insertedIds = await insertMerchant(filteredList);
      const nonNullInsertedIds = insertedIds?.filter((id) => id.slug !== null).map((id) => ({ id: id.id, slug: id.slug as string })) ?? [];
      return merchantIds?.concat(nonNullInsertedIds ?? []) || nonNullInsertedIds;

    } else {
      return merchantIds;
    }
  } catch (error) {
    console.error("Error getting or creating merchants:", error);
  }
}
