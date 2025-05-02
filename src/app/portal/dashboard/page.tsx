import CardValue from "@/components/dashboard/cardValue";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getTotalTransactions,
  getTotalTransactionsByMonth,
} from "@/features/transactions/serverActions/transaction";
import { gateDateByViewMode } from "@/lib/utils";
import { Suspense } from "react";
import { BarChartCustom } from "./_components/barChart";
import DashboardFilters from "./_components/dashboard-filters";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "today";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  console.log(previousPeriod, period);
  const totalTransactions = await getTotalTransactions(period.from!, period.to);

  const totalTransactionsPreviousPeriod = await getTotalTransactions(
    previousPeriod.from,
    previousPeriod.to
  );

  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    period.from!,
    period.to!,
    viewMode
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Painel de Vendas" subtitle={`Visão geral das vendas`}>
        <div className="mb-4 ml-1">
          <DashboardFilters
            dateRange={{
              from: period.from,
              to: period.to,
            }}
          />
        </div>
        <Suspense fallback={<div>Carregando...</div>}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <CardValue
              title={`Bruto total `}
              description={`Total bruto das transações`}
              value={totalTransactions[0]?.sum || 0}
              percentage={
                totalTransactions[0]?.sum &&
                totalTransactionsPreviousPeriod[0]?.sum
                  ? (
                      ((totalTransactions[0]?.sum -
                        totalTransactionsPreviousPeriod[0]?.sum) /
                        totalTransactionsPreviousPeriod[0]?.sum) *
                      100
                    ).toFixed(2)
                  : "0"
              }
              previousValue={totalTransactionsPreviousPeriod[0]?.sum}
              valueType="currency"
            />
            <CardValue
              title={`Lucro total `}
              description={`Total de lucro realizado`}
              value={totalTransactions[0]?.revenue || 0}
              percentage={
                totalTransactions[0]?.revenue &&
                totalTransactionsPreviousPeriod[0]?.revenue
                  ? (
                      ((totalTransactions[0]?.revenue -
                        totalTransactionsPreviousPeriod[0]?.revenue) /
                        totalTransactionsPreviousPeriod[0]?.revenue) *
                      100
                    ).toFixed(2)
                  : "0"
              }
              previousValue={totalTransactionsPreviousPeriod[0]?.revenue}
              valueType="currency"
            />
            <CardValue
              title={`Transações realizadas `}
              description={`Total de transações realizadas`}
              value={totalTransactions[0]?.count || 0}
              percentage={
                totalTransactionsPreviousPeriod[0]?.count &&
                totalTransactions[0]?.count
                  ? (
                      ((totalTransactions[0]?.count -
                        totalTransactionsPreviousPeriod[0]?.count) /
                        totalTransactionsPreviousPeriod[0]?.count) *
                      100
                    ).toFixed(2)
                  : "0"
              }
              previousValue={totalTransactionsPreviousPeriod[0]?.count}
              valueType="number"
            />
            <CardValue
              title={`Estabelecimentos Cadastrados`}
              description={`Total de estabelecimentos cadastrados`}
              value={65}
              percentage={"-50"}
              previousValue={30}
              valueType="number"
            />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
            <BarChartCustom
              chartData={totalTransactionsByMonth}
              viewMode={viewMode}
            />
          </div>
        </Suspense>
      </BaseBody>
    </>
  );
}
