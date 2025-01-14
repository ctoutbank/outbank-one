"use server";
import {
  MerchantSettlementsOrders,
  MerchantSettlementsOrdersResponse,
  MerchantSettlementsResponse,
  Settlement,
  SettlementObject,
  SettlementsResponse,
  PixMerchantSettlementOrders,
  PixMerchantSettlementOrdersResponse,
} from "./types";
import { insertSettlementAndRelations } from "./settlements";
import { insertMerchantSettlementAndRelations } from "./merchantSettlement";
import { insertMerchantSettlementOrdersAndRelations } from "./merchantSettlementOrders";

async function fetchSettlements() {
  let offset = 0;
  const limit = 50;
  let hasMoreData = true;
  const allData: Settlement[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://settlement.acquiring.dock.tech/v1/settlements?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse a resposta JSON e defina os tipos
    const data: SettlementsResponse = await response.json();

    // Combine os objetos retornados ao array final
    allData.push(...data.objects); // 'data.objects' é do tipo Settlement[]

    // Atualize o offset e verifique se ainda há mais dados
    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}

async function fetchMerchantSettlements() {
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;
  const allData: SettlementObject[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://settlement.acquiring.dock.tech/v1/merchant_settlements/order?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse a resposta JSON e defina os tipos
    const data: MerchantSettlementsResponse = await response.json();

    // Combine os objetos retornados ao array final
    allData.push(...data.objects); // 'data.objects' é do tipo Settlement[]

    // Atualize o offset e verifique se ainda há mais dados
    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}

async function fetchMerchantSettlementsOrders() {
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;
  const allData: MerchantSettlementsOrders[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://settlement.acquiring.dock.tech/v1/merchant_settlement_orders?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse a resposta JSON e defina os tipos
    const data: MerchantSettlementsOrdersResponse = await response.json();

    // Combine os objetos retornados ao array final
    allData.push(...data.objects); // 'data.objects' é do tipo Settlement[]

    // Atualize o offset e verifique se ainda há mais dados
    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}

async function fetchPixMerchantSettlementsOrders() {
  let offset = 0;
  const limit = 1000;
  let hasMoreData = true;
  const allData: PixMerchantSettlementOrders[] = [];

  while (hasMoreData) {
    const response = await fetch(
      `https://settlement.acquiring.dock.tech/v1/pix_merchant_settlement_orders?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    // Parse a resposta JSON e defina os tipos
    const data: PixMerchantSettlementOrdersResponse = await response.json();

    // Combine os objetos retornados ao array final
    allData.push(...data.objects); // 'data.objects' é do tipo Settlement[]

    // Atualize o offset e verifique se ainda há mais dados
    offset += limit;
    hasMoreData = offset < data.meta.total_count;
  }

  return allData;
}

export async function main() {
  try {
    console.log("Buscando customer...");

    const response = await fetchSettlements(); // Obtém a resposta inicial
    const settlements: Settlement[] = response || []; // Extraindo Settlements de 'objects'

    console.log(`Total de Settlements encontrados: ${settlements.length}`);

    for (const settlement of settlements) {
      await insertSettlementAndRelations(settlement);
    }

    const reponseMerchantSettlement = await fetchMerchantSettlements();
    const merchantSettlements : SettlementObject[] =
      reponseMerchantSettlement || [];

  for (const merchantsettlement of merchantSettlements ) {
    await insertMerchantSettlementAndRelations(merchantsettlement)
  }
  
  const responseMerchantSettlementsOrders = await fetchMerchantSettlementsOrders()
  const merchantSettlementsOrders : MerchantSettlementsOrders[] = responseMerchantSettlementsOrders || []

  for (const merchantSettlementsOrder of merchantSettlementsOrders ) {
    await  insertMerchantSettlementOrdersAndRelations(merchantSettlementsOrder)
  }

 const responsePixMerchantSettlementsOrders = await fetchPixMerchantSettlementsOrders()
 const pixMerchantSettlementOrders : PixMerchantSettlementOrders[] = responsePixMerchantSettlementsOrders || []

 for (const pixMerchantSettlementOrder of pixMerchantSettlementOrders) {
  await insertPixMerchantSettlementOrdersAndRelation(pixMerchantSettlementOrder)

 }

  } catch (error) {
    console.error("Erro ao processar Settlements:", error);
  } finally {
  }
}
