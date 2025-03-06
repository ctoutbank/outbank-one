"use server"


import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { addresses, merchants } from "../../../../drizzle/schema";


export type AddressSelect = typeof addresses.$inferSelect;

export async function getAddressByContactId(contactId: number) {
    const result = await db
        .select()
        .from(addresses)
        .where(eq(addresses.id, contactId))
        .limit(1);

    return result[0] || null;
}


export async function getMerchantAddressId(merchantId: number) {
    try {
        // Primeiro, busca o merchant para obter o addressId
        const merchant = await db
            .select()
            .from(merchants)
            .where(eq(merchants.id, merchantId))
            .limit(1);
        
        if (!merchant[0] || !merchant[0].idAddress) {
            console.log("Merchant não encontrado ou sem endereço associado");
            return null;
        }
        
        const addressId = merchant[0].idAddress;
        console.log(`Merchant encontrado com addressId: ${addressId}`);
        
        // Agora, busca o endereço usando o addressId
        const address = await db
            .select()
            .from(addresses)
            .where(eq(addresses.id, addressId))
            .limit(1);
        
        console.log("Endereço do merchant encontrado:", address[0]);
        return address[0] || null;
    } catch (error) {
        console.error("Erro ao buscar endereço do merchant:", error);
        return null;
    }
}
