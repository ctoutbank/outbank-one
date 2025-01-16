"use server";

import { db } from "@/server/db";
import { merchantSettlementOrders } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";
import {
  InsertMerchantSettlementsOrders,
  MerchantSettlementsOrders,
} from "./types";

export async function insertMerchantSettlementOrdersAndRelations(
  merchantSettlementOrders: MerchantSettlementsOrders[]
) {
  try {
    const paymentInstitution = await getIdBySlugs(
      "payment_institution",
      merchantSettlementOrders.map(
        (MerchantSettlementsOrders) =>
          MerchantSettlementsOrders.paymentInstitution.slug
      )
    );

    const merchantSettlement = await getIdBySlugs(
      "merchant_settlements",
      merchantSettlementOrders.map(
        (MerchantSettlementsOrders) =>
          MerchantSettlementsOrders.merchantSettlement.slug
      )
    );

    const insertMerchantSettlementOrders: InsertMerchantSettlementsOrders[] =
      merchantSettlementOrders.map((merchantSettlementsOrder) => ({
        slug: merchantSettlementsOrder.slug,
        active: merchantSettlementsOrder.active,
        dtinsert: new Date(merchantSettlementsOrder.dtInsert).toISOString(),
        dtupdate: new Date(merchantSettlementsOrder.dtUpdate).toISOString(),
        compeCode: merchantSettlementsOrder.compeCode,
        accountNumber: merchantSettlementsOrder.accountNumber,
        accountNumberCheckDigit:
          merchantSettlementsOrder.accountNumberCheckDigit,
        slugPaymentInstitution:
          merchantSettlementsOrder.paymentInstitution.slug,
        idPaymentInstitution:
          paymentInstitution?.find(
            (paymentInstitution) =>
              paymentInstitution.slug ===
              merchantSettlementsOrder.paymentInstitution.slug
          )?.id || 0,
        bankBranchNumber: merchantSettlementsOrder.bankBranchNumber,
        accountType: merchantSettlementsOrder.accountType,
        integrationType: merchantSettlementsOrder.integrationType,
        brand: merchantSettlementsOrder.brand,
        productType: merchantSettlementsOrder.productType,
        amount: merchantSettlementsOrder.amount.toString(),
        anticipationAmount:
          merchantSettlementsOrder.anticipationAmount.toString(),
        idMerchantSettlement:
          merchantSettlement?.find(
            (merchantSettlement) =>
              merchantSettlement.slug ===
              merchantSettlementsOrder.merchantSettlement.slug
          )?.id || 0,
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
      }));

    await insertMerchantSettlementOrder(insertMerchantSettlementOrders);
  } catch (error) {
    console.error(`Erro ao processar merchant settlement order:`, error);
  }
}

async function insertMerchantSettlementOrder(
  merchantSettlementsOrder: InsertMerchantSettlementsOrders[]
) {
  try {
    const existingMerchantSettlementOrders = await getIdBySlugs(
      "merchant_settlement_orders",
      merchantSettlementsOrder.map(
        (MerchantSettlementsOrders) => MerchantSettlementsOrders.slug
      )
    );

    const filteredList = merchantSettlementsOrder.filter(
      (merchantSettlementsOrder) =>
        !existingMerchantSettlementOrders?.some(
          (existingMerchantSettlementOrders) =>
            existingMerchantSettlementOrders.slug ===
            merchantSettlementsOrder.slug
        )
    );

    if (filteredList.length < 1) {
      console.log("todos os merchant settlement orders já foram adicionados");
      return;
    }

    console.log("Inserting MerchantSettlementOrder:", merchantSettlementsOrder);

    await db.insert(merchantSettlementOrders).values(filteredList);

    console.log("Settlement MerchantSettlementOrder successfully.");
  } catch (error) {
    console.error("Error inserting MerchantSettlementOrder:", error);
  }
}
