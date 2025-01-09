"use server";

import { db } from "@/server/db";


import { Merchant } from "../types";
import { insertMerchantAndRelationss } from "./merchan-test";



async function fetchMerchants() {
  const response = await fetch(
    "https://merchant.acquiring.dock.tech/v1/merchants",
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

export async function main2() {
  try {
    console.log("Buscando Legal Nature...");
    
    const response = await fetchMerchants(); // Obtém a resposta inicial
    const merchants: Merchant[] = response.objects || []; // Extraindo merchants de 'objects'

    console.log(`Total de merchants encontrados: ${merchants.length}`);
    db.execute(
      "TRUNCATE TABLE  merchants, legalNatures CASCADE;"
    );

    for (const merchant of merchants) {
      await insertMerchantAndRelationss(merchant);
     
    }
  } catch (error) {
    console.error("Erro ao processar merchants:", error);
  } finally {
      
  }
}




