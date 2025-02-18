"use server"
import { db } from "@/server/db";
import { merchantpixaccount } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";

export type MerchantPixAccountInsert = typeof merchantpixaccount.$inferInsert;
export type MerchantPixAccountUpdate = typeof merchantpixaccount.$inferSelect; 



export async function insertMerchantPixAccount(merchantPixAccount: MerchantPixAccountInsert) {
    const result = await db.insert(merchantpixaccount).values(merchantPixAccount).returning({
        id: merchantpixaccount.id,
    });
    return result[0].id;
}


export async function updateMerchantPixAccount(merchantPixAccount: MerchantPixAccountUpdate) {
    const { id, ...merchantPixAccountWithoutId } = merchantPixAccount;
    await db.update(merchantpixaccount).set(merchantPixAccountWithoutId).where(eq(merchantpixaccount.id, id));
}



export async function getMerchantPixAccountByMerchantId(merchantId: number) {
    const result = await db.select().from(merchantpixaccount).where(eq(merchantpixaccount.idMerchant, merchantId));
    return result[0] || null;
}




