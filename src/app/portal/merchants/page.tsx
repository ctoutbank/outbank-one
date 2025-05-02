import ExcelExport from "@/components/excelExport";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { MerchantDashboardContent } from "@/features/merchant/_components/merchant-dashboard-content";
import { MerchantFilter } from "@/features/merchant/_components/merchant-filter";
import ExcelImportButton from "@/features/merchant/_components/merchant-import";
import {
  getMerchants,
  getMerchantsWithDashboardData,
} from "@/features/merchant/server/merchant";
import { SyncButton } from "@/features/sync/syncButton";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";
import { Plus } from "lucide-react";
import Link from "next/link";
import MerchantList from "../../../features/merchant/_components/merchant-list";

export const revalidate = 0;

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
};

export default async function MerchantsPage({
  searchParams,
}: {
  searchParams: MerchantProps;
}) {
  await checkPagePermission("Estabelecimentos");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";

  // Buscar todos os dados em uma única requisição
  const { merchants, dashboardData } = await getMerchantsWithDashboardData(
    search,
    page,
    pageSize,
    searchParams.establishment,
    searchParams.status,
    searchParams.state,
    searchParams.dateFrom,
    searchParams.email,
    searchParams.cnpj,
    searchParams.active,
    searchParams.salesAgent
  );

  // Buscar dados para exportação Excel
  const merchantsExcel = await getMerchants(
    search,
    1,
    50,
    searchParams.establishment,
    searchParams.status,
    searchParams.state,
    searchParams.dateFrom,
    searchParams.email,
    searchParams.cnpj,
    searchParams.active,
    searchParams.salesAgent
  );

  const totalRecords = merchants.totalCount;

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
        subtitle={`Visualização de todos os estabelecimentos`}
        actions={<SyncButton syncType="merchants" />}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between mb-1">
            <MerchantFilter
              establishmentIn={searchParams.establishment}
              statusIn={searchParams.status}
              stateIn={searchParams.state}
              dateFromIn={searchParams.dateFrom}
              emailIn={searchParams.email}
              cnpjIn={searchParams.cnpj}
              activeIn={searchParams.active}
              salesAgentIn={searchParams.salesAgent}
            />
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
            <MerchantList list={merchants} />
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
