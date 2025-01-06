"use server";

import pool from "../../db";
import { saleAgentdock } from "./types";


async function insertSaleAgent(saleAgent: saleAgentdock) {
  try {
    await pool.query(
      `INSERT INTO sales_agents (slug, active, dtinsert, dtupdate, first_name, last_name, document_id, email, slug_customer)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
      [
        saleAgent.slug,
        saleAgent.active,
        saleAgent.dtInsert,
        saleAgent.dtUpdate,
        saleAgent.firstName,
        saleAgent.lastName,
        saleAgent.documentId,
        saleAgent.email,
        saleAgent.slugCustomer,
      ]
    );
    const slug = saleAgent.slug;
    console.log("Sale agent inserted successfully.");
    return slug;
  } catch (error) {
    console.error("Error inserting sale agent:", error);
  }
}

export async function getOrCreateSaleAgent(saleAgent: saleAgentdock) {
  try {
    const result = await pool.query(
      `SELECT slug FROM sales_agents WHERE slug = $1`,
      [saleAgent.slug]
    );

    if (result.rows.length > 0) {
      return result.rows[0].slug;
    } else {
      await insertSaleAgent(saleAgent);
      return saleAgent.slug;
    }
  } catch (error) {
    console.error("Error getting or creating sale agent:", error);
  }
}
