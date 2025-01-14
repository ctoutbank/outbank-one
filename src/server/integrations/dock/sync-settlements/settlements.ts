"use server";

import { sql } from "drizzle-orm";
import { Settlement } from "./types";
import { getOrCreateCustomer } from "./customer";
import { db } from "@/server/db";
import { settlements } from "../../../../../drizzle/schema";
import { getIdBySlug } from "../sync-merchant/getslug";
import { getOrCreatePaymentInstitution } from "./institutionalPayment";

export async function insertSettlementAndRelations(settlement: Settlement) {
  console.log("Inserting settlement:", settlement);
  try {
    const customerslug = settlement.customer
      ? await getOrCreateCustomer(settlement.customer)
      : null;
    console.log("customerslug", customerslug);

    const customerid = settlement.customer
      ? await getIdBySlug("customers", settlement.customer.slug)
      : null;
    console.log("customerid", customerid);

    settlement.customer
      ? await getOrCreatePaymentInstitution(
          settlement.customer.paymentInstitution,
          customerid || 0
        )
      : null;

    // Inserir o settlement com os IDs e slugs obtidos
    await insertSettlement(settlement, customerid);
  } catch (error) {
    console.error(`Erro ao processar settlement ${settlement.slug}:`, error);
  }
}

export async function insertSettlement(
  settlement: Settlement,

  customerid: number | null
) {
  try {
    const existingSettlement = await db
      .select({ slug: settlements.slug })
      .from(settlements)
      .where(sql`${settlements.slug} = ${settlement.slug}`);

    if (existingSettlement.length > 0) {
      console.log(`Settlement ${settlement.slug} já existe, pulando inserção.`);
      return;
    }

    console.log("Inserting settlement:", settlement);

    await db.insert(settlements).values({
      slug: settlement.slug || null,
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
      pendingRestitutionAmount: settlement.pendingRestitutionAmount.toString(),
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
      paymentDate: new Date(settlement.paymentDate).toISOString().split("T")[0],
      pendingFinancialAdjustmentAmount:
        settlement.pendingFinancialAdjustmentAmount.toString(),
      creditFinancialAdjustmentAmount:
        settlement.creditFinancialAdjustmentAmount.toString(),
      debitFinancialAdjustmentAmount:
        settlement.debitFinancialAdjustmentAmount.toString(),
      idCustomer: customerid,
    });

    console.log("Settlement inserted successfully.");
  } catch (error) {
    console.error("Error inserting settlement:", error);
  }
}
