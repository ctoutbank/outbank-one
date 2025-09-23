import { EmptyState } from "@/components/empty-state";
import ExcelExport from "@/components/excelExport";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { MerchantDashboardContent } from "@/features/merchant/_components/merchant-dashboard-content";
import { MerchantFilter } from "@/features/merchant/_components/merchant-filter";
import ExcelImportButton from "@/features/merchant/_components/merchant-import";
import { MerchantSearchInput } from "@/features/merchant/_components/merchant-search-input";
import {
  getMerchants,
  getMerchantsWithDashboardData,
} from "@/features/merchant/server/merchant";
import {
  getMerchantsGroupedByRegion,
  getTransactionsGroupedByShift,
  getTransactionStatusData,
} from "@/features/merchant/server/merchant-dashboard";
import { getUserMerchantsAccess } from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import MerchantList from "../../../features/merchant/_components/merchant-list";

export const revalidate = 300;

type MerchantProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  status?: string;
  state?: string;
  establishment?: string;
  dateFrom?: string;
  email?: string;
  cnpj?: string;
  active?: string;
  salesAgent?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: Promise<MerchantProps>;
}) {
  await checkPagePermission("Estabelecimentos");

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.pageSize || "20");
  const search = resolvedSearchParams.search || "";

  const userAccess = await getUserMerchantsAccess();

  // Buscar todos os dados em uma única requisição
  const { merchants, dashboardData } = await getMerchantsWithDashboardData(
    search,
    page,
    pageSize,
    userAccess,
    resolvedSearchParams.establishment,
    resolvedSearchParams.status,
    resolvedSearchParams.state,
    resolvedSearchParams.dateFrom,
    resolvedSearchParams.email,
    resolvedSearchParams.cnpj,
    resolvedSearchParams.active,
    resolvedSearchParams.salesAgent,
    resolvedSearchParams.sortBy,
    resolvedSearchParams.sortOrder
  );

  // Buscar dados para exportação Excel
  const merchantsExcel = await getMerchants(
    search,
    1,
    50,
    userAccess,
    resolvedSearchParams.establishment,
    resolvedSearchParams.status,
    resolvedSearchParams.state,
    resolvedSearchParams.dateFrom,
    resolvedSearchParams.email,
    resolvedSearchParams.cnpj,
    resolvedSearchParams.active,
    resolvedSearchParams.salesAgent
  );

  const totalRecords = merchants.totalCount;

  const regionData = await getMerchantsGroupedByRegion(
    userAccess,
    search,
    resolvedSearchParams.establishment,
    resolvedSearchParams.status,
    resolvedSearchParams.state,
    resolvedSearchParams.dateFrom,
    resolvedSearchParams.email,
    resolvedSearchParams.cnpj,
    resolvedSearchParams.active,
    resolvedSearchParams.salesAgent
  );

  const shiftData = await getTransactionsGroupedByShift(
    userAccess,
    search,
    resolvedSearchParams.establishment,
    resolvedSearchParams.status,
    resolvedSearchParams.state,
    resolvedSearchParams.dateFrom,
    resolvedSearchParams.email,
    resolvedSearchParams.cnpj,
    resolvedSearchParams.active,
    resolvedSearchParams.salesAgent
  );

  const statusData = await getTransactionStatusData(
    userAccess,
    search,
    resolvedSearchParams.establishment,
    resolvedSearchParams.status,
    resolvedSearchParams.state,
    resolvedSearchParams.dateFrom,
    resolvedSearchParams.email,
    resolvedSearchParams.cnpj,
    resolvedSearchParams.active,
    resolvedSearchParams.salesAgent
  );

  // Transformar dados dos merchants para o formato de sugestões do autocomplete
  const merchantSuggestions = merchants.merchants.map((merchant) => ({
    id: merchant.merchantid,
    name: merchant.name,
    corporateName: merchant.corporate_name,
    slug: merchant.slug,
    idDocument: merchant.cnpj,
  }));

  const merchantData = {
    totalMerchants: merchants.totalCount,
    activeMerchants: merchants.active_count || 0,
    inactiveMerchants: merchants.inactive_count || 0,
    pendingKyc: merchants.pending_kyc_count || 0,
    approvedKyc: merchants.approved_kyc_count || 0,
    rejectedKyc: merchants.rejected_kyc_count || 0,
    totalCpAnticipation: merchants.cp_anticipation_count || 0,
    totalCnpAnticipation: merchants.cnp_anticipation_count || 0,
    // Dados para os gráficos
    registrationData: dashboardData.registrationData,
    registrationSummary: dashboardData.registrationSummary,
    transactionData: dashboardData.transactionData,
    typeData: dashboardData.typeData,
    regionData,
    shiftData,
    statusData,
  };

  const globalStyles = {
    header: {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "808080" },
      } as Fill,
      font: { color: { argb: "FFFFFF" }, bold: true } as Font,
    },
    row: {
      font: { color: { argb: "000000" } } as Font,
    },
  };

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Estabelecimentos", url: "/portal/merchants" },
        ]}
      />

      <BaseBody
        title="Estabelecimentos"
        subtitle={`Visualização de Todos os Estabelecimentos`}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex items-center gap-2 justify-between mb-1">
            <div className="flex items-center gap-2">
              <MerchantFilter
                establishmentIn={resolvedSearchParams.establishment}
                statusIn={resolvedSearchParams.status}
                stateIn={resolvedSearchParams.state}
                dateFromIn={resolvedSearchParams.dateFrom}
                emailIn={resolvedSearchParams.email}
                cnpjIn={resolvedSearchParams.cnpj}
                activeIn={resolvedSearchParams.active}
                salesAgentIn={resolvedSearchParams.salesAgent}
              />
              <MerchantSearchInput suggestions={merchantSuggestions} />
            </div>
            <div className="flex items-center gap-2">
              <ExcelImportButton />
              <ExcelExport
                data={merchantsExcel.merchants.map((merchant) => ({
                  "Nome Fantasia": merchant.name,
                  "Razão Social": merchant.corporate_name,
                  "CNPJ/CPF": merchant.cnpj,
                  Email: merchant.email,
                  Telefone: "(" + merchant.areaCode + ") " + merchant.number,
                  "Cadastrado Em": merchant.dtinsert,
                  "Tabela de Preços": merchant.priceTable,
                  Captura:
                    merchant.lockCpAnticipationOrder &&
                    merchant.lockCnpAnticipationOrder
                      ? "Ambos"
                      : merchant.lockCpAnticipationOrder
                        ? "CP - Cartão Presente"
                        : merchant.lockCnpAnticipationOrder
                          ? "CNP - Cartão Não Presente"
                          : "N/A",
                  PIX: merchant.hasPix ? "Sim" : "Não",
                  "Consultor de Vendas": merchant.salesAgentDocument,
                  "Status KYC": merchant.kic_status,
                  Ativo: merchant.active ? "Sim" : "Não",
                  "Data Descredenciamento": merchant.dtdelete,
                  Cidade: merchant.city,
                  Estado: merchant.state,
                  "Natureza Legal": merchant.legalNature,
                  MCC: merchant.MCC,
                  CNAE: merchant.CNAE,
                  "Usuário Cadastro": merchant.Inclusion,
                  "Data Ativação": merchant.dtupdate,
                }))}
                globalStyles={globalStyles}
                sheetName="Estabelecimentos"
                fileName={`ESTABELECIMENTOS-${new Date().toLocaleDateString()}`}
                onClick={undefined}
                hasDateFilter={true}
              />
              <Button asChild className="shrink-0">
                <Link href="/portal/merchants/0">
                  <Plus className="h-4 w-4" />
                  Novo Estabelecimento
                </Link>
              </Button>
            </div>
          </div>

          <MerchantDashboardContent {...merchantData} />

          <div className="mt-2">
            {merchants.merchants.length === 0 ? (
              <EmptyState
                icon={Search}
                title="Nenhum resultado encontrado"
                description=""
              />
            ) : (
              <MerchantList list={merchants} />
            )}
            {totalRecords > 0 && (
              <div className="mt-2">
                <PaginationWithSizeSelector
                  totalRecords={totalRecords}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchants"
                />
              </div>
            )}
          </div>
        </div>
      </BaseBody>
    </>
  );
}
