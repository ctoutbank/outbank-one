import { SalesAgentSchema } from "../schema/schema";
import {
  insertSalesAgent,
  SalesAgentesDetail,
  SalesAgentesInsert,
  updateSalesAgent,
} from "../server/salesAgent";

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
    birthDate: data.birthDate ? data.birthDate.toISOString() : null,
    phone: data.phone || "",
    cpf: data.cpf || "",
    idUsers: data.idUser || null,
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
    birthDate: data.birthDate ? data.birthDate.toISOString() : null,
    phone: data.phone || "",
    cpf: data.cpf || "",
    idUsers: data.idUser || null,
  };

  await updateSalesAgent(salesAgentUpdate);
}
