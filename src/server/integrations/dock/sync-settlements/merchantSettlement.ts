"use server";

import { sql } from "drizzle-orm";
import { Settlement, SettlementObject } from "./types";
import { getOrCreateCustomer } from "./customer";
import { db } from "@/server/db";
import { merchantSettlements } from "../../../../../drizzle/schema";
import { getIdBySlug } from "../sync-merchant/getslug";
import { getOrCreatePaymentInstitution } from "./institutionalPayment";
import { getOrCreateMerchant } from "./merchant";
import { insertSettlement } from "./settlements";
export async function insertMerchantSettlementAndRelations(
  merchantSettlement: SettlementObject
) {
  try {
    merchantSettlement.customer
      ? await getOrCreateCustomer(merchantSettlement.customer)
      : null;

    const customerid = merchantSettlement.customer
      ? await getIdBySlug("customers", merchantSettlement.customer.slug)
      : null;
    console.log("customerid", customerid);

    merchantSettlement.customer
      ? await getOrCreatePaymentInstitution(
          merchantSettlement.customer.paymentInstitution,
          customerid || 0
        )
      : null;

    // Inserir o settlement com os IDs e slugs obtidos
    await insertSettlement(merchantSettlement.settlement, customerid);

    const settlementId = await getIdBySlug(
      "settlements",
      merchantSettlement.settlement.slug
    );

    await getOrCreateMerchant(merchantSettlement.merchant);

    const merchantId = await getIdBySlug(
      "merchants",
      merchantSettlement.merchant.slug
    );

    await insertMerchantSettlement(
      merchantSettlement,
      customerid,
      merchantId,
      settlementId
    );
  } catch (error) {
    console.error(
      `Erro ao processar MerchantSettlement ${merchantSettlement.slug}:`,
      error
    );
  }
}

async function insertMerchantSettlement(
  merchantSettlement: SettlementObject,

  customerid: number | null,
  merchantid: number | null,
  settlementid: number | null
) {
  try {
    const existingSettlement = await db
      .select({ slug: merchantSettlements.slug })
      .from(merchantSettlements)
      .where(sql`${merchantSettlements.slug} = ${merchantSettlement.slug}`);

    if (existingSettlement.length > 0) {
      console.log(
        `Merchant settlement ${merchantSettlement.slug} já existe, pulando inserção.`
      );
      return;
    }

    console.log("Inserting MerchantSettlement:", merchantSettlement);

    await db.insert(merchantSettlements).values({
      slug: merchantSettlement.slug || null,
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
      idCustomer: customerid,
      idMerchant: merchantid,
      idSettlement: settlementid,
    });

    console.log("MerchantSettlement inserted successfully.");
  } catch (error) {
    console.error("Error inserting MerchantSettlement:", error);
  }
}
