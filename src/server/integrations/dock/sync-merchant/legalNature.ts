import { LegalNaturedock } from "./types";
import pool from "../../db";

async function insertLegalNature(legalNature: LegalNaturedock) {
  try {
    await pool.query(
      `INSERT INTO legal_natures (slug, active, dtinsert, dtupdate, name, code)
         VALUES ($1, $2, $3, $4, $5, $6)
         `,
      [
        legalNature.slug,
        legalNature.active,
        legalNature.dtInsert,
        legalNature.dtUpdate,
        legalNature.name,
        legalNature.code,
      ]
    );
  } catch (error) {
    console.error("Error inserting legal nature:", error);
  }
}

export async function getOrCreateLegalNature(legalNature: LegalNaturedock) {
  try {
    const result = await pool.query(
      `SELECT slug FROM legal_natures WHERE slug = $1`,
      [legalNature.slug]
    );

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertLegalNature(legalNature);
      return legalNature.slug;
    }
  } catch (error) {
    console.error("Error getting or creating legal nature:", error);
  }
}
