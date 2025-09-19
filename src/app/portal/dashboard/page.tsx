import { TransactionSummaryCards } from "@/app/portal/dashboard/_components/transaction-cards";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getCancelledTransactions,
  getRawTransactionsByDate,
  getTotalMerchants,
  getTotalTransactions,
  getTotalTransactionsByMonth,
  getTransactionsDashboardTotals,
  getPaymentMethodDistribution,
  getTerminalTransactions,
  normalizeDateRange,
} from "@/features/transactions/serverActions/transaction";
import { format } from "date-fns";
import { Suspense } from "react";
import { BarChartCustom } from "./_components/barChart";
import { MetricCard } from "./_components/metric-card";
import { PaymentMethodPieChart } from "./_components/pie-chart";
import { TerminalBarChart } from "./_components/terminal-bar-chart";
import { CardsSkeleton, ChartSkeleton } from "./loading";
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 300;

async function ChartSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [
    totalTransactions,
    totalTransactionsByDay,
    canceledTransactions,
    totalTransactionsByMonth,
    totalMerchants,
  ] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getRawTransactionsByDate(dateRange.start, dateRange.end),
    getCancelledTransactions(dateRange.start, dateRange.end),
    getTotalTransactionsByMonth(dateRange.start, dateRange.end, "custom"),
    getTotalMerchants(),
  ]);
  
  return (
    <div className="w-full">
      <BarChartCustom
        chartData={totalTransactionsByMonth}
        transactionsData={totalTransactionsByDay}
        viewMode="custom"
        totalTransactions={totalTransactions[0]}
        totalMerchants={
          Array.isArray(totalMerchants) ? totalMerchants[0]?.total || 0 : 0
        }
        dateRange={{ start: dateRange.start, end: dateRange.end }}
        canceledTransactions={canceledTransactions[0]?.count || 0}
      />
    </div>
  );
}

async function MetricsSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [totalTransactions, totalMerchants, canceledTransactions] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getTotalMerchants(),
    getCancelledTransactions(dateRange.start, dateRange.end),
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Vendas Débito"
        value={formatCurrency(24172838.40)}
        subtitle="Transações débito"
        growthPercentage={18.5}
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        color="blue"
      />
      <MetricCard
        title="Vendas Crédito"
        value={formatCurrency(3672131.80)}
        subtitle="Transações crédito"
        growthPercentage={12.3}
        icon={<CreditCard className="h-6 w-6 text-green-600" />}
        color="green"
      />
      <MetricCard
        title="Vendas Pré Pago"
        value={formatCurrency(1911338.20)}
        subtitle="Transações pré-pagas"
        growthPercentage={5.2}
        icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
        color="purple"
      />
      <MetricCard
        title="Vendas Pix"
        value={formatCurrency(4322038.10)}
        subtitle="Transações PIX"
        growthPercentage={2.1}
        icon={<Users className="h-6 w-6 text-orange-600" />}
        color="orange"
      />
      <MetricCard
        title="Voucher"
        value={formatCurrency(1125331.90)}
        subtitle="Vouchers emitidos"
        growthPercentage={18.5}
        icon={<DollarSign className="h-6 w-6 text-blue-600" />}
        color="blue"
      />
      <MetricCard
        title="Outros"
        value="278.987"
        subtitle="Outras transações"
        growthPercentage={0}
        icon={<CreditCard className="h-6 w-6 text-gray-600" />}
        color="gray"
      />
    </div>
  );
}

async function ChartsSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const [paymentMethodData, terminalData] = await Promise.all([
    getPaymentMethodDistribution(dateRange.start, dateRange.end),
    getTerminalTransactions(dateRange.start, dateRange.end),
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <PaymentMethodPieChart data={paymentMethodData} />
      <TerminalBarChart data={terminalData} />
    </div>
  );
}

async function CardsSection({
  dateRange,
}: {
  dateRange: { start: string; end: string };
}) {
  const transactions = await getTransactionsDashboardTotals(
    dateRange.start,
    dateRange.end
  );
  return <TransactionSummaryCards transactions={transactions} />;
}

export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: { dateFrom?: string; dateTo?: string };
}) {
  const defaultDateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00';
  const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const dateFrom = searchParams.dateFrom || defaultDateFrom;
  const dateTo = searchParams.dateTo || defaultDateTo;
  const dateRange = await normalizeDateRange(dateFrom, dateTo);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Dashboard" subtitle="Visão Geral das Vendas">
        <div className="space-y-8">
          {/* Header Section with Total and Filters */}
          <div className="flex justify-between items-center bg-white p-6 rounded-lg border">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total de Vendas</p>
              <p className="text-3xl font-bold text-gray-900">R$ 24.172.838,40</p>
            </div>
            <div className="flex gap-4">
              <select className="px-4 py-2 border rounded-lg bg-white text-sm">
                <option>Todos os Períodos</option>
              </select>
              <select className="px-4 py-2 border rounded-lg bg-white text-sm">
                <option>Todas as Formas</option>
              </select>
            </div>
          </div>

          {/* Main Chart */}
          <Suspense fallback={<ChartSkeleton />}>
            <ChartSection dateRange={dateRange} />
          </Suspense>

          {/* Metrics Cards - 2x3 Grid */}
          <Suspense fallback={<CardsSkeleton />}>
            <MetricsSection dateRange={dateRange} />
          </Suspense>

          {/* Additional Charts */}
          <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ChartSkeleton /><ChartSkeleton /></div>}>
            <ChartsSection dateRange={dateRange} />
          </Suspense>

        </div>
      </BaseBody>
    </>
  );
}
