"use server";
import { Address, contact, Merchant } from "./types";
import { insertAddress } from "./address";
import { getIdBySlug } from "./getslug";
import { db } from "@/server/db";
import { contacts } from "../../../../../drizzle/schema";





export async function insertContact(
  contact: contact,
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
  contact: contact,
  id_address: number | null,
  id_merchant: number,
  slug_merchant: string
) {
  try {
   
    const result = await db.insert(contacts).values({
      name: contact.name || "",
      idDocument: contact.documentId || "",
      email: contact.email || "",
      areaCode: contact.areaCode || "", 
      number: contact.number || "",
      phoneType: contact.phoneType || "",
      idAddress: id_address || null,
      birthDate: contact.birthDate ? new Date(contact.birthDate).toISOString() : null,
      mothersName: contact.mothersName || "",
      isPartnerContact: contact.isPartnerContact,
      isPep: contact.isPep,
      idMerchant: id_merchant,
      slugMerchant: slug_merchant
    }
      
    ).returning({ id: contacts.id });

    if (result.length === 0) {
      throw new Error(
        "Insert failed: No ID returned for the inserted contact."
      );
    }
    
    const id = result[0].id as number;
    console.log("Contacts inserted successfully. ID:", id);
    return id;

    
    
  } catch (error) {
      console.error("Error inserting contacts:", error);
    throw error;
  }
}
    


