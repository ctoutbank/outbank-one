import CardValue from "@/components/dashboard/cardValue";

import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import DashboardFilters from "./dashboard-filters";
import {
  getTotalTransactions,
  getTotalTransactionsByMonth,
} from "@/server/db/transaction";
import { BarChartCustom } from "./barChart";

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { viewMode: string; dateFrom: string; dateTo: string };
}) {
  const viewMode = searchParams.viewMode || "semana";
  const dateFrom = searchParams.dateFrom
    ? new Date(searchParams.dateFrom)
    : new Date();
  const dateTo = searchParams.dateTo
    ? new Date(searchParams.dateTo)
    : new Date(new Date().setHours(23, 59, 0, 0));
  const totalTransactions = await getTotalTransactions(dateFrom, dateTo);
  const totalTransactionsByMonth = await getTotalTransactionsByMonth(
    dateFrom,
    dateTo
  );
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Sales Dashboard" subtitle={`Visão geral das vendas`}>
        <DashboardFilters
          viewMode={viewMode}
          dateRange={{
            from: dateFrom,
            to: dateTo,
          }}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
          <CardValue
            title={`Bruto total `}
            description={`Total bruto das transações`}
            value={totalTransactions?.sum}
            percentage={10}
            valueType="currency"
          />
          <CardValue
            title={`Lucro total `}
            description={`Total de lucro realizado`}
            value={totalTransactions?.sum * 0.08}
            percentage={-5}
            valueType="currency"
          />
          <CardValue
            title={`Transações realizadas `}
            description={`Total de transações realizadas`}
            value={totalTransactions?.count}
            percentage={10}
            valueType="number"
          />
          <CardValue
            title={`Estabelecimentos Cadastrados`}
            description={`Total de estabelecimentos cadastrados`}
            value={65}
            percentage={10}
            valueType="number"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-1">
          <BarChartCustom chartData={totalTransactionsByMonth} />
        </div>
      </BaseBody>
    </>
  );
}
