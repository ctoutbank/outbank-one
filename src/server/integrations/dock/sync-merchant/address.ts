"use server";
import { db } from "@/server/db";
import { Address } from "./types";
import { sql } from "drizzle-orm";



export async function getAddressId(address: Address): Promise<number | null> {
  try {
    const result = await db.execute(sql.raw(
      `SELECT id FROM addresses WHERE 
         street_address = $1 AND 
         zip_code = ${address.zipCode} 
         `,
    ))
    if (result.rows.length > 0) {
      return result.rows[0].id as number;
    } else {
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
    const result = await db.execute(sql.raw(
      `
        INSERT INTO addresses (
          street_address, street_number, complement, neighborhood,
          city, state, country, zip_code
        )
        VALUES (${address.streetAddress}, ${address.streetNumber}, ${address.complement}, ${address.neighborhood}, ${address.city}, ${address.state}, ${address.country}, ${address.zipCode})
        RETURNING id
        `,
    ));
    ;

    const id = result.rows[0].id as number;
    console.log("Endereço inserido com sucesso:", id);
    return id;
  } catch (error) {
    console.error("Erro ao inserir endereço:", error);
    return null;
  }
}
