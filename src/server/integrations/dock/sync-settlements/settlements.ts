"use server";

import { sql } from "drizzle-orm";
import { InsertSettlement, Settlement } from "./types";
import { getOrCreateCustomer } from "./customer";
import { db } from "@/server/db";
import { settlements } from "../../../../../drizzle/schema";
import { getIdBySlug } from "../sync-merchant/getslug";
import { getOrCreatePaymentInstitution } from "./institutionalPayment";
import { getIdBySlugs } from "./getIdBySlugs";

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
        paymentDate: new Date(settlement.paymentDate)
          .toISOString()
          .split("T")[0],
        pendingFinancialAdjustmentAmount:
          settlement.pendingFinancialAdjustmentAmount.toString(),
        creditFinancialAdjustmentAmount:
          settlement.creditFinancialAdjustmentAmount.toString(),
        debitFinancialAdjustmentAmount:
          settlement.debitFinancialAdjustmentAmount.toString(),
        idCustomer:
          customerids?.filter((customer) => customer.slug === settlement.customer.slug)[0]
            ?.id || 0,
      })
    );

    // Inserir o settlement com os IDs e slugs obtidos
    await insertSettlements(insertSettlement);
  } catch (error) {
    console.error(`Erro ao processar settlement:`, error);
  }
}

export async function insertSettlements(settlement: InsertSettlement[]) {
  try {
    const existingSettlements = await getIdBySlugs(
      "settlements",
      settlement.map((settlement) => settlement.slug)
    );

    const filteredList = settlement.filter(
      (settlement) =>
        !existingSettlements?.some(
          (existingSettlements) => existingSettlements.slug === settlement.slug
        )
    );

    if (filteredList.length < 1) {
      console.log("todos os settlement já foram adicionados");
      return;
    }

    console.log("Inserting settlements, quantity: ", filteredList.length);

    await db.insert(settlements).values(filteredList);

    console.log("Settlement inserted successfully.");
  } catch (error) {
    console.error("Error inserting settlement:", error);
  }
}
