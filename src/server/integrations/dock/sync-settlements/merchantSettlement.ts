"use server";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { merchantSettlements } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";
import { getOrCreateMerchants } from "./merchant";
import { InsertSettlementObject, SettlementObject } from "./types";

export async function insertMerchantSettlementAndRelations(
  merchantSettlementList: SettlementObject[]
) {
  try {
    const customerids = await getIdBySlugs(
      "customers",
      merchantSettlementList.map(
        (merchantSettlement) => merchantSettlement.slugCustomer
      )
    );

    const merchantids = await getOrCreateMerchants(
      merchantSettlementList.map(
        (merchantSettlement) => merchantSettlement.merchant
      )
    );

    const settlementIds = await getIdBySlugs(
      "settlements",
      merchantSettlementList.map(
        (merchantSettlement) => merchantSettlement.settlement.slug
      )
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
  merchantSettlementList: InsertSettlementObject[]
) {
  try {
    const existingMerchantSettlements = await getIdBySlugs(
      "merchant_settlements",
      merchantSettlementList.map((settlement) => settlement.slug)
    );

    // Separar registros para insert e update
    const recordsToInsert = merchantSettlementList.filter(
      (settlement) =>
        !existingMerchantSettlements?.some(
          (existing) => existing.slug === settlement.slug
        )
    );

    const recordsToUpdate = merchantSettlementList.filter((settlement) =>
      existingMerchantSettlements?.some(
        (existing) => existing.slug === settlement.slug
      )
    );

    // Inserir novos registros
    if (recordsToInsert.length > 0) {
      console.log(
        "Inserting new merchantSettlements, quantity:",
        recordsToInsert.length
      );
      await db.insert(merchantSettlements).values(recordsToInsert);
      console.log("New merchantSettlements inserted successfully.");
    }

    // Atualizar registros existentes
    if (recordsToUpdate.length > 0) {
      console.log(
        "Updating existing merchantSettlements, quantity:",
        recordsToUpdate.length
      );

      for (const record of recordsToUpdate) {
        await db
          .update(merchantSettlements)
          .set({
            active: record.active,
            dtinsert: record.dtinsert,
            dtupdate: record.dtupdate,
            transactionCount: record.transactionCount,
            adjustmentCount: record.adjustmentCount,
            batchAmount: record.batchAmount,
            netSettlementAmount: record.netSettlementAmount,
            pixAmount: record.pixAmount,
            pixNetAmount: record.pixNetAmount,
            pixFeeAmount: record.pixFeeAmount,
            pixCostAmount: record.pixCostAmount,
            creditAdjustmentAmount: record.creditAdjustmentAmount,
            debitAdjustmentAmount: record.debitAdjustmentAmount,
            totalAnticipationAmount: record.totalAnticipationAmount,
            totalRestitutionAmount: record.totalRestitutionAmount,
            pendingRestitutionAmount: record.pendingRestitutionAmount,
            totalSettlementAmount: record.totalSettlementAmount,
            pendingFinancialAdjustmentAmount:
              record.pendingFinancialAdjustmentAmount,
            creditFinancialAdjustmentAmount:
              record.creditFinancialAdjustmentAmount,
            debitFinancialAdjustmentAmount:
              record.debitFinancialAdjustmentAmount,
            status: record.status,
            slugMerchant: record.slugMerchant,
            slugCustomer: record.slugCustomer,
            outstandingAmount: record.outstandingAmount,
            restRoundingAmount: record.restRoundingAmount,
            idCustomer: record.idCustomer,
            idMerchant: record.idMerchant,
            idSettlement: record.idSettlement,
          })
          .where(eq(merchantSettlements.slug, record.slug));
      }
      console.log("Existing merchantSettlements updated successfully.");
    }

    if (recordsToInsert.length === 0 && recordsToUpdate.length === 0) {
      console.log("No records to insert or update");
    }
  } catch (error) {
    console.error("Error processing merchantSettlements:", error);
  }
}
