"use server";

import { db } from "@/server/db";
import { addresses, contacts } from "../../../../drizzle/schema";
import { eq, getTableColumns } from "drizzle-orm";

export type ContactInsert = typeof contacts.$inferInsert;
export type ContactUpdate = typeof contacts.$inferSelect;

export async function insertContact(contact: ContactInsert) {
  const result = await db.insert(contacts).values(contact).returning({
    id: contacts.id,
  });

  return result[0].id;
}

export async function updateContact(contact: ContactUpdate) {
  const { id, ...contactWithoutId } = contact;
  await db.update(contacts).set(contactWithoutId).where(eq(contacts.id, id));
}

export async function deleteContact(id: number) {
  await db.delete(contacts).where(eq(contacts.id, id));
}

export async function getContactByMerchantId(id: number) {
  const result = await db
    .select({
      contacts: { ...getTableColumns(contacts) },
      addresses: { ...getTableColumns(addresses) },
    })
    .from(contacts)
    .where(eq(contacts.idMerchant, id))
    .leftJoin(addresses, eq(contacts.idAddress, addresses.id));

  return result;
}

export async function getContactByMerchantId2(id: number): Promise<
  Array<{
    contacts: typeof contacts.$inferSelect;
    addresses: typeof addresses.$inferSelect;
  }>
> {
  const result = await db
    .select({
      contacts: { ...getTableColumns(contacts) },
      addresses: { ...getTableColumns(addresses) },
    })
    .from(contacts)
    .where(eq(contacts.idMerchant, id))
    .leftJoin(addresses, eq(contacts.idAddress, addresses.id))
    .execute();
  return result.map((row) => ({
    contacts: row.contacts,
    addresses: row.addresses ?? {
      id: 0,
      streetAddress: null,
      streetNumber: null,
      complement: null,
      neighborhood: null,
      city: null,
      state: null,
      country: null,
      zipCode: null,
    },
  }));
}



