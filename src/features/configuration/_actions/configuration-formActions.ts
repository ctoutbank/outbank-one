"use server";

import { ConfigurationSchema } from "@/features/configuration/schema/configurations-schema";
import {
  ConfigurationDetail,
  ConfigurationInsert,
  insertConfiguration,
  updateConfiguration,
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
    anticipationRiskFactorCp: data.anticipationRiskFactorCp
      ? String(data.anticipationRiskFactorCp)
      : null,
    anticipationRiskFactorCnp: data.anticipationRiskFactorCnp
      ? String(data.anticipationRiskFactorCnp)
      : null,
    waitingPeriodCp: data.waitingPeriodCp ? String(data.waitingPeriodCp) : null,
    waitingPeriodCnp: data.waitingPeriodCnp
      ? String(data.waitingPeriodCnp)
      : null,
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
    anticipationRiskFactorCp: data.anticipationRiskFactorCp
      ? String(data.anticipationRiskFactorCp)
      : null,
    anticipationRiskFactorCnp: data.anticipationRiskFactorCnp
      ? String(data.anticipationRiskFactorCnp)
      : null,
    waitingPeriodCp: data.waitingPeriodCp ? String(data.waitingPeriodCp) : null,
    waitingPeriodCnp: data.waitingPeriodCnp
      ? String(data.waitingPeriodCnp)
      : null,
  };

  await updateConfiguration(configurationUpdate);
}
