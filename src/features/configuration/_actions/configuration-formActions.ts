"use server";

import { ConfigurationSchema } from "@/features/configuration/schema/configurations-schema";
import {
  ConfigurationDetail,
  updateConfiguration,
  ConfigurationInsert,
  insertConfiguration,
} from "../server/configuration";

export async function insertConfigurationFormAction(data: ConfigurationSchema) {
  const configurationInsert: ConfigurationInsert = {
    slug: data.slug || "",
    active: data.active ?? true,
    lockCpAnticipationOrder: data.lockCpAnticipationOrder ?? false,
    lockCnpAnticipationOrder: data.lockCnpAnticipationOrder ?? false,
    url: data.url || "",
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
  };

  const newId = await insertConfiguration(configurationInsert);
  return newId;
}

export async function updateConfigurationFormAction(data: ConfigurationSchema) {
  if (!data.id) {
    throw new Error("Cannot update configuration without an ID");
  }

  const configurationUpdate: ConfigurationDetail = {
    id: data.id,
    slug: data.slug || "",
    active: data.active ?? true,
    lockCpAnticipationOrder: data.lockCpAnticipationOrder ?? false,
    lockCnpAnticipationOrder: data.lockCnpAnticipationOrder ?? false,
    url: data.url || "",
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
  };

  await updateConfiguration(configurationUpdate);
}
