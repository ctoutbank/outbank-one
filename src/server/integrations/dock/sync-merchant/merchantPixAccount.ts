
import pool from "./db";
import { getIdBySlug } from "./getslug";
import { merchantPixAccountdock } from "./types";
import { Merchantdock } from "./types";

export async function insertmerchantPixAccount(
  merchantPixAccount: merchantPixAccountdock,
  merchant: Merchantdock
) {
  try {
    const id_merchant = await getIdBySlug("merchants", merchant.slug);

    const merchantSlug = merchant.slug;

    console.log(merchantSlug);

    await pool.query(
      `INSERT INTO merchantpixaccount (slug, active, dtinsert, dtupdate, id_registration, id_account, bank_number, bank_branch_number, bank_branch_digit, bank_account_number, bank_account_digit, bank_account_type,bank_account_status	,onboarding_pix_status,message,bank_name,id_merchant,slug_merchant)			
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12,$13,$14,$15,$16 ,$17,$18)
        
         
            `,
      [
        merchantPixAccount.slug,
        merchantPixAccount.active,
        merchantPixAccount.dtInsert,
        merchantPixAccount.dtUpdate,
        merchantPixAccount.idRegistration,
        merchantPixAccount.idAccount,
        merchantPixAccount.bankNumber,
        merchantPixAccount.bankBranchNumber,
        merchantPixAccount.bankBranchDigit,
        merchantPixAccount.bankAccountNumber,
        merchantPixAccount.bankAccountDigit,
        merchantPixAccount.bankAccountType,
        merchantPixAccount.bankAccountStatus,
        merchantPixAccount.onboardingPixStatus,
        merchantPixAccount.message,
        merchantPixAccount.bankName,
        id_merchant,
        merchantSlug,
      ]
    );
    const slug = merchantPixAccount.slug;
    console.log("Merchant pix account inserted successfully.");
    return slug;
  } catch (error) {
    console.error("Error inserting merchant pix account:", error);
  }
}

export async function getOrCreateMerchantPixAccount(
  merchantPixAccount: merchantPixAccountdock,
  merchant: Merchantdock
) {
  try {
    const result = await pool.query(
      `SELECT slug FROM merchantpixaccount WHERE slug = $1`,
      [merchantPixAccount.slug]
    );

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertmerchantPixAccount(merchantPixAccount, merchant);
      return merchantPixAccount.slug;
    }
  } catch (error) {
    console.error("Error getting or creating merchant pix account:", error);
  }
}
