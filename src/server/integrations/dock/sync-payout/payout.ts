"use server";

import { db } from "@/server/db";
import { count, eq, max } from "drizzle-orm";
import { payout } from "../../../../../drizzle/schema";
import { getOrCreateCustomer } from "../sync-settlements/customer";
import { getIdBySlugs } from "../sync-settlements/getIdBySlugs";
import { getOrCreateMerchants } from "../sync-settlements/merchant";
import { InsertPayout, Payout } from "./types";

export async function insertPayoutAndRelations(payoutList: Payout[]) {
  try {
    const customerids = await getOrCreateCustomer(
      payoutList.map((payouts) => payouts.customer)
    );
    const merchantids = await getOrCreateMerchants(
      payoutList.map((payouts) => payouts.merchant)
    );

    const insertPayoutVar: InsertPayout[] = payoutList.map((payouts) => ({
      slug: payouts.slug,
      payoutId: payouts.payoutId,
      slugMerchant: payouts.slugMerchant,
      idMerchant:
        merchantids?.filter(
          (merchant) => payouts.merchant.slug === merchant.slug
        )[0]?.id || 0,
      rrn: payouts.rrn,
      transactionDate: payouts.transactionDate,
      productType: payouts.productType,
      type: payouts.type,
      brand: payouts.brand,
      installmentNumber: payouts.installmentNumber,
      installments: payouts.installments,
      installmentAmount:
        payouts.installmentAmount === null ||
        payouts.installmentAmount === undefined
          ? "0"
          : payouts.installmentAmount.toString(),
      transactionMdr:
        payouts.transactionMdr === null || payouts.transactionMdr === undefined
          ? "0"
          : payouts.transactionMdr.toString(),
      transactionMdrFee:
        payouts.transactionMdrFee === null ||
        payouts.transactionMdrFee === undefined
          ? "0"
          : payouts.transactionMdrFee.toString(),
      transactionFee:
        payouts.transactionFee === null || payouts.transactionFee === undefined
          ? "0"
          : payouts.transactionFee.toString(),
      settlementAmount:
        payouts.settlementAmount === null ||
        payouts.settlementAmount === undefined
          ? "0"
          : payouts.settlementAmount.toString(),
      expectedSettlementDate: new Date(payouts.expectedSettlementDate)
        .toISOString()
        .split("T")[0],
      status: payouts.status,
      receivableAmount:
        payouts.receivableAmount === null ||
        payouts.receivableAmount === undefined
          ? ""
          : payouts.receivableAmount.toString(),
      settlementDate: new Date(payouts.settlementDate)
        .toISOString()
        .split("T")[0],
      slugCustomer: payouts.slugCustomer,
      idCustomer:
        customerids?.filter(
          (customer) => payouts.customer.slug === customer.slug
        )[0]?.id || 0,
      effectivePaymentDate: new Date(payouts.effectivePaymentDate)
        .toISOString()
        .split("T")[0],
      settlementUniqueNumber:
        payouts.settlementUniqueNumber === null ||
        payouts.settlementUniqueNumber === undefined
          ? "0"
          : payouts.settlementUniqueNumber.toString(),
      anticipationAmount:
        payouts.anticipationAmount === null ||
        payouts.anticipationAmount === undefined
          ? "0"
          : payouts.anticipationAmount.toString(),
      anticipationBlockStatus: payouts.anticipationBlockStatus,
      slugMerchantSplit:
        payouts.slugMerchantSplit == null ? "" : payouts.slugMerchantSplit,
    }));

    await insertPayout(insertPayoutVar);
  } catch (error) {
    console.error(`Erro ao processar payout:`, error);
  }
}

export async function insertPayout(payoutList: InsertPayout[]) {
  try {
    const existingPayouts = await getIdBySlugs(
      "payout",
      payoutList.map((payouts) => payouts.slug)
    );

    const filteredList = payoutList.filter(
      (payouts) =>
        !existingPayouts?.some(
          (existingPayouts) => existingPayouts.slug === payouts.slug
        )
    );

    if (filteredList.length < 1) {
      console.log("todos os payouts já foram adicionados");
      return;
    }

    console.log("Inserting payout, quantity: ", filteredList.length);

    await db.insert(payout).values(filteredList);

    console.log("Payout inserted successfully.");
  } catch (error) {
    console.error("Error inserting Payout:", error);
  }
}

export async function getPayoutSyncConfig() {
  const maxDateResult = await db
    .select({ maxDate: max(payout.expectedSettlementDate) })
    .from(payout);

  const maxDate = maxDateResult[0]?.maxDate;

  console.log(maxDateResult[0]?.maxDate);
  return maxDateResult[0]?.maxDate;
}
