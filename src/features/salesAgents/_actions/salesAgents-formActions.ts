import { SalesAgentSchema, AddressSchema } from "../schema/schema";
import { AddressDetail, insertAddress, updateAddress } from "../server/address";
import { AddressInsert } from "../server/address";
import {
  insertSalesAgent,
  SalesAgentesDetail,
  SalesAgentesInsert,
  updateSalesAgent,
} from "../server/salesAgent";


export async function insertAddressFormAction(data: AddressSchema) {
  const addressInsert: AddressInsert = {
    zipCode: data.zipCode,
    streetAddress: data.street,
    streetNumber: data.number,
    complement: data.complement || "",
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    country: data.country,
  };
  const newId = await insertAddress(addressInsert);

  return newId;
}

export async function updateAddressFormAction(data: AddressSchema) {
  if (!data.id) {
    throw new Error("Cannot update address without an ID");
  }

  const addressUpdate: AddressDetail = {
    id: data.id,
    zipCode: data.zipCode,
    streetAddress: data.street,
    streetNumber: data.number,
    complement: data.complement || "",
    neighborhood: data.neighborhood,
    city: data.city,
    state: data.state,
    country: data.country,
  };
  await updateAddress(addressUpdate);

  return data.id;
}

export async function insertSalesAgentFormAction(data: SalesAgentSchema) {
  const salesAgentInsert: SalesAgentesInsert = {
    slug: data.slug || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",  
    active: data.active ?? true,
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
    documentId: data.documentId || "",
    slugCustomer: data.slugCustomer || "",
    idAddress: data.idAddress || null,
    birthDate: data.birthDate ? data.birthDate.toISOString() : null,
    phone: data.phone || "",
    cpf: data.cpf || ""
  };

  const newId = await insertSalesAgent(salesAgentInsert);
  return newId;
}

export async function updateSalesAgentFormAction(data: SalesAgentSchema) {
  if (!data.id) {
    throw new Error("Cannot update sales agent without an ID");
  }

  

  const salesAgentUpdate: SalesAgentesDetail = {
    id: data.id,
    slug: data.slug || "",
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    active: data.active ?? true,
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
    documentId: data.documentId || "",
    slugCustomer: data.slugCustomer || "",
    idAddress: data.idAddress || null,
    birthDate: data.birthDate ? data.birthDate.toISOString() : null,
    phone: data.phone || "",
    cpf: data.cpf || ""
  };

  

  await updateSalesAgent(salesAgentUpdate);
}
