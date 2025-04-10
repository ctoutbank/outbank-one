"use server";

import { formatDateToAPIFilter } from "@/lib/utils";
import { getPayoutSyncConfig, insertPayoutAndRelations } from "./payout";
import { Payout, PayoutResponse } from "./types";

async function fetchPayout(offset: number, transactionDate: Date | undefined) {
  let stringTransactionDate = "";
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let nextDay: Date | undefined = undefined;

  if (transactionDate === undefined || transactionDate === null) {
    stringTransactionDate = "2024-09-05";

    console.log("transaction date", stringTransactionDate, offset);
  } else if (transactionDate == yesterday) {
    stringTransactionDate = formatDateToAPIFilter(yesterday);
  } else {
    nextDay = new Date(transactionDate);
    nextDay.setDate(nextDay.getDate() + 1);
    console.log("nextDay", nextDay, transactionDate);
    stringTransactionDate = formatDateToAPIFilter(nextDay);

    console.log("transaction date", stringTransactionDate, offset);
  }
  console.log("fetching", stringTransactionDate, offset, transactionDate);

  const response = await fetch(
    `https://settlement.acquiring.dock.tech/v1/payouts/statement?transactionDate=${stringTransactionDate}&limit=1000&offset=${offset}`,
    {
      headers: {
        Authorization: `${process.env.DOCK_API_KEY}`,
        "X-Customer": "B68046D590EB402288F90E1147B6BC9F",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data: PayoutResponse = await response.json();
  if (data.meta.total_count === 0 && nextDay) {
    fetchPayout(0, nextDay);
  }
  return data;
}

export async function syncPayouts() {
  try {
    console.log("Buscando payouts...");

    const payoutConfig = await getPayoutSyncConfig();

    let offset = 0;
    const transactionDate = payoutConfig ? new Date(payoutConfig) : undefined;
    console.log("transactionDate", transactionDate);

    while (true) {
      const response = await fetchPayout(offset, transactionDate);
      const payouts: Payout[] = response.objects || [];

      // Insere no banco os novos registros
      await insertPayoutAndRelations(payouts);

      // Atualiza o offset e verifica se há mais registros para essa data
      offset += payouts.length;
      if (offset >= response.meta.total_count) {
        console.log("payouts adicionados");
        break;
      }
    }
  } catch (error) {
    console.error("Erro ao processar payout:", error);
  } finally {
  }
}
