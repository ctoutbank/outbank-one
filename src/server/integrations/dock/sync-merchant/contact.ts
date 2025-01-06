"use server";
import { Addressdock, contactsdock, Merchantdock } from "./types";
import { insertAddress } from "./address";
import { getIdBySlug } from "./getslug";
import pool from "../../db";

export async function insertContact(
  contact: contactsdock,
  merchant: Merchantdock,
  address: Addressdock | undefined
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
  contact: contactsdock,
  id_address: number | null,
  id_merchant: number,
  slug_merchant: string
) {
  try {
    console.log("insertingcontacts final", contact);
    const result = await pool.query(
      `
            INSERT INTO contacts (
               name, id_document, email, area_code, number, phone_type, id_address,
              birth_date, mothers_name, is_partner_contact, is_pep, id_merchant, slug_merchant
            )
            VALUES (
              $1, $2, $3, $4, $5, $6, $7,
              $8, $9, $10, $11, $12, $13
            )
            RETURNING id
        `,
      [
        contact.name,
        contact.documentId,
        contact.email,
        contact.areaCode,
        contact.number,
        contact.phoneType,
        id_address,
        contact.birthDate,
        contact.mothersName,
        contact.isPartnerContact,
        contact.isPep,
        id_merchant,
        slug_merchant,
      ]
    );

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
  contact: contactsdock,
  merchant: Merchantdock
) {
  try {
    const result = await pool.query(`SELECT id FROM contacts WHERE id = $1`, [
      contact.id,
    ]);

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
