"use server";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
import { settlements } from "../../../../../drizzle/schema";
import { getOrCreateCustomer } from "./customer";
import { getIdBySlugs } from "./getIdBySlugs";
import { InsertSettlement, Settlement } from "./types";

export async function insertSettlementAndRelations(settlement: Settlement[]) {
  try {
    const customerids = await getOrCreateCustomer(
      settlement.map((settlement) => settlement.customer)
    );

    const insertSettlement: InsertSettlement[] = settlement.map(
      (settlement) => ({
        slug: settlement.slug,
        active: settlement.active,
        dtinsert: new Date(settlement.dtInsert).toISOString(),
        dtupdate: new Date(settlement.dtUpdate).toISOString(),
        batchAmount: settlement.batchAmount.toString(),
        discountFeeAmount: settlement.discountFeeAmount.toString(),
        netSettlementAmount: settlement.netSettlementAmount.toString(),
        totalAnticipationAmount: settlement.totalAnticipationAmount.toString(),
        totalRestitutionAmount: settlement.totalRestitutionAmount.toString(),
        pixAmount: settlement.pixAmount.toString(),
        pixNetAmount: settlement.pixNetAmount.toString(),
        pixFeeAmount: settlement.pixFeeAmount.toString(),
        pixCostAmount: settlement.pixCostAmount.toString(),
        pendingRestitutionAmount:
          settlement.pendingRestitutionAmount.toString(),
        totalCreditAdjustmentAmount:
          settlement.totalCreditAdjustmentAmount.toString(),
        totalDebitAdjustmentAmount:
          settlement.totalDebitAdjustmentAmount.toString(),
        totalSettlementAmount: settlement.totalSettlementAmount.toString(),
        restRoundingAmount: settlement.restRoundingAmount.toString(),
        outstandingAmount: settlement.outstandingAmount.toString(),
        slugCustomer: settlement.slugCustomer,
        status: settlement.status,
        creditStatus: settlement.creditStatus,
        debitStatus: settlement.debitStatus,
        anticipationStatus: settlement.anticipationStatus,
        pixStatus: settlement.pixStatus,
        paymentDate: settlement.paymentDate,
        pendingFinancialAdjustmentAmount:
          settlement.pendingFinancialAdjustmentAmount.toString(),
        creditFinancialAdjustmentAmount:
          settlement.creditFinancialAdjustmentAmount.toString(),
        debitFinancialAdjustmentAmount:
          settlement.debitFinancialAdjustmentAmount.toString(),
        idCustomer:
          customerids?.filter(
            (customer) => customer.slug === settlement.slugCustomer
          )[0]?.id || 0,
      })
    );

    await insertSettlements(insertSettlement);
  } catch (error) {
    console.error(`Erro ao processar settlement:`, error);
  }
}

async function insertSettlements(settlementList: InsertSettlement[]) {
  try {
    const existingSettlements = await getIdBySlugs(
      "settlements",
      settlementList.map((settlement) => settlement.slug)
    );

    // Separar registros para insert e update
    const recordsToInsert = settlementList.filter(
      (settlement) =>
        !existingSettlements?.some(
          (existing) => existing.slug === settlement.slug
        )
    );

    const recordsToUpdate = settlementList.filter((settlement) =>
      existingSettlements?.some((existing) => existing.slug === settlement.slug)
    );

    // Inserir novos registros
    if (recordsToInsert.length > 0) {
      console.log(
        "Inserting new settlements, quantity:",
        recordsToInsert.length
      );
      await db.insert(settlements).values(recordsToInsert);
      console.log("New settlements inserted successfully.");
    }

    // Atualizar registros existentes
    if (recordsToUpdate.length > 0) {
      console.log(
        "Updating existing settlements, quantity:",
        recordsToUpdate.length
      );

      for (const record of recordsToUpdate) {
        await db
          .update(settlements)
          .set({
            active: record.active,
            dtinsert: record.dtinsert,
            dtupdate: record.dtupdate,
            batchAmount: record.batchAmount,
            discountFeeAmount: record.discountFeeAmount,
            netSettlementAmount: record.netSettlementAmount,
            totalAnticipationAmount: record.totalAnticipationAmount,
            totalRestitutionAmount: record.totalRestitutionAmount,
            pixAmount: record.pixAmount,
            pixNetAmount: record.pixNetAmount,
            pixFeeAmount: record.pixFeeAmount,
            pixCostAmount: record.pixCostAmount,
            pendingRestitutionAmount: record.pendingRestitutionAmount,
            totalCreditAdjustmentAmount: record.totalCreditAdjustmentAmount,
            totalDebitAdjustmentAmount: record.totalDebitAdjustmentAmount,
            totalSettlementAmount: record.totalSettlementAmount,
            restRoundingAmount: record.restRoundingAmount,
            outstandingAmount: record.outstandingAmount,
            slugCustomer: record.slugCustomer,
            status: record.status,
            creditStatus: record.creditStatus,
            debitStatus: record.debitStatus,
            anticipationStatus: record.anticipationStatus,
            pixStatus: record.pixStatus,
            paymentDate: record.paymentDate,
            pendingFinancialAdjustmentAmount:
              record.pendingFinancialAdjustmentAmount,
            creditFinancialAdjustmentAmount:
              record.creditFinancialAdjustmentAmount,
            debitFinancialAdjustmentAmount:
              record.debitFinancialAdjustmentAmount,
            idCustomer: record.idCustomer,
          })
          .where(eq(settlements.slug, record.slug));
      }
      console.log("Existing settlements updated successfully.");
    }

    if (recordsToInsert.length === 0 && recordsToUpdate.length === 0) {
      console.log("No records to insert or update");
    }
  } catch (error) {
    console.error("Error processing settlements:", error);
  }
}
