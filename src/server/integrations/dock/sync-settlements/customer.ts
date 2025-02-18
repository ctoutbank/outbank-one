"use server";

import { db } from "@/server/db";
import { Customer } from "./types";
import { customers } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";

async function insertCustomer(
  customer: Customer[]
): Promise<{ id: number; slug: string | null }[] | null> {
  try {
    const inserted = await db
      .insert(customers)
      .values(customer)
      .returning({ id: customers.id, slug: customers.slug });
    return inserted;
  } catch (error) {
    console.error("Error inserting customer:", error);
    return null;
  }
}

export async function getOrCreateCustomer(customer: Customer[]) {
  try {
    const slugs = customer.map((customer) => customer.slug);

    const customerIds = await getIdBySlugs("customers", slugs);
    const filteredList = customer.filter(
      (customer) =>
        !customerIds?.some(
          (existingCustomer) => existingCustomer.slug === customer.slug
        )
    );
    if (filteredList.length > 0) {
      const insertedIds = await insertCustomer(filteredList);
      const nonNullInsertedIds =
        insertedIds
          ?.filter((id) => id.slug !== null)
          .map((id) => ({ id: id.id, slug: id.slug as string })) ?? [];
      return (
        customerIds?.concat(nonNullInsertedIds ?? []) || nonNullInsertedIds
      );
    } else {
      return customerIds;
    }
  } catch (error) {
    console.error("Error getting or creating customer:", error);
  }
}
