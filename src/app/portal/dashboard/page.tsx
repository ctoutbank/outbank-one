import CardValue from "@/components/dashboard/cardValue";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import DashboardFilters from "./dashboard-filters";
import {
  getTotalTransactions,
  getTotalTransactionsByMonth,
} from "@/server/db/transaction";
import { BarChartCustom } from "./barChart";
import { gateDateByViewMode } from "@/lib/utils";
import { Suspense } from "react";

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "today";

  const { period, previousPeriod } = gateDateByViewMode(viewMode);
  console.log("period", period);
  console.log("previousPeriod", previousPeriod);

  const totalTransactions = await getTotalTransactions(
    period.from!,
    period.to!
  );
  const totalTransactionsPreviousPeriod = await getTotalTransactions(
    previousPeriod?.from!,
    previousPeriod?.to!
  );
  console.log(
    "totalTransactionsPreviousPeriod",
    totalTransactionsPreviousPeriod
  );

  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    period.from!,
    period.to!
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Sales Dashboard" subtitle={`Visão geral das vendas`}>
        <DashboardFilters
          dateRange={{
            from: period.from,
            to: period.to,
          }}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
            <CardValue
              title={`Bruto total `}
              description={`Total bruto das transações`}
              value={totalTransactions?.sum}
              percentage={(
                ((totalTransactions?.sum -
                  totalTransactionsPreviousPeriod?.sum) /
                  totalTransactionsPreviousPeriod?.sum) *
                100
              ).toFixed(2)}
              previousValue={totalTransactionsPreviousPeriod?.sum}
              valueType="currency"
            />
            <CardValue
              title={`Lucro total `}
              description={`Total de lucro realizado`}
              value={totalTransactions?.revenue}
              percentage={(
                ((totalTransactions?.revenue -
                  totalTransactionsPreviousPeriod?.revenue) /
                  totalTransactionsPreviousPeriod?.revenue) *
                100
              ).toFixed(2)}
              previousValue={totalTransactionsPreviousPeriod?.revenue}
              valueType="currency"
            />
            <CardValue
              title={`Transações realizadas `}
              description={`Total de transações realizadas`}
              value={totalTransactions?.count}
              percentage={(
                ((totalTransactions?.count -
                  totalTransactionsPreviousPeriod?.count) /
                  totalTransactionsPreviousPeriod?.count) *
                100
              ).toFixed(2)}
              previousValue={totalTransactionsPreviousPeriod?.count}
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
            <BarChartCustom chartData={totalTransactionsByMonth} />
          </div>
        </Suspense>
      </BaseBody>
    </>
  );
}
