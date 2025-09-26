import { EmptyState } from "@/components/empty-state";
import ExcelExport from "@/components/excelExport";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LazyMerchantDashboard } from "@/components/lazy/LazyMerchantDashboard";
import { MerchantFilter } from "@/features/merchant/_components/merchant-filter";
import ExcelImportButton from "@/features/merchant/_components/merchant-import";
import { MerchantSearchInput } from "@/features/merchant/_components/merchant-search-input";
import MerchantList from "@/features/merchant/_components/merchant-list";
import {
  getMerchants,
  getMerchantsWithDashboardData,
} from "@/features/merchant/server/merchant";
import { getAllMerchantDashboardData } from "@/features/merchant/server/merchant-dashboard";
import { getUserMerchantsAccess } from "@/features/users/server/users";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import type { Fill, Font } from "exceljs";
import { Plus, Search } from "lucide-react";
import Link from "next/link";

export const revalidate = 300;

type MerchantProps = {
  searchParams: {
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
};

export default async function MerchantsPage({ searchParams }: MerchantProps) {
  await checkPagePermission("Estabelecimentos");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";

  const userAccess = await getUserMerchantsAccess();

  const { merchants, dashboardData } = await getMerchantsWithDashboardData(
    search,
    page,
    pageSize,
    userAccess,
    searchParams.establishment,
    searchParams.status,
    searchParams.state,
    searchParams.dateFrom,
    searchParams.email,
    searchParams.cnpj,
    searchParams.active,
    searchParams.salesAgent,
    searchParams.sortBy,
    searchParams.sortOrder
  );

  const merchantsExcel = await getMerchants(
    search, 1, 50, userAccess, searchParams.establishment,
    searchParams.status, searchParams.state, searchParams.dateFrom,
    searchParams.email, searchParams.cnpj, searchParams.active,
    searchParams.salesAgent
  );

  const totalRecords = merchants.totalCount;

  const { regionData, shiftData, statusData } = await getAllMerchantDashboardData(
    userAccess, search, searchParams.establishment, searchParams.status,
    searchParams.state, searchParams.dateFrom, searchParams.email,
    searchParams.cnpj, searchParams.active, searchParams.salesAgent
  );

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
    registrationData: dashboardData.registrationData,
    registrationSummary: dashboardData.registrationSummary,
    transactionData: dashboardData.transactionData,
    typeData: dashboardData.typeData,
    regionData, shiftData, statusData,
  };

  const globalStyles = {
    header: {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } } as Fill,
      font: { color: { argb: "FFFFFF" }, bold: true } as Font,
    },
    row: { font: { color: { argb: "000000" } } as Font },
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Estabelecimentos"
        description="Gerencie seus estabelecimentos comerciais."
      >
        <div className="flex items-center gap-2">
          <ExcelImportButton />
          <ExcelExport
            data={merchantsExcel.merchants.map((merchant) => ({
              "Nome Fantasia": merchant.name, "Razão Social": merchant.corporate_name,
              "CNPJ/CPF": merchant.cnpj, Email: merchant.email,
              Telefone: `(${merchant.areaCode}) ${merchant.number}`,
              "Cadastrado Em": merchant.dtinsert, "Tabela de Preços": merchant.priceTable,
              Captura: merchant.lockCpAnticipationOrder && merchant.lockCnpAnticipationOrder ? "Ambos"
                : merchant.lockCpAnticipationOrder ? "CP - Cartão Presente"
                : merchant.lockCnpAnticipationOrder ? "CNP - Cartão Não Presente" : "N/A",
              PIX: merchant.hasPix ? "Sim" : "Não", "Consultor de Vendas": merchant.salesAgentDocument,
              "Status KYC": merchant.kic_status, Ativo: merchant.active ? "Sim" : "Não",
              "Data Descredenciamento": merchant.dtdelete, Cidade: merchant.city,
              Estado: merchant.state, "Natureza Legal": merchant.legalNature,
              MCC: merchant.MCC, CNAE: merchant.CNAE, "Usuário Cadastro": merchant.Inclusion,
              "Data Ativação": merchant.dtupdate,
            }))}
            globalStyles={globalStyles} sheetName="Estabelecimentos"
            fileName={`ESTABELECIMENTOS-${new Date().toLocaleDateString()}`}
            hasDateFilter={true}
          />
          <Button asChild className="shrink-0">
            <Link href="/portal/merchants/0">
              <Plus className="h-4 w-4 mr-2" />
              Novo Estabelecimento
            </Link>
          </Button>
        </div>
      </PageHeader>

      <LazyMerchantDashboard {...merchantData} />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Estabelecimentos</CardTitle>
          <CardDescription>
            Filtre e visualize todos os estabelecimentos cadastrados.
          </CardDescription>
          <div className="mt-4 flex items-center gap-2">
            <MerchantSearchInput suggestions={merchantSuggestions} />
            <MerchantFilter
              establishmentIn={searchParams.establishment}
              statusIn={searchParams.status} stateIn={searchParams.state}
              dateFromIn={searchParams.dateFrom} emailIn={searchParams.email}
              cnpjIn={searchParams.cnpj} activeIn={searchParams.active}
              salesAgentIn={searchParams.salesAgent}
            />
          </div>
        </CardHeader>
        <CardContent>
          {merchants.merchants.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <MerchantList list={merchants} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter>
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/merchants"
            />
          </CardFooter>
        )}
      </Card>
    </div>
  );
}