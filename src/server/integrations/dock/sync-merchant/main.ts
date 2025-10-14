"use server";

import { insertMerchantAndRelations } from "./merchan";

import { Merchant } from "./types";

async function fetchMerchants() {
  const response = await fetch(
    "https://merchant.acquiring.dock.tech/v1/merchants?limit=40",
    {
      headers: {
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IkQyN0M0OTMwNDE0ODRFQzk4NEZDREZDRTMwOTI5M0FGIn0.g8X1ICrhlFWJSX-egpxAm55VQ1N-uN2Z_NRklWo_nspESArzcR2eU8AqZ1pj9SfO8NaEu0zbOE4GRt5TXqaS-g`,
      },
    }
  );
  const data = await response.json();
  console.log("api data", data);
  return data;
}

export async function syncMerchant() {
  try {
    console.log("Buscando merchants...");

    const response = await fetchMerchants(); // Obtém a resposta inicial
    const merchants: Merchant[] = response.objects || []; // Extraindo merchants de 'objects'

    console.log(`Total de merchants encontrados: ${merchants.length}`);

    // Comentando o TRUNCATE para permitir atualizações em vez de recriar tudo
    // db.execute(
    //   "TRUNCATE TABLE contacts, merchantpixaccount, merchants, addresses, categories, legal_natures, sales_agents, configurations CASCADE;"
    // );

    for (const merchant of merchants) {
      await insertMerchantAndRelations(merchant);
    }
  } catch (error) {
    console.error("Erro ao processar merchants:", error);
  } finally {
  }
}
