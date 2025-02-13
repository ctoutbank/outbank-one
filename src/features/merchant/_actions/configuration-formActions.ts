
"use server"
import { ConfigurationInsert, insertConfiguration } from "@/features/configuration/server/configuration";
import { ConfigurationSchema } from "@/features/configuration/schema/configurations-schema";
import { ConfigurationUpdate, updateConfiguration } from "../server/configurations";



export async function insertConfigurationFormAction(data: ConfigurationSchema) {
  const configurationInsert: ConfigurationInsert = {
    slug: data.slug || "",
    active: data.active ?? true,
  };
  const newId = await insertConfiguration(configurationInsert);
  return newId;
}

export async function updateConfigurationFormAction(data: ConfigurationSchema) {
  const configurationUpdate: ConfigurationUpdate = {
    id: data.id || 0,
    slug: data.slug || "",
    active: data.active ?? true,
    lockCpAnticipationOrder: data.lockCpAnticipationOrder ?? false,
    lockCnpAnticipationOrder: data.lockCnpAnticipationOrder ?? false,
    url: data.url || "",
    dtinsert: (data.dtinsert || new Date()).toISOString(),
    dtupdate: (data.dtupdate || new Date()).toISOString(),
  };

  const result = await updateConfiguration(configurationUpdate);
  return result?.id;
}
