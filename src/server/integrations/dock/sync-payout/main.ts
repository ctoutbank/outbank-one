"use server";

import { formatDateToAPIFilter } from "@/lib/utils";
import { getPayoutSyncConfig, insertPayoutAndRelations } from "./payout";
import { Payout, PayoutResponse } from "./types";

async function fetchPayout(
  offset: number,
  expectedSettlementDate: Date | undefined
) {
  let stringExpectedSettlementDate = "";
  if (
    expectedSettlementDate === undefined ||
    expectedSettlementDate === null 
  ) {
    stringExpectedSettlementDate = "2024-09-05";
  } else {
    stringExpectedSettlementDate = formatDateToAPIFilter(
      expectedSettlementDate
    );
  }

  const response = await fetch(
    `https://settlement.acquiring.dock.tech/v1/payouts/statement?expectedSettlementDate=${stringExpectedSettlementDate}&limit=1000&offset=${offset}`,
    {
      headers: {
        Authorization: `eyJraWQiOiJJTlRFR1JBVElPTiIsInR5cCI6IkpXVCIsImFsZyI6IkhTNTEyIn0.eyJpc3MiOiJGNDBFQTZCRTQxMUM0RkQwODVDQTBBMzJCQUVFMTlBNSIsInNpcCI6IjUwQUYxMDdFMTRERDQ2RTJCQjg5RkE5OEYxNTI2M0RBIn0.7OLleTv9B-68LXORK4FOOgk7L6zl1-NZmh6GZ86V9Dk_4PhmT63qikAivP3ftCA9pKqyJt2v2J2Ds6HDGTb5ug`,
        "X-Customer": "B68046D590EB402288F90E1147B6BC9F",
      },
    }
  );

  console.log(response);
  if (!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const data: PayoutResponse = await response.json();
  return data;
}

export async function main() {
  try {
    console.log("Buscando payouts...");

    const payoutConfig = await getPayoutSyncConfig();
    console.log(payoutConfig);

    let offset = payoutConfig.count || 0;
    let expectedSettlementDate = payoutConfig.lastExpectedSettlementDate
      ? new Date(payoutConfig.lastExpectedSettlementDate)
      : undefined;

    while (true) {
      const response = await fetchPayout(offset, expectedSettlementDate);
      const payouts: Payout[] = response.objects || [];

      // Insere no banco os novos registros
      await insertPayoutAndRelations(payouts);

      // Atualiza o offset e verifica se há mais registros para essa data
      offset += payouts.length;
      if (offset >= response.meta.total_count) {
        // Se terminamos essa data, avançamos para o dia seguinte
        expectedSettlementDate = new Date(
          (expectedSettlementDate ?? new Date()).getTime() + 1000 * 60 * 60 * 24
        );
        offset = 0;
      }

      if (expectedSettlementDate) {
        if (
          expectedSettlementDate.toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
        ) {
          break;
        }
      }
    }
  } catch (error) {
    console.error("Erro ao processar payout:", error);
  } finally {
  }
}
