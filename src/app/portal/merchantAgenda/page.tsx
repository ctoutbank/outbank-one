import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { EmptyState } from "@/components/empty-state";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FilterMerchantAgenda from "@/features/merchantAgenda/_components/filterMerchantAgenda";
import MerchantAgendaList from "@/features/merchantAgenda/_components/merchantAgenda-list";
import MerchantAgendaOverview from "@/features/merchantAgenda/_components/overview";
import {
  getMerchantAgenda,
  getMerchantAgendaExcelData,
  getMerchantAgendaInfo,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { Search } from "lucide-react";
import ExcelExport from "@/components/excelExport";
import { Fill, Font } from "exceljs";

export const revalidate = 0;

type MerchantAgendaProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  sortField?: string;
  sortOrder?: string;
  dateFrom?: string;
  dateTo?: string;
  establishment?: string;
  status?: string;
  cardBrand?: string;
  settlementDateFrom?: string;
  settlementDateTo?: string;
  expectedSettlementDateFrom?: string;
  expectedSettlementDateTo?: string;
};

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: MerchantAgendaProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const merchantAgenda = await getMerchantAgenda(
    search,
    page,
    pageSize,
    searchParams.dateFrom,
    searchParams.dateTo,
    searchParams.establishment,
    searchParams.status,
    searchParams.cardBrand,
    searchParams.settlementDateFrom,
    searchParams.settlementDateTo,
    searchParams.expectedSettlementDateFrom,
    searchParams.expectedSettlementDateTo
  );
  const totalRecords = merchantAgenda.totalCount;
  const merchantAgendaCard = await getMerchantAgendaInfo();
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
  const excelDataToExport = await getMerchantAgendaExcelData(
    dateFrom == undefined || dateFrom == null || dateFrom == ""
      ? "2025-01-13"
      : dateFrom,
    dateTo == undefined || dateFrom == null || dateFrom == ""
      ? "2025-02-13"
      : dateTo
  );

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Agenda dos Lojistas", url: "/portal/merchantAgenda" },
        ]}
      />

      <BaseBody
        title="Agenda dos Lojistas"
        subtitle={`Visualização da agenda dos Lojistas`}
        className="overflow-x-hidden"
      >
        <Tabs defaultValue="receivables" className="w-full">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
            <TabsTrigger value="anticipations">Antecipações</TabsTrigger>
            <TabsTrigger value="adjustment">Ajustes</TabsTrigger>
          </TabsList>
          <TabsContent value="receivables" className="overflow-x-hidden">
            <div className="flex justify-between w-full">
              <FilterMerchantAgenda
                dateFromIn={dateFrom ? new Date(dateFrom) : undefined}
                dateToIn={dateTo ? new Date(dateTo) : undefined}
                establishmentIn={searchParams.establishment}
                statusIn={searchParams.status}
                cardBrandIn={searchParams.cardBrand}
                settlementDateFromIn={searchParams.settlementDateFrom ? new Date(searchParams.settlementDateFrom) : undefined}
                settlementDateToIn={searchParams.settlementDateTo ? new Date(searchParams.settlementDateTo) : undefined}
                expectedSettlementDateFromIn={searchParams.expectedSettlementDateFrom ? new Date(searchParams.expectedSettlementDateFrom) : undefined}
                expectedSettlementDateToIn={searchParams.expectedSettlementDateTo ? new Date(searchParams.expectedSettlementDateTo) : undefined}
              />
            </div>
            <div className="mb-4 -mt-2">
              <MerchantAgendaOverview
                totalMerchant={Number(merchantAgendaCard.count || 0)}
                totalSales={Number(merchantAgendaCard.totalSettlementAmount || 0)}
                grossAmount={Number(merchantAgendaCard.totalSettlementAmount || 0)}
                taxAmount={Number(merchantAgendaCard.totalTaxAmount || 0)}
                settledInstallments={Number(merchantAgendaCard.totalSettlementAmount || 0)}
                pendingInstallments={0}
                date={new Date()}
                settledGrossAmount={Number(merchantAgendaCard.totalSettlementAmount || 0)}
                settledTaxAmount={Number(merchantAgendaCard.totalTaxAmount || 0)}
                anticipatedGrossAmount={0}
                anticipatedTaxAmount={0}
                toSettleInstallments={0}
                toSettleGrossAmount={0}
                toSettleTaxAmount={0}
              />
            </div>
            <div className="mb-4">
              <ExcelExport
                data={excelDataToExport.map((data) => ({
                  Merchant: data.merchant,
                  CNPJ: data.cnpj,
                  NSU: data.nsu,
                  SaleDate: data.saleDate,
                  Type: data.type,
                  Brand: data.brand,
                  Installments: data.installments,
                  InstallmentNumber: data.installmentNumber,
                  InstallmentValue: data.installmentValue,
                  TransactionMdr: data.transactionMdr,
                  TransactionMdrFee: data.transactionMdrFee,
                  TransactionFee: data.transactionFee,
                  SettlementAmount: data.settlementAmount,
                  ExpectedDate: data.expectedDate,
                  ReceivableAmount: data.receivableAmount,
                  SettlementDate: data.settlementDate,
                }))}
                globalStyles={globalStyles}
                sheetName="Conciliação de recebíveis"
                fileName={`CONCILIAÇÃO DE RECEBÍVEIS ${dateTo || ""}`}
              />
            </div>
            <div className="w-full overflow-x-auto">
              <MerchantAgendaList merchantAgendaList={merchantAgenda} />
            </div>
            {totalRecords > 0 && (
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/merchantAgenda"
              />
            )}
          </TabsContent>
          <TabsContent value="anticipations" className="mt-6">
            <EmptyState
              icon={Search}
              title={"Nenhum resultado encontrado"}
              description={""}
            />
          </TabsContent>
          <TabsContent value="adjustment" className="mt-6">
            <EmptyState
              icon={Search}
              title={"Nenhum resultado encontrado"}
              description={""}
            />
          </TabsContent>
        </Tabs>
      </BaseBody>
    </>
  );
}
