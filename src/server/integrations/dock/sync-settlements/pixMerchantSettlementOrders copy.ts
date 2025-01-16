"use server";

import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import { merchantPixSettlementOrders } from "../../../../../drizzle/schema";
import { getIdBySlug } from "../sync-merchant/getslug";
import { getOrCreatePaymentInstitution } from "./institutionalPayment";
import { getOrCreateMerchant } from "./merchant";
import { insertMerchantSettlementAndRelations } from "./merchantSettlement";
import { PixMerchantSettlementOrders } from "./types";

export async function insertPixMerchantSettlementOrdersAndRelations(
  pixMerchantSettlementOrders: PixMerchantSettlementOrders
) {
  try {
    const customerid = pixMerchantSettlementOrders.customer
      ? await getIdBySlug(
          "customers",
          pixMerchantSettlementOrders.customer.slug
        )
      : null;

    pixMerchantSettlementOrders.customer
      ? await getOrCreatePaymentInstitution(
          pixMerchantSettlementOrders.customer.paymentInstitution,
          customerid || 0
        )
      : null;

    await getOrCreateMerchant(pixMerchantSettlementOrders.merchant);

    const merchantId = await getIdBySlug(
      "merchants",
      pixMerchantSettlementOrders.merchant.slug
    );

    await insertMerchantSettlementAndRelations(
      pixMerchantSettlementOrders.merchantSettlement
    );

    const merchantSettlementId = await getIdBySlug(
      "merchant_settlements",
      pixMerchantSettlementOrders.merchantSettlement.slug
    );

    await insertPixMerchantSettlementOrders(
      pixMerchantSettlementOrders,
      merchantId,
      merchantSettlementId,
      customerid
    );
  } catch (error) {
    console.error(
      `Erro ao processar pixMerchantSettlementOrders ${pixMerchantSettlementOrders.slug}:`,
      error
    );
  }
}

async function insertPixMerchantSettlementOrders(
  pixMerchantSettlementOrder: PixMerchantSettlementOrders,

  merchantId: number | null,
  merchantSettlementId: number | null,
  customerId: number | null
) {
  try {
    const existingSettlement = await db
      .select({ slug: merchantPixSettlementOrders.slug })
      .from(merchantPixSettlementOrders)
      .where(
        sql`${merchantPixSettlementOrders.slug} = ${pixMerchantSettlementOrder.slug}`
      );

    if (existingSettlement.length > 0) {
      console.log(
        `Merchant pixMerchantSettlementOrder ${pixMerchantSettlementOrder.slug} já existe, pulando inserção.`
      );
      return;
    }

    console.log(
      "Inserting pixMerchantSettlementOrder:",
      pixMerchantSettlementOrder
    );

    await db.insert(merchantPixSettlementOrders).values({
      slug: pixMerchantSettlementOrder.slug || null,
      active: pixMerchantSettlementOrder.active,
      dtinsert: new Date(pixMerchantSettlementOrder.dtInsert).toISOString(),
      dtupdate: new Date(pixMerchantSettlementOrder.dtUpdate).toISOString(),
      slugCustomer: pixMerchantSettlementOrder.slugCustomer,
      idCustomer: customerId,
      slugMerchant: pixMerchantSettlementOrder.slugMerchant,
      idMerchant: merchantId,
      paymentDate: new Date(pixMerchantSettlementOrder.paymentDate)
        .toISOString()
        .split("T")[0],
      authorizerMerchantId: pixMerchantSettlementOrder.authorizerMerchantId,
      expectedPaymentDate: pixMerchantSettlementOrder.expectedPaymentDate
        ? new Date(pixMerchantSettlementOrder.expectedPaymentDate)
            .toISOString()
            .split("T")[0]
        : null,
      transactionCount: pixMerchantSettlementOrder.transactionCount,
      totalAmount: pixMerchantSettlementOrder.totalAmount.toString(),
      totalRefundAmount:
        pixMerchantSettlementOrder.totalRefundAmount.toString(),
      totalNetAmount: pixMerchantSettlementOrder.totalNetAmount.toString(),
      totalFeeAmount: pixMerchantSettlementOrder.totalFeeAmount.toString(),
      totalCostAmount: pixMerchantSettlementOrder.totalCostAmount.toString(),
      totalSettlementAmount:
        pixMerchantSettlementOrder.totalSettlementAmount.toString(),
      status: pixMerchantSettlementOrder.status,
      compeCode: pixMerchantSettlementOrder.compeCode,
      accountNumber: pixMerchantSettlementOrder.accountNumber,
      accountNumberCheckDigit:
        pixMerchantSettlementOrder.accountNumberCheckDigit,
      bankBranchNumber: pixMerchantSettlementOrder.bankBranchNumber,
      accountType: pixMerchantSettlementOrder.accountType,
      legalPerson: pixMerchantSettlementOrder.legalPerson,
      documentId: pixMerchantSettlementOrder.documentId,
      corporateName: pixMerchantSettlementOrder.corporateName,
      effectivePaymentDate: pixMerchantSettlementOrder.effectivePaymentDate
        ? new Date(pixMerchantSettlementOrder.effectivePaymentDate)
            .toISOString()
            .split("T")[0]
        : null,
      settlementUniqueNumber: pixMerchantSettlementOrder.settlementUniqueNumber,
      protocolGuidId: pixMerchantSettlementOrder.protocolGuidId,
      feeSettlementUniqueNumber:
        pixMerchantSettlementOrder.feeSettlementUniqueNumber,
      feeEffectivePaymentDate:
        pixMerchantSettlementOrder.feeEffectivePaymentDate
          ? new Date(pixMerchantSettlementOrder.feeEffectivePaymentDate)
              .toISOString()
              .split("T")[0]
          : null,
      feeProtocolGuidId: pixMerchantSettlementOrder.feeProtocolGuidId,
      idMerchantSettlement: merchantSettlementId,
    });

    console.log("pixMerchantSettlementOrder successfully.");
  } catch (error) {
    console.error("Error inserting pixMerchantSettlementOrder:", error);
  }
}





