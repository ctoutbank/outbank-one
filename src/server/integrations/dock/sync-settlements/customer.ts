"use server";

import { db } from "@/server/db";
import { eq, sql } from "drizzle-orm";
import { Customer } from "./types";
import { customers } from "../../../../../drizzle/schema";

async function insertCustomer(customer: Customer) {
  try {
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.slug, customer.slug));

    if (existing.length > 0) {
      console.log(
        "customers with this slug already exists. Skipping insert."
      );
      return; // Não realiza o insert
    }

    await db.insert(customers).values(customer);
  } catch (error) {
    console.error("Error inserting customer:", error);
  }
}

export async function getOrCreateCustomer(customer: Customer) {
  try {
    const result = await db.select({ slug: customers.slug })
         .from(customers)
         .where(sql`${customers.slug} = ${customer.slug}`);
       if (result.length > 0) {
         return result[0].slug;
       } else {
         await insertCustomer(customer);
         return customer.slug;
       }
  } catch (error) {
    console.error("Error getting or creating customer:", error);
  }
}
