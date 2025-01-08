"use server";

import { LegalNatureSchema } from "@/features/legalNature/schema/legalNatures-schema";
import {
  LegalNatureDetail,
  updateLegalNature,
  LegalNatureInsert,
  insertLegalNature,
} from "../server/legalNature-db";

export async function insertLegalNatureFormAction(data: LegalNatureSchema) {
  const legalNatureInsert: LegalNatureInsert = {
    slug: data.slug || "",
    name: data.name || "",
    code: data.code || "",
    active: data.active ?? true,
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
  };

  const newId = await insertLegalNature(legalNatureInsert);
  return newId;
}
export async function updateLegalNatureFormAction(data: LegalNatureSchema) {
  console.log("updateLegalNatureFormAction", data);
  if (!data.id) {
    throw new Error("Cannot update legal nature without an ID");
  }

  const legalNatureUpdate: LegalNatureDetail = {
    id: data.id,
    slug: data.slug || "",
    name: data.name || "",
    code: data.code || "",
    active: data.active ?? true,
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
  };
  await updateLegalNature(legalNatureUpdate);
}
