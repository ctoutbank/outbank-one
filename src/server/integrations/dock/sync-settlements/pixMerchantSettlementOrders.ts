"use server";

import { db } from "@/server/db";
import { merchantPixSettlementOrders } from "../../../../../drizzle/schema";
import { getIdBySlugs } from "./getIdBySlugs";
import { getOrCreateMerchants } from "./merchant";
import { insertMerchantSettlementAndRelations } from "./merchantSettlement";
import {
  InsertPixMerchantSettlementOrders,
  PixMerchantSettlementOrders,
} from "./types";

export async function insertPixMerchantSettlementOrdersAndRelations(
  pixMerchantSettlementOrderList: PixMerchantSettlementOrders[]
) {
  try {
    // Remove duplicatas e retorna um array com os slugs unicos
    const customer = Array.from(
      new Set(
        pixMerchantSettlementOrderList.map(
          (pixMerchantSettlementOrderList) =>
            pixMerchantSettlementOrderList.customer.slug
        )
      )
    );
    const customerids = await getIdBySlugs("customers", customer);

    const merchantIds = await getOrCreateMerchants(
      pixMerchantSettlementOrderList.map((settlement) => settlement.merchant)
    );

    await insertMerchantSettlementAndRelations(
      pixMerchantSettlementOrderList.map(
        (pixMerchantSettlementOrderList) =>
          pixMerchantSettlementOrderList.merchantSettlement
      )
    );

    const merchantSettlementIds = await getIdBySlugs(
      "merchant_settlements",
      pixMerchantSettlementOrderList.map(
        (pixMerchantSettlementOrderList) => pixMerchantSettlementOrderList.merchantSettlement.slug
      )
    );
 
    const insertPixMerchantSettlementOrdersVar: InsertPixMerchantSettlementOrders[] =
      pixMerchantSettlementOrderList.map((pixMerchantSettlementOrder) => ({
        slug: pixMerchantSettlementOrder.slug,
        active: pixMerchantSettlementOrder.active,
        dtinsert: new Date(pixMerchantSettlementOrder.dtInsert).toISOString(),
        dtupdate: new Date(pixMerchantSettlementOrder.dtUpdate).toISOString(),
        slugCustomer: pixMerchantSettlementOrder.slugCustomer,
        idCustomer:
          customerids?.filter(
            (customer) =>
              customer.slug === pixMerchantSettlementOrder.slugCustomer
          )[0]?.id || 0,
        slugMerchant: pixMerchantSettlementOrder.slugMerchant,
        idMerchant:
          merchantIds?.filter(
            (merchant) =>
              merchant.slug === pixMerchantSettlementOrder.slugMerchant
          )[0]?.id || 0,
        paymentDate: pixMerchantSettlementOrder.paymentDate
          ? new Date(pixMerchantSettlementOrder.paymentDate)
              .toISOString()
              .split("T")[0]
          : null,
        authorizerMerchantId: pixMerchantSettlementOrder.authorizerMerchantId,
        expectedPaymentDate: pixMerchantSettlementOrder.expectedPaymentDate
          ? new Date(pixMerchantSettlementOrder.expectedPaymentDate)
              .toISOString()
              .split("T")[0]
          : null,
        transactionCount: pixMerchantSettlementOrder.transactionCount,
        totalAmount:
          pixMerchantSettlementOrder.totalAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalAmount.toString(),
        totalRefundAmount:
          pixMerchantSettlementOrder.totalRefundAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalRefundAmount.toString(),
        totalNetAmount:
          pixMerchantSettlementOrder.totalNetAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalNetAmount.toString(),
        totalFeeAmount:
          pixMerchantSettlementOrder.totalFeeAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalFeeAmount.toString(),
        totalCostAmount:
          pixMerchantSettlementOrder.totalCostAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalCostAmount.toString(),
        totalSettlementAmount:
          pixMerchantSettlementOrder.totalSettlementAmount == undefined
            ? "0"
            : pixMerchantSettlementOrder.totalSettlementAmount.toString(),
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
        settlementUniqueNumber:
          pixMerchantSettlementOrder.settlementUniqueNumber,
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
        idMerchantSettlement:
          merchantSettlementIds?.filter(
            (merchantSettlement) =>
              merchantSettlement.slug === pixMerchantSettlementOrder.merchantSettlement.slug
          )[0]?.id || 0,
      }));

    await insertPixMerchantSettlementOrders(
      insertPixMerchantSettlementOrdersVar
    );
  } catch (error) {
    console.error(`Erro ao processar pixMerchantSettlementOrders:`, error);
  }
}

async function insertPixMerchantSettlementOrders(
  pixMerchantSettlementOrder: InsertPixMerchantSettlementOrders[]
) {
  try {
    const existingPixMerchantSettlementOrder = await getIdBySlugs(
      "merchant_pix_settlement_orders",
      pixMerchantSettlementOrder.map(
        (pixMerchantSettlementOrder) => pixMerchantSettlementOrder.slug
      )
    );

    const filteredList = pixMerchantSettlementOrder.filter(
      (pixMerchantSettlementOrder) =>
        !existingPixMerchantSettlementOrder?.some(
          (existingPixMerchantSettlementOrder) =>
            existingPixMerchantSettlementOrder.slug ===
            pixMerchantSettlementOrder.slug
        )
    );

    if (filteredList.length < 1) {
      console.log(
        "todos os merchant settlement orders pix já foram adicionados"
      );
      return;
    }

    console.log(
      "Inserting pixMerchantSettlementOrder, quantity:",
      filteredList.length
    );

    await db.insert(merchantPixSettlementOrders).values(filteredList);
    console.log("pixMerchantSettlementOrder successfully.");
  } catch (error) {
    console.error("Error inserting pixMerchantSettlementOrder:", error);
  }
}
