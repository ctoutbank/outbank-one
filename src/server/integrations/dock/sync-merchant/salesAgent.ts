"use server";


import { db } from "@/server/db";
import { saleAgent } from "./types";
import { sql } from "drizzle-orm";


async function insertSaleAgent(saleAgent: saleAgent) {
  try {
    await db.execute(sql.raw(
      `INSERT INTO sales_agents (slug, active, dtinsert, dtupdate, first_name, last_name, document_id, email, slug_customer)
         VALUES (${saleAgent.slug}, ${saleAgent.active}, ${saleAgent.dtInsert}, ${saleAgent.dtUpdate}, ${saleAgent.firstName}, ${saleAgent.lastName}, ${saleAgent.documentId}, ${saleAgent.email}, ${saleAgent.slugCustomer}    )
        `,
     
    ));
    const slug = saleAgent.slug;
    console.log("Sale agent inserted successfully.");
    return slug;
  } catch (error) {
    console.error("Error inserting sale agent:", error);
  }
}

export async function getOrCreateSaleAgent(saleAgent: saleAgent) {
  try {
    const result = await db.execute(sql.raw(
      `SELECT slug FROM sales_agents WHERE slug = ${saleAgent.slug}
      `
    ));

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
