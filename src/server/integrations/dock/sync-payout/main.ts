"use server";

import { formatDateToAPIFilter } from "@/lib/utils";
import { getPayoutSyncConfig, insertPayoutAndRelations } from "./payout";
import { Payout, PayoutResponse } from "./types";

async function fetchPayout(offset: number, startDate: Date, endDate: Date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (startDate > today || endDate > today) {
    console.log("Intervalo de data ultrapassa hoje, encerrando busca.");
    return null;
  }

  const from = formatDateToAPIFilter(startDate);
  const to = formatDateToAPIFilter(endDate);

  console.log(`Buscando payouts entre ${from} e ${to}, offset: ${offset}`);

  const response = await fetch(
    `https://settlement.acquiring.dock.tech/v1/payouts/statement?transactionDate__goe=${from}&transactionDate__loe=${to}&limit=1000&offset=${offset}`,
    {
      headers: {
        Authorization: `${process.env.DOCK_API_KEY}`,
        "X-Customer": "B68046D590EB402288F90E1147B6BC9F",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar dados: ${response.statusText}`);
  }

  const data: PayoutResponse = await response.json();
  return { data, from, to };
}

export async function syncPayouts() {
  try {
    console.log("Iniciando sincronização de payouts...");

    const payoutConfig = await getPayoutSyncConfig();
    const lastSyncedDate = payoutConfig
      ? new Date(payoutConfig)
      : new Date("2024-09-05");

    lastSyncedDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(lastSyncedDate);
    nextDate.setDate(nextDate.getDate() + 1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let offset = 0;
    while (true) {
      const result = await fetchPayout(offset, lastSyncedDate, nextDate);
      if (!result) break;

      const { data } = result;
      const payouts: Payout[] = data.objects || [];

      await insertPayoutAndRelations(payouts);

      offset += payouts.length;
      if (offset >= data.meta.total_count) {
        console.log(
          `Payouts de ${formatDateToAPIFilter(
            lastSyncedDate
          )} a ${formatDateToAPIFilter(nextDate)} processados com sucesso.`
        );
        break;
      }
    }

    console.log("Sincronização concluída.");
  } catch (error) {
    console.error("Erro ao sincronizar payouts:", error);
  }
}