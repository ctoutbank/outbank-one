"use server"


import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { addresses } from "../../../../drizzle/schema";


export type AddressSelect = typeof addresses.$inferSelect;

export async function getAddressByContactId(contactId: number) {
    const result = await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, contactId))
        .limit(1);

    return result[0] || null;
}

