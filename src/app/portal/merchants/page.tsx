import ExcelExport from "@/components/excelExport";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationWithSizeSelector from "@/components/pagination-with-size-selector";
import { Button } from "@/components/ui/button";
import { MerchantDashboardButton } from "@/features/merchant/_components/merchant-dashboard-button";
import { MerchantDashboardContent } from "@/features/merchant/_components/merchant-dashboard-content";
import { MerchantFilter } from "@/features/merchant/_components/merchant-filter";
import ExcelImportButton from "@/features/merchant/_components/merchant-import";
import { getMerchants } from "@/features/merchant/server/merchant";
import {
  getMerchantRegistrationsByPeriod,
  getMerchantRegistrationSummary,
  getMerchantTransactionData,
  getMerchantTypeData,
} from "@/features/merchant/server/merchant-dashboard";
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

  // Buscar dados dos merchants
  const merchants = await getMerchants(
    search,
    page,
    pageSize,
    searchParams.establishment,
    searchParams.status,
    searchParams.state
  );
  const merchantsExcel = await getMerchants(
    search,
    page,
    50,
    searchParams.establishment,
    searchParams.status,
    searchParams.state
  );
  const totalRecords = merchants.totalCount;

  // Buscar dados dos gráficos
  const registrationData = await getMerchantRegistrationsByPeriod();
  const registrationSummary = await getMerchantRegistrationSummary();
  const transactionData = await getMerchantTransactionData();
  const typeData = await getMerchantTypeData();

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
    registrationData,
    registrationSummary,
    transactionData,
    typeData,
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
      >
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <MerchantFilter
                establishmentIn={searchParams.establishment}
                statusIn={searchParams.status}
                stateIn={searchParams.state}
              />
              <MerchantDashboardButton>
                <div className="-ml-28">
                  <MerchantDashboardContent {...merchantData} />
                </div>
              </MerchantDashboardButton>
            </div>

            <div className="flex items-center gap-2 justify-end">
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
              />
              <Button asChild className="shrink-0">
                <Link href="/portal/merchants/0">
                  <Plus className="h-4 w-4" />
                  Novo Estabelecimento
                </Link>
              </Button>
            </div>
          </div>

          <MerchantList list={merchants} />
          {totalRecords > 0 && (
            <PaginationWithSizeSelector
              totalRecords={totalRecords}
              currentPage={page}
              pageSize={pageSize}
              pageName="portal/merchants"
            />
          )}
        </div>
      </BaseBody>
    </>
  );
}
