import { ContactSchema } from "../schema/contact-schema";
import {
  ContactInsert,
  ContactUpdate,
  insertContact,
  updateContact,
} from "../server/contact";

export async function insertContactFormAction(data: ContactSchema) {
  const contactInsert: ContactInsert = {
    name: data.name || "",
    idDocument: data.idDocument || "",
    email: data.email || "",
    areaCode: data.areaCode || "",
    number: data.number || "",
    phoneType: data.phoneType || "",
    birthDate: data.birthDate?.toISOString() || new Date().toISOString(),
    mothersName: data.mothersName || "",
    isPartnerContact: data.isPartnerContact || false,
    isPep: data.isPep || false,
    idMerchant: data.idMerchant || undefined,
    slugMerchant: data.slugMerchant || "",
    idAddress: data.idAddress || undefined,
  };
  const newId = await insertContact(contactInsert);
  return newId;
}

export async function updateContactFormAction(data: ContactSchema) {
  const contactupdate: ContactUpdate = {
    id: data.id || 0,
    name: data.name || "",
    idDocument: data.idDocument || "",
    email: data.email || "",
    areaCode: data.areaCode || "",
    number: data.number || "",
    phoneType: data.phoneType || "",
    birthDate: data.birthDate?.toISOString() || new Date().toISOString(),
    mothersName: data.mothersName || "",
    isPartnerContact: data.isPartnerContact || true,
    isPep: data.isPep || true,
    idMerchant: data.idMerchant || 0,
    slugMerchant: data.slugMerchant || "",
    idAddress: data.idAddress || 0,
    icNumber: data.icNumber || null,
    icDateIssuance: data.icDateIssuance?.toISOString() || null,
    icDispatcher: data.icDispatcher || null,
    icFederativeUnit: data.icFederativeUnit || null,
  };
  await updateContact(contactupdate);
}
