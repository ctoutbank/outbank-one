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
    await db.update(merchantpixaccount).set(merchantPixAccount).where(eq(merchantpixaccount.id, merchantPixAccount.id));
}


export async function deleteMerchantPixAccount(id: number) {
    await db.delete(merchantpixaccount).where(eq(merchantpixaccount.id, id));
}


