import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import {
  getCancelledTransactions,
  getRawTransactionsByDate,
  getTotalMerchants,
  getTotalTransactions,
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
import { CreditCard, Receipt, FileText } from "lucide-react";

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
    totalMerchants,
  ] = await Promise.all([
    getTotalTransactions(dateRange.start, dateRange.end),
    getRawTransactionsByDate(dateRange.start, dateRange.end),
    getCancelledTransactions(dateRange.start, dateRange.end),
    getTotalMerchants(),
  ]);
  
  return (
    <div className="w-full">
      <BarChartCustom
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

async function MetricsSection() {
  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <MetricCard
          icon={CreditCard}
          title="Vendas Débito"
          value="R$ 24.172.838,40"
          growth="18.5"
          color="blue"
        />
        <MetricCard
          icon={CreditCard}
          title="Vendas Crédito"
          value="R$ 3.672.131,80"
          growth="12.3"
          color="green"
        />
        <MetricCard
          icon={CreditCard}
          title="Vendas Pré Pago"
          value="R$ 1.911.338,20"
          growth="5.2"
          color="purple"
        />
        <MetricCard
          icon={Receipt}
          title="Vendas Pix"
          value="R$ 4.322.038,10"
          growth="2.1"
          color="orange"
        />
      </div>

      {/* Secondary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <MetricCard
          icon={Receipt}
          title="Voucher"
          value="R$ 1.125.331,90"
          growth="18.5"
          color="blue"
        />
        <MetricCard
          icon={FileText}
          title="Quantidade"
          value="278.987"
          growth="12.3"
          color="green"
        />
      </div>
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


export default async function SalesDashboard({
  searchParams,
}: {
  searchParams: Promise<{ dateFrom?: string; dateTo?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const defaultDateFrom = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00';
  const defaultDateTo = format(new Date(), "yyyy-MM-dd'T'HH:mm");
  const dateFrom = resolvedSearchParams.dateFrom || defaultDateFrom;
  const dateTo = resolvedSearchParams.dateTo || defaultDateTo;
  const dateRange = await normalizeDateRange(dateFrom, dateTo);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Dashboard", url: "/portal/dashboard" }]}
      />
      <BaseBody title="Dashboard" subtitle="Visão Geral das Vendas">
        <div className="space-y-6">
          {/* Line Chart Section */}
          <Suspense fallback={<ChartSkeleton />}>
            <ChartSection dateRange={dateRange} />
          </Suspense>

          {/* Metrics Cards */}
          <Suspense fallback={<CardsSkeleton />}>
            <MetricsSection />
          </Suspense>

          {/* Bottom Charts */}
          <Suspense fallback={<div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><ChartSkeleton /><ChartSkeleton /></div>}>
            <ChartsSection dateRange={dateRange} />
          </Suspense>
        </div>
      </BaseBody>
    </>
  );
}
