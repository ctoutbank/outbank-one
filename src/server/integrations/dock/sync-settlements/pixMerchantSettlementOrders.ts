"use server";

import { db } from "@/server/db";
import { sql } from "drizzle-orm";
import { merchantSettlementOrders } from "../../../../../drizzle/schema";
import { getIdBySlug } from "../sync-merchant/getslug";
import { getOrCreatePaymentInstitution } from "./institutionalPayment";
import { insertMerchantSettlementAndRelations } from "./merchantSettlement";
import { MerchantSettlementsOrders, PixMerchantSettlementOrders } from "./types";

export async function insertMerchantSettlementOrdersAndRelations(
  pixMerchantSettlementOrders: PixMerchantSettlementOrders
) {
  try {
    const customerid = merchantSettlementOrders.pixMerchantSettlementOrders.customer
      ? await getIdBySlug(
          "customers",
          merchantSettlementOrders.merchantSettlement.customer.slug
        )
      : null;

    merchantSettlementOrders.merchantSettlement.customer
      ? await getOrCreatePaymentInstitution(
          merchantSettlementOrders.paymentInstitution,
          customerid || 0
        )
      : null;

    const paymentInstitutionId = await getIdBySlug(
      "payment_institution",
      merchantSettlementOrders.paymentInstitution.slug
    );

    await insertMerchantSettlementAndRelations(
      merchantSettlementOrders.merchantSettlement
    );

    const merchantSettlementId = await getIdBySlug(
      "merchant_settlements",
      merchantSettlementOrders.merchantSettlement.slug
    );

    await insertMerchantSettlementOrder(
      merchantSettlementOrders,
      paymentInstitutionId,
      merchantSettlementId
    );
  } catch (error) {
    console.error(
      `Erro ao processar settlement ${merchantSettlementOrders.slug}:`,
      error
    );
  }
}

async function insertMerchantSettlementOrder(
  merchantSettlementsOrder: MerchantSettlementsOrders,

  paymentInstitutionId: number | null,
  merchantSettlementId: number | null
) {
  try {
    const existingSettlement = await db
      .select({ slug: merchantSettlementOrders.slug })
      .from(merchantSettlementOrders)
      .where(
        sql`${merchantSettlementOrders.slug} = ${merchantSettlementsOrder.slug}`
      );

    if (existingSettlement.length > 0) {
      console.log(
        `Merchant settlement ${merchantSettlementsOrder.slug} já existe, pulando inserção.`
      );
      return;
    }

    console.log("Inserting MerchantSettlementOrder:", merchantSettlementsOrder);

    await db.insert(merchantSettlementOrders).values({
      slug: merchantSettlementsOrder.slug || null,
      active: merchantSettlementsOrder.active,
      dtinsert: new Date(merchantSettlementsOrder.dtInsert).toISOString(),
      dtupdate: new Date(merchantSettlementsOrder.dtUpdate).toISOString(),
      compeCode: merchantSettlementsOrder.compeCode,
      accountNumber: merchantSettlementsOrder.accountNumber,
      accountNumberCheckDigit: merchantSettlementsOrder.accountNumberCheckDigit,
      slugPaymentInstitution: merchantSettlementsOrder.slugPaymentInstitution,
      bankBranchNumber: merchantSettlementsOrder.bankBranchNumber,
      accountType: merchantSettlementsOrder.accountType,
      integrationType: merchantSettlementsOrder.integrationType,
      brand: merchantSettlementsOrder.brand,
      productType: merchantSettlementsOrder.productType,
      amount: merchantSettlementsOrder.amount.toString(),
      anticipationAmount:
        merchantSettlementsOrder.anticipationAmount.toString(),
      merchantSettlementOrderStatus:
        merchantSettlementsOrder.merchantSettlementOrderStatus,
      orderTransactionId: merchantSettlementsOrder.orderTransactionId,
      settlementUniqueNumber: merchantSettlementsOrder.settlementUniqueNumber,
      protocolGuidId: merchantSettlementsOrder.protocolGuidId,
      legalPerson: merchantSettlementsOrder.legalPerson,
      documentId: merchantSettlementsOrder.documentId,
      corporateName: merchantSettlementsOrder.corporateName,
      effectivePaymentDate: merchantSettlementsOrder.effectivePaymentDate,
      lock: merchantSettlementsOrder.lock,
      idPaymentInstitution: paymentInstitutionId,
      idMerchantSettlements: merchantSettlementId,
    });

    console.log("Settlement MerchantSettlementOrder successfully.");
  } catch (error) {
    console.error("Error inserting MerchantSettlementOrder:", error);
  }
}
