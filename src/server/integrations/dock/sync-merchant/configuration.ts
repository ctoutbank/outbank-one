import pool from "../../db";
import { configurationsdock } from "./types";

export async function getOrCreateCofiguration(configuration: configurationsdock) {
  try {
    const result = await pool.query(
      `SELECT slug FROM configurations WHERE slug = $1`,
      [configuration.slug]
    );

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertConfiguration(configuration);
      return configuration.slug;
    }
  } catch (error) {
    console.error("Error getting or creating configuration:", error);
  }
}

async function insertConfiguration(configuration: configurationsdock) {
  try {
    await pool.query(
      `INSERT INTO configurations (slug, active, dtinsert,dtUpdate ,lock_cp_anticipation_order,lock_cnp_anticipation_order, url)
         VALUES ($1, $2, $3, $4, $5, $6 , $7)
         `,
      [
        configuration.slug,
        configuration.active,
        configuration.dtInsert,
        configuration.dtUpdate,
        configuration.lockCpAnticipationOrder,
        configuration.lockCnpAnticipationOrder,
        configuration.url,
      ]
    );
    const slug = configuration.slug;

    return slug;
  } catch (error) {
    console.error("Error inserting configuration:", error);
  }
}
