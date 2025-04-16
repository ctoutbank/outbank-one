"use server";

import { formatDateToAPIFilter } from "@/lib/utils";
import { getPayoutSyncConfig, insertPayoutAndRelations } from "./payout";
import { Payout, PayoutResponse } from "./types";

async function fetchPayout(offset: number, transactionDate: Date | undefined) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  let currentDate: Date;

  // Se não houver data de referência, usa uma data padrão
  if (!transactionDate) {
    currentDate = new Date("2024-09-05");
    console.log(
      "transaction date (default)",
      formatDateToAPIFilter(currentDate),
      offset
    );
  } else {
    currentDate = new Date(transactionDate);
  }

  // Se a data para buscar ultrapassar ontem, encerra a busca retornando null
  if (currentDate > yesterday) {
    console.log("Data ultrapassa ontem, encerrando busca.");
    return null;
  }

  const stringTransactionDate = formatDateToAPIFilter(currentDate);
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
  return { data, currentDate };
}

export async function syncPayouts() {
  try {
    console.log("Buscando payouts...");

    const payoutConfig = await getPayoutSyncConfig();
    // Se houver data sincronizada, usa como referência; caso contrário, define uma data anterior à primeira busca
    const lastSyncedDate: Date = payoutConfig
      ? new Date(payoutConfig)
      : new Date("2024-09-04");

    // Próxima data a ser sincronizada (avança 1 dia)
    const nextDateToSync = new Date(lastSyncedDate);
    nextDateToSync.setDate(nextDateToSync.getDate() + 1);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Se a próxima data ultrapassar ontem, não há nada para sincronizar
    if (nextDateToSync > yesterday) {
      console.log(
        "Data de sync ultrapassou a data de ontem, encerrando busca."
      );
      return;
    }

    let offset = 0;
    while (true) {
      const result = await fetchPayout(offset, nextDateToSync);
      // Se fetchPayout retornar null, significa que a data ultrapassou ontem
      if (!result) break;

      const { data } = result;
      const payouts: Payout[] = data.objects || [];

      // Insere os novos registros no banco
      await insertPayoutAndRelations(payouts);

      offset += payouts.length;
      // Se já buscou todos os registros para essa data, encerra o loop
      if (offset >= data.meta.total_count) {
        console.log(
          `Payouts do dia ${formatDateToAPIFilter(
            nextDateToSync
          )} processados com sucesso.`
        );
        break;
      }
    }
  } catch (error) {
    console.error("Erro ao processar payout:", error);
  }
}
