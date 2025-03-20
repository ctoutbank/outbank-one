"use server";

import { db } from "@/server/db";
import { addresses } from "../../../../drizzle/schema";
import { and, eq } from "drizzle-orm";

export type AddressInsert = typeof addresses.$inferInsert;
export type AddressDetail = typeof addresses.$inferSelect;

export async function insertAddress(address: AddressInsert): Promise<number> {
  // Verifica se o endereço já existe
  const existingAddress = await db
    .select({ id: addresses.id })
    .from(addresses)
    .where(
      and(
        eq(addresses.streetAddress, address.streetAddress ?? ''),
        eq(addresses.streetNumber, address.streetNumber ?? ''),
        eq(addresses.neighborhood, address.neighborhood ?? ''),
        eq(addresses.city, address.city ?? ''),
        eq(addresses.state, address.state ?? ''),
        eq(addresses.zipCode, address.zipCode ?? '')
      )
    )
    .limit(1);

  // Se encontrar um endereço existente, retorna o ID dele
  if (existingAddress.length > 0) {
    return existingAddress[0].id;
  }

  // Se não encontrar, insere novo endereço
  const result = await db
    .insert(addresses)
    .values(address)
    .returning({ id: addresses.id });
    
  return result[0].id;
}

export async function updateAddress(address: AddressDetail): Promise<void> {
  // Criando uma cópia do objeto sem o id para evitar o erro "column id can only be updated to DEFAULT"
  const { id, ...addressToUpdate } = address;
  
  console.log("Atualizando endereço ID:", id);
  console.log("Dados para atualização:", addressToUpdate);
  
  await db
    .update(addresses)
    .set(addressToUpdate)
    .where(eq(addresses.id, id));
    
  console.log("Endereço atualizado com sucesso");
}

export async function getAddressById(addressId: number): Promise<AddressDetail | null> {
  const result = await db
    .select()
    .from(addresses)
    .where(eq(addresses.id, addressId))
    .limit(1);

  return result[0] || null;
} 