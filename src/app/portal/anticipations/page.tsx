// app/(portal)/anticipations/page.tsx
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

// --- NOVOS COMPONENTES DE LAYOUT (renomeie se já existirem) ---
import SaldoCard from "@/components/anticipations/SaldoCard";
import AutoAnticipationCard from "@/components/anticipations/AutoAnticipationCard";
import MonthlyHistoryChart from "@/components/anticipations/MonthlyHistoryChart";
import RequestHistoryTable from "@/components/anticipations/RequestHistoryTable";
import SimulatorCard from "@/components/anticipations/SimulatorCard";
// --------------------------------------------------------------

// ... imports de server actions
import {
  getAnticipations,
  getEventualAnticipations,
  getMerchantDD,
} from "@/features/anticipations/server/anticipation";

import { checkPagePermission } from "@/lib/auth/check-permissions";
import HeaderActions from "@/components/anticipations/header-actions";


export const revalidate = 300;



type AntecipationsProps = {
  page: string;
  pageSize: string;
  search: string;
  merchantSlug: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedSettlementStartDate: string;
  expectedSettlementEndDate: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export default async function AntecipationsPage({
  searchParams,
}: {
  searchParams: Promise<AntecipationsProps>;
}) {
  // 1. Permissões
  await checkPagePermission("Antecipações de Recebíveis");

  // 2. Resolução de query-string
  const resolvedSearchParams = await searchParams;

  const search = resolvedSearchParams.search || "";
  const page = resolvedSearchParams.page || "1";
  const pageSize = resolvedSearchParams.pageSize || "10";
  const merchantSlug = resolvedSearchParams.merchantSlug || "";
  const type = resolvedSearchParams.type || "";
  const status = resolvedSearchParams.status || "";
  const startDate = resolvedSearchParams.startDate || "";
  const endDate = resolvedSearchParams.endDate || "";
  const expectedSettlementStartDate =
    resolvedSearchParams.expectedSettlementStartDate || "";
  const expectedSettlementEndDate =
    resolvedSearchParams.expectedSettlementEndDate || "";
  const sortBy = resolvedSearchParams.sortBy;
  const sortOrder = resolvedSearchParams.sortOrder;

  // 3. Dados
  const [merchantDD, anticipationList] = await Promise.all([
    getMerchantDD(),
    getAnticipations(
      search,
      
      Number(page),
      Number(pageSize),
      startDate,
      endDate,
      merchantSlug,
      type,
      status,
      {sortBy, sortOrder}
    )
  ]);


  const eventualList = await getEventualAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status,
    expectedSettlementStartDate,
    expectedSettlementEndDate,
    { sortBy, sortOrder }
  );

  const rows = anticipationList.anticipations || [];
  const todayISO = new Date().toISOString().slice(0, 10);

  const available = rows
    .filter((a: any) => a.settledAt && a.settledAt.startsWith(todayISO))
    .reduce((s: number, a: any) => s + a.amount, 0);

  const processing = rows
    .filter((a: any) => a.status === "approved" && a.expectedSettleDate > todayISO) 
    .reduce((s, a) => s + a.amount, 0);

  const nextPayout = rows
      .filter((a: any) => a.status === "approved" && a.expectedSettleDate > todayISO)
      .map((a: any) => a.expectedSettleDate)
      .sort()[0] ?? "-";

  const monthlyTotals = Array.from({ length: 12 }, (_, m) => rows
      .filter((a: any) => a.settledAt && new Date(a.settledAt).getMonth() === m)
      .reduce((s, a) => s + a.amount, 0)
)

  const lastestRequest = [...rows]
      .sort((a: any, b: any) => 
        new Date(b.requestedAt).getTime() -
        new Date(a.requestedAt).getTime()  
      )
      .slice(0, 6);

  const autoRule = {
    dailyLimit: 1_000_000,
    creditTermDays: 1,
    enabled: rows.some((a: any) => a.type === "automatic"),
  };

  
  return (
    <>
      {/* Cabeçalho superior com breadcrumb */}
      <BaseHeader
        breadcrumbItems={[
          { title: "Antecipações", url: "/portal/anticipations" },
        ]}
      />

      {/* Conteúdo principal */}
      <BaseBody
        title="Antecipações"
        subtitle="Visualização das Antecipações"
        className="overflow-x-hidden"
      >
        {/* Ações do cabeçalho: filtros, nova solicitação */}
        <HeaderActions
          search={search}
          merchantSlug={merchantSlug}
          merchantDD={merchantDD}
          type={type}
          status={status}
          startDate={startDate}
          endDate={endDate}

        />
       

        {/* NOVA ÁREA DE DASHBOARD ─ estrutura no estilo da imagem */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Coluna esquerda (largura ~ 2/3 em telas ≥1024px)  */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            <SaldoCard 
              available={available}
              processing={processing}
              nextPayout={nextPayout}
              />               
            {/* Disponível / Processando */}
            <AutoAnticipationCard 
              limit={autoRule.dailyLimit}
              daysToSettle={autoRule.creditTermDays}
              enabled={autoRule.enabled}
            />      
            {/* Antecipação Automática */}
            <MonthlyHistoryChart totals={monthlyTotals}/>       
            {/* Gráfico barras: Jan → Dez */}
            <RequestHistoryTable 
            rows={lastestRequest}
            page={Number(page)}
            pageSize={Number(pageSize)}
            totalCount={anticipationList.totalCount}
            />       
            {/* Tabela de solicitações */}
          </div>

          {/* Coluna direita (simulador) */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            <SimulatorCard
              merchantSlug={merchantSlug}
              eventualAnticipations={eventualList} // (exemplo de parâmetro)
            />
          </div>
        </div>
      </BaseBody>
    </>
  );
}
