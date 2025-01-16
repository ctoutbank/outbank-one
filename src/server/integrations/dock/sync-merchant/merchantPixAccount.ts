"use server";

import { db } from "@/server/db";
import { getIdBySlug } from "./getslug";
import { merchantPixAccounts } from "./types";
import { Merchant } from "./types";
import { merchantpixaccount } from "../../../../../drizzle/schema";
import { sql } from "drizzle-orm";

export async function insertmerchantPixAccount(
  merchantPixAccount: merchantPixAccounts,
  merchant: Merchant
) {
  try {
    const id_merchant = await getIdBySlug("merchants", merchant.slug);

    const merchantSlug = merchant.slug;

    console.log(merchantSlug);

    const result = await db.insert(merchantpixaccount).values({
      slug: merchantPixAccount.slug,
      active: merchantPixAccount.active,
      dtinsert: merchantPixAccount.dtInsert ? new Date(merchantPixAccount.dtInsert).toISOString() : null,
      dtupdate: merchantPixAccount.dtUpdate ? new Date(merchantPixAccount.dtUpdate).toISOString() : null,
      idRegistration: merchantPixAccount.idRegistration,
      idAccount: merchantPixAccount.idAccount,
      bankNumber: merchantPixAccount.bankNumber,
      bankBranchNumber: merchantPixAccount.bankBranchNumber,
      bankBranchDigit: merchantPixAccount.bankBranchDigit,
      bankAccountNumber: merchantPixAccount.bankAccountNumber,
      bankAccountDigit: merchantPixAccount.bankAccountDigit,
      bankAccountType: merchantPixAccount.bankAccountType,
      bankAccountStatus: merchantPixAccount.bankAccountStatus,
      onboardingPixStatus: merchantPixAccount.onboardingPixStatus,
      message: merchantPixAccount.message,
      bankName: merchantPixAccount.bankName,
      idMerchant: id_merchant,
      slugMerchant: merchantSlug
    }).returning({ slug: merchantpixaccount.slug });
    
    if (result.length === 0) {
      throw new Error(
        "Insert failed: No slug returned for the inserted contact."
      );
    }

    const slug = result[0].slug as string;
    console.log("Merchant pix account inserted successfully.");
    return slug;
  } catch (error) {
    console.error("Error inserting merchant pix account:", error);
  }
}

export async function getOrCreateMerchantPixAccount(
  merchantPixAccount: merchantPixAccounts,
  merchant: Merchant
) {
  try {
    const result = await db.select({ slug: merchantpixaccount.slug })
      .from(merchantpixaccount)
      .where(sql`${merchantpixaccount.slug} = ${merchantPixAccount.slug}`);

    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertmerchantPixAccount(merchantPixAccount, merchant);
      return merchantPixAccount.slug;
    }
  } catch (error) {
    console.error("Error getting or creating merchant pix account:", error);
  }
}

 
