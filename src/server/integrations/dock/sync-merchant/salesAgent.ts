"use server";


import { db } from "@/server/db";
import { saleAgent } from "./types";
import { sql } from "drizzle-orm";
import { salesAgents } from "../../../../../drizzle/schema";
import { eq } from "drizzle-orm";


async function insertSaleAgent(saleAgent: saleAgent) {
  try {

    const existing = await db.select().from(salesAgents).where(eq(salesAgents.slug, saleAgent.slug));

    if (existing.length > 0) {
      return ;
    }



    await db.insert (salesAgents).values({
      slug: saleAgent.slug,
      active: saleAgent.active,
      dtinsert: saleAgent.dtInsert ? new Date(saleAgent.dtInsert).toISOString() : null,
      dtupdate: saleAgent.dtUpdate ? new Date(saleAgent.dtUpdate).toISOString() : null,
      firstName: saleAgent.firstName,
      lastName: saleAgent.lastName,
      documentId: saleAgent.documentId ,
      email: saleAgent.email,
      slugCustomer: saleAgent.slugCustomer
    });
  } catch (error) {
    console.error("Error inserting sale agent:", error);
  }
}


export async function getOrCreateSaleAgent(saleAgent: saleAgent) {
  try {
    const result = await db.select({ slug: salesAgents.slug })
      .from(salesAgents)
      .where(sql`${salesAgents.slug} = ${saleAgent.slug}`);
    if (result.length > 0) {
      return result[0].slug;
    } else {
      await insertSaleAgent(saleAgent);
      return saleAgent.slug;
    }
  } catch (error) {
    console.error("Error getting or creating sale agent:", error);
  }
}
