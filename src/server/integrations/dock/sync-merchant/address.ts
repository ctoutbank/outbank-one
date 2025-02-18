"use server";
import { db } from "@/server/db";
import { Address } from "./types";
import { addresses } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";



export async function getAddressId(address: Address): Promise<number | null> {
  try {
    const existing = await db.select().from(addresses).where(eq(addresses.streetAddress, addresses.zipCode));

    if (existing.length > 0) {
      return existing[0].id as number;
    }else {
      const insertedId = await insertAddress(address);
      return insertedId;
    }
  } catch (error) {
    console.error("Erro ao verificar existência do endereço:", error);
    return null;
  }
}





export async function insertAddress(address: Address): Promise<number | null> {
  try {
    const result = await db.insert(addresses).values(address).returning({ id: addresses.id });
    const id = result[0].id as number;
    console.log("Endereço inserido com sucesso:", id);
    return id;
    
    
    
  } catch (error) {
    console.error("Erro ao inserir endereço:", error);
    return null;
  }
}
