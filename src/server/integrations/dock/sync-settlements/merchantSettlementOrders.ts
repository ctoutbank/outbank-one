"use server";

import { db } from "@/server/db";
import { eq } from "drizzle-orm";
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
    const paymentInstitutionSlugs = Array.from(
      new Set(
        merchantSettlementOrders
          .map(
            (merchantSettlementsOrder) =>
              merchantSettlementsOrder.paymentInstitution?.slug
          )
          .filter((slug): slug is string => slug !== undefined && slug !== null)
      )
    );

    const paymentInstitution = await getIdBySlugs(
      "payment_institution",
      paymentInstitutionSlugs
    );

    const merchantSettlement = await getIdBySlugs(
      "merchant_settlements",
      merchantSettlementOrders.map(
        (MerchantSettlementsOrders) =>
          MerchantSettlementsOrders.merchantSettlement.slug
      )
    );

    const insertMerchantSettlementOrders: InsertMerchantSettlementsOrders[] =
      merchantSettlementOrders.map((merchantSettlementsOrder, index) => {
        // Debug logs para identificar problemas
        const matchingPaymentInstitution = paymentInstitution?.filter(
          (pi) => pi.slug === merchantSettlementsOrder.paymentInstitution?.slug
        )[0];

        const matchingMerchantSettlement = merchantSettlement?.filter(
          (ms) => ms.slug === merchantSettlementsOrder.merchantSettlement.slug
        )[0];

        if (!matchingPaymentInstitution) {
          console.error(
            `❌ Item ${index}: Payment Institution não encontrada`,
            {
              slug: merchantSettlementsOrder.paymentInstitution?.slug,
              availableSlugs: paymentInstitution?.map((p) => p.slug),
            }
          );
        }

        if (!matchingMerchantSettlement) {
          console.error(
            `❌ Item ${index}: Merchant Settlement não encontrado`,
            {
              slug: merchantSettlementsOrder.merchantSettlement.slug,
              availableSlugs: merchantSettlement?.map((m) => m.slug),
            }
          );
        }

        return {
          slug: merchantSettlementsOrder.slug,
          active: merchantSettlementsOrder.active,
          dtinsert: new Date(merchantSettlementsOrder.dtInsert).toISOString(),
          dtupdate: new Date(merchantSettlementsOrder.dtUpdate).toISOString(),
          compeCode: merchantSettlementsOrder.compeCode,
          accountNumber: merchantSettlementsOrder.accountNumber,
          accountNumberCheckDigit:
            merchantSettlementsOrder.accountNumberCheckDigit,
          slugPaymentInstitution:
            merchantSettlementsOrder.paymentInstitution?.slug ?? null,
          idPaymentInstitution: matchingPaymentInstitution?.id || null,
          bankBranchNumber: merchantSettlementsOrder.bankBranchNumber,
          accountType: merchantSettlementsOrder.accountType,
          integrationType: merchantSettlementsOrder.integrationType,
          brand: merchantSettlementsOrder.brand,
          productType: merchantSettlementsOrder.productType,
          amount: merchantSettlementsOrder.amount.toString(),
          anticipationAmount:
            merchantSettlementsOrder.anticipationAmount.toString(),
          idMerchantSettlements: matchingMerchantSettlement?.id || 0,
          merchantSettlementOrderStatus:
            merchantSettlementsOrder.merchantSettlementOrderStatus,
          orderTransactionId: merchantSettlementsOrder.orderTransactionId,
          settlementUniqueNumber:
            merchantSettlementsOrder.settlementUniqueNumber,
          protocolGuidId: merchantSettlementsOrder.protocolGuidId,
          legalPerson: merchantSettlementsOrder.legalPerson,
          documentId: merchantSettlementsOrder.documentId,
          corporateName: merchantSettlementsOrder.corporateName,
          effectivePaymentDate: merchantSettlementsOrder.effectivePaymentDate,
          lock: merchantSettlementsOrder.lock,
        };
      });

    await insertMerchantSettlementOrder(insertMerchantSettlementOrders);
  } catch (error) {
    console.error(
      `Erro ao processar merchant settlement order:`,
      error,
      merchantSettlementOrders
    );
  }
}

async function insertMerchantSettlementOrder(
  merchantSettlementOrderList: InsertMerchantSettlementsOrders[]
) {
  try {
    const existingMerchantSettlementOrders = await getIdBySlugs(
      "merchant_settlement_orders",
      merchantSettlementOrderList.map((order) => order.slug)
    );

    // Separar registros para insert e update
    const recordsToInsert = merchantSettlementOrderList.filter(
      (order) =>
        !existingMerchantSettlementOrders?.some(
          (existing) => existing.slug === order.slug
        )
    );

    const recordsToUpdate = merchantSettlementOrderList.filter((order) =>
      existingMerchantSettlementOrders?.some(
        (existing) => existing.slug === order.slug
      )
    );

    // Inserir novos registros
    if (recordsToInsert.length > 0) {
      console.log(
        "Inserting new merchantSettlementOrders, quantity:",
        recordsToInsert.length
      );
      await db.insert(merchantSettlementOrders).values(recordsToInsert);
      console.log("New merchantSettlementOrders inserted successfully.");
    }

    // Atualizar registros existentes
    if (recordsToUpdate.length > 0) {
      console.log(
        "Updating existing merchantSettlementOrders, quantity:",
        recordsToUpdate.length
      );

      for (const record of recordsToUpdate) {
        await db
          .update(merchantSettlementOrders)
          .set({
            active: record.active,
            dtinsert: record.dtinsert,
            dtupdate: record.dtupdate,
            compeCode: record.compeCode,
            accountNumber: record.accountNumber,
            accountNumberCheckDigit: record.accountNumberCheckDigit,
            slugPaymentInstitution: record.slugPaymentInstitution,
            idPaymentInstitution: record.idPaymentInstitution,
            bankBranchNumber: record.bankBranchNumber,
            accountType: record.accountType,
            integrationType: record.integrationType,
            brand: record.brand,
            productType: record.productType,
            amount: record.amount,
            anticipationAmount: record.anticipationAmount,
            idMerchantSettlements: record.idMerchantSettlements,
            merchantSettlementOrderStatus: record.merchantSettlementOrderStatus,
            orderTransactionId: record.orderTransactionId,
            settlementUniqueNumber: record.settlementUniqueNumber,
            protocolGuidId: record.protocolGuidId,
            legalPerson: record.legalPerson,
            documentId: record.documentId,
            corporateName: record.corporateName,
            effectivePaymentDate: record.effectivePaymentDate,
            lock: record.lock,
          })
          .where(eq(merchantSettlementOrders.slug, record.slug));
      }
      console.log("Existing merchantSettlementOrders updated successfully.");
    }

    if (recordsToInsert.length === 0 && recordsToUpdate.length === 0) {
      console.log("No records to insert or update");
    }
  } catch (error) {
    console.error("Error processing merchantSettlementOrders:", error);
  }
}
