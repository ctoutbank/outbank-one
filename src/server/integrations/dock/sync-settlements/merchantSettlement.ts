"use server";

import { db } from "@/server/db";
import { merchantSettlements } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";
import { getOrCreateMerchants } from "./merchant";
import { insertSettlementAndRelations } from "./settlements";
import { InsertSettlementObject, SettlementObject } from "./types";
export async function insertMerchantSettlementAndRelations(
  merchantSettlementList: SettlementObject[]
) {
  try {
    const customerids: [{ id: number; slug: string | null }] | null =
      await getIdBySlugs(
        "customers",
        merchantSettlementList.map((settlement) => settlement.customer.slug)
      );

    // Inserir o settlement com os IDs e slugs obtidos
    await insertSettlementAndRelations(
      merchantSettlementList.map(
        (merchantSettlement) => merchantSettlement.settlement
      )
    );

    const settlementIds = await getIdBySlugs(
      "settlements",
      merchantSettlementList.map(
        (merchantSettlement) => merchantSettlement.settlement.slug
      )
    );

    const merchantids = await getOrCreateMerchants(
      merchantSettlementList.map((settlement) => settlement.merchant)
    );

    const insertmerchantSettlements: InsertSettlementObject[] =
      merchantSettlementList.map((merchantSettlement) => ({
        slug: merchantSettlement.slug,
        active: merchantSettlement.active,
        dtinsert: new Date(merchantSettlement.dtInsert).toISOString(),
        dtupdate: new Date(merchantSettlement.dtUpdate).toISOString(),
        transactionCount: merchantSettlement.transactionCount,
        adjustmentCount: merchantSettlement.adjustmentCount,
        batchAmount: merchantSettlement.batchAmount.toString(),
        netSettlementAmount: merchantSettlement.netSettlementAmount.toString(),
        pixAmount: merchantSettlement.pixAmount.toString(),
        pixNetAmount: merchantSettlement.pixNetAmount.toString(),
        pixFeeAmount: merchantSettlement.pixFeeAmount.toString(),
        pixCostAmount: merchantSettlement.pixCostAmount.toString(),
        creditAdjustmentAmount:
          merchantSettlement.creditAdjustmentAmount.toString(),
        debitAdjustmentAmount:
          merchantSettlement.debitAdjustmentAmount.toString(),
        totalAnticipationAmount:
          merchantSettlement.totalAnticipationAmount.toString(),
        totalRestitutionAmount:
          merchantSettlement.totalRestitutionAmount.toString(),
        pendingRestitutionAmount:
          merchantSettlement.pendingRestitutionAmount.toString(),
        totalSettlementAmount:
          merchantSettlement.totalSettlementAmount.toString(),
        pendingFinancialAdjustmentAmount:
          merchantSettlement.pendingFinancialAdjustmentAmount.toString(),
        creditFinancialAdjustmentAmount:
          merchantSettlement.creditFinancialAdjustmentAmount.toString(),
        debitFinancialAdjustmentAmount:
          merchantSettlement.debitFinancialAdjustmentAmount.toString(),
        status: merchantSettlement.status,
        slugMerchant: merchantSettlement.slugMerchant,
        slugCustomer: merchantSettlement.slugCustomer,
        outstandingAmount: merchantSettlement.outstandingAmount.toString(),
        restRoundingAmount: merchantSettlement.restRoundingAmount.toString(),
        idCustomer:
          customerids?.filter(
            (customer) => customer.slug === merchantSettlement.slugCustomer
          )[0]?.id || 0,
        idMerchant:
          merchantids?.filter(
            (merchant) => merchant.slug === merchantSettlement.slugMerchant
          )[0]?.id || 0,
        idSettlement:
          settlementIds?.filter(
            (settlement) =>
              settlement.slug === merchantSettlement.settlement.slug
          )[0]?.id || 0,
      }));

    await insertMerchantSettlement(insertmerchantSettlements);
  } catch (error) {
    console.error(`Erro ao processar MerchantSettlement:`, error);
  }
}

async function insertMerchantSettlement(
  insertMerchantSettlements: InsertSettlementObject[]
) {
  try {
    const existingMerchantSettlementOrders = await getIdBySlugs(
      "merchant_settlements",
      insertMerchantSettlements.map(
        (merchantSettlements) => merchantSettlements.slug
      )
    );

    const filteredList = insertMerchantSettlements.filter(
      (insertMerchantSettlements) =>
        !existingMerchantSettlementOrders?.some(
          (existingMerchantSettlements) =>
            existingMerchantSettlements.slug === insertMerchantSettlements.slug
        )
    );

    if (filteredList.length < 1) {
      console.log("todos os merchant settlement já foram adicionados");
      return;
    }

    console.log(
      "Inserting merchantSettlements, quantity:",
      filteredList.length
    );

    await db.insert(merchantSettlements).values(filteredList);

    console.log("MerchantSettlement inserted successfully.");
  } catch (error) {
    console.error("Error inserting MerchantSettlement:", error);
  }
}
