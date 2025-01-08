"use server";
import { Address, contacts, Merchant } from "./types";
import { insertAddress } from "./address";
import { getIdBySlug } from "./getslug";
import { db } from "@/server/db";
import { sql } from "drizzle-orm";


export async function insertContact(
  contact: contacts,
  merchant: Merchant,
  address: Address | undefined
) {
  let id_address = null;
  try {
    if (address) {
      id_address = await insertAddress(address);
    }

    const slug_merchant = merchant.slug;
    if (slug_merchant === null) {
      throw new Error("Slug Merchant is null");
    }

    const id_merchant = await getIdBySlug("merchants", merchant.slug);
    if (id_merchant === null) {
      throw new Error("Merchant ID is null");
    }

    await insertContactRelations(
      contact,
      id_address,
      id_merchant,
      slug_merchant
    );
  } catch (error) {
    console.error("Error inserting contact:", error);
  }
}
async function insertContactRelations(
  contact: contacts,
  id_address: number | null,
  id_merchant: number,
  slug_merchant: string
) {
  try {
    console.log("insertingcontacts final", contact);
    const result = await db.execute(sql.raw(
      `
            INSERT INTO contacts (
               name, id_document, email, area_code, number, phone_type, id_address,
              birth_date, mothers_name, is_partner_contact, is_pep, id_merchant, slug_merchant
            )
            VALUES (
              ${contact.name}, ${contact.documentId}, ${contact.email}, ${contact.areaCode}, ${contact.number}, ${contact.phoneType}, ${id_address},
              ${contact.birthDate}, ${contact.mothersName}, ${contact.isPartnerContact}, ${contact.isPep}, ${id_merchant}, ${slug_merchant}
            )
            RETURNING id
        `,
    ));

    if (result.rows.length === 0) {
      throw new Error(
        "Insert failed: No ID returned for the inserted contact."
      );
    }
    const id = result.rows[0].id;
    console.log("Contacts inserted successfully. ID:", id);
    return id;
  } catch (error) {
      console.error("Error inserting contacts:", error);
    throw error;
  }
}
    

export async function getOrCreateContact(
  contact: contacts,
  merchant: Merchant
) {
  try {
    const result = await db.execute(sql.raw(
      `SELECT id FROM contacts WHERE id = ${contact.id}
      `
    ));

    if (result.rows.length > 0) {
      return result.rows[0].id;
    } else {
      await insertContact(contact, merchant, contact.address);
      return contact.id;
    }
  } catch (error) {
    console.error("Error getting or creating contact:", error);
  }
}
