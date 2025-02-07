"use server";

import { db } from "@/server/db";
import { insertMerchantAndRelations } from "./merchan";

import { Merchant } from "./types";

async function fetchMerchants() {
  const response = await fetch(
    "https://merchant.acquiring.dock.tech/v1/merchants?limit=40",
    {
      headers: {
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
      },
    }
  );
  const data = await response.json();
  console.log("api data", data);
  return data;
}

export async function main() {
  try {
    console.log("Buscando merchants...");

    const response = await fetchMerchants(); // Obtém a resposta inicial
    const merchants: Merchant[] = response.objects || []; // Extraindo merchants de 'objects'

    console.log(`Total de merchants encontrados: ${merchants.length}`);
    db.execute(
      "TRUNCATE TABLE contacts, merchantpixaccount, merchants, addresses, categories, legal_natures, sales_agents, configurations CASCADE;"
    );

    for (const merchant of merchants) {
      await insertMerchantAndRelations(merchant);
    }
  } catch (error) {
    console.error("Erro ao processar merchants:", error);
  } finally {
  }
}
