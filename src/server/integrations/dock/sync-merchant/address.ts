import pool from "../../db";
import { Addressdock } from "./types";

export async function getAddressId(address: Addressdock): Promise<number | null> {
  try {
    const result = await pool.query(
      `SELECT id FROM addresses WHERE 
         street_address = $1 AND 
         zip_code = $2 
         `,
      [address.streetAddress, address.zipCode]
    );

    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      await insertAddress(address);
      return address.id;
    }
  } catch (error) {
    console.error("Erro ao verificar existência do endereço:", error);
    return null;
  }
}

export async function insertAddress(address: Addressdock): Promise<number | null> {
  try {
    const result = await pool.query(
      `
        INSERT INTO addresses (
          street_address, street_number, complement, neighborhood,
          city, state, country, zip_code
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id
        `,
      [
        address.streetAddress,
        address.streetNumber,
        address.complement,
        address.neighborhood,
        address.city,
        address.state,
        address.country,
        address.zipCode,
      ]
    );

    const id = result.rows[0].id;
    console.log("Endereço inserido com sucesso:", id);
    return id;
  } catch (error) {
    console.error("Erro ao inserir endereço:", error);
    return null;
  }
}
