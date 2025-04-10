import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { EmptyState } from "@/components/empty-state";
import ExcelExport from "@/components/excelExport";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MerchantAgendaAntecipationList from "@/features/merchantAgenda/_components/merchantAgenda-anticipations-list";
import { MerchantAgendaDashboardButton } from "@/features/merchantAgenda/_components/merchantAgenda-dashboard-button";
import { MerchantAgendaDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenda-dashboard-content";
import { MerchantAgendaFilter } from "@/features/merchantAgenda/_components/merchantAgenda-filter";
import MerchantAgendaList from "@/features/merchantAgenda/_components/merchantAgenda-list";
import {
  getMerchantAgenda,
  getMerchantAgendaExcelData,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { getMerchantAgendaAnticipation } from "@/features/merchantAgenda/server/merchantAgendaAntecipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";
import { Search } from "lucide-react";

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
  saleDateFrom?: string;
  saleDateTo?: string;
  nsu?: string;
  orderId?: string;
};

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: MerchantAgendaProps;
}) {
  await checkPagePermission("Agenda Lojista");

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
  const totalRecordsReceivables = merchantAgenda.totalCount;
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
  const excelDataToExportReceivables = await getMerchantAgendaExcelData(
    dateFrom == undefined || dateFrom == null || dateFrom == ""
      ? "2025-01-13"
      : dateFrom,
    dateTo == undefined || dateFrom == null || dateFrom == ""
      ? "2025-02-13"
      : dateTo
  );
  const merchantAgendaAnticipation = await getMerchantAgendaAnticipation(
    search,
    page,
    pageSize,
    dateFrom,
    dateTo
  );
  const totalRecordsAntecipations = merchantAgendaAnticipation.totalCount;

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
        className="overflow-x-visible"
      >
        <Tabs defaultValue="receivables" className="w-full">
          <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
            <TabsTrigger value="anticipations">Antecipações</TabsTrigger>
            <TabsTrigger value="adjustment">Ajustes</TabsTrigger>
          </TabsList>
          <TabsContent value="receivables" className="overflow-x-visible">
            <div className="flex flex-col space-y-4 mt-2">
              <div className="flex items-center justify-between gap-4 relative z-50">
                <div className="flex items-start gap-4 flex-1">
                  <MerchantAgendaFilter
                    dateFromIn={dateFrom}
                    dateToIn={dateTo}
                    establishmentIn={searchParams.establishment}
                    statusIn={searchParams.status}
                    cardBrandIn={searchParams.cardBrand}
                    settlementDateFromIn={searchParams.settlementDateFrom}
                    settlementDateToIn={searchParams.settlementDateTo}
                    expectedSettlementDateFromIn={
                      searchParams.expectedSettlementDateFrom
                    }
                    expectedSettlementDateToIn={
                      searchParams.expectedSettlementDateTo
                    }
                  />
                  <MerchantAgendaDashboardButton>
                    <div className="ml-1">
                      <MerchantAgendaDashboardContent
                        totalMerchant={merchantAgenda.merchantAgenda.length}
                        date={new Date()}
                        totalSales={merchantAgenda.merchantAgenda.length}
                        grossAmount={merchantAgenda.merchantAgenda.reduce(
                          (acc, item) => acc + item.grossAmount,
                          0
                        )}
                        taxAmount={merchantAgenda.merchantAgenda.reduce(
                          (acc, item) => acc + item.feeAmount,
                          0
                        )}
                        settledInstallments={
                          merchantAgenda.merchantAgenda.filter(
                            (item) => item.settlementDate
                          ).length
                        }
                        pendingInstallments={
                          merchantAgenda.merchantAgenda.filter(
                            (item) => !item.settlementDate
                          ).length
                        }
                        settledGrossAmount={merchantAgenda.merchantAgenda
                          .filter((item) => item.settlementDate)
                          .reduce((acc, item) => acc + item.grossAmount, 0)}
                        settledTaxAmount={merchantAgenda.merchantAgenda
                          .filter((item) => item.settlementDate)
                          .reduce((acc, item) => acc + item.feeAmount, 0)}
                        anticipatedGrossAmount={0} // Add logic for anticipated amounts if available
                        anticipatedTaxAmount={0} // Add logic for anticipated amounts if available
                        toSettleInstallments={
                          merchantAgenda.merchantAgenda.filter(
                            (item) => !item.settlementDate
                          ).length
                        }
                        toSettleGrossAmount={merchantAgenda.merchantAgenda
                          .filter((item) => !item.settlementDate)
                          .reduce((acc, item) => acc + item.grossAmount, 0)}
                        toSettleTaxAmount={merchantAgenda.merchantAgenda
                          .filter((item) => !item.settlementDate)
                          .reduce((acc, item) => acc + item.feeAmount, 0)}
                      />
                    </div>
                  </MerchantAgendaDashboardButton>
                </div>
                <ExcelExport
                  data={excelDataToExportReceivables.map((data) => ({
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
              {totalRecordsReceivables > 0 && (
                <PaginationRecords
                  totalRecords={totalRecordsReceivables}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="anticipations" className="mt-6">
            <div className="flex flex-col space-y-4 mt-2">
              <div className="flex items-center justify-between gap-4 relative z-50">
                <div className="flex items-start gap-4 flex-1"></div>
                <ExcelExport
                  data={merchantAgendaAnticipation.merchantAgendaAnticipations.map(
                    (data) => ({
                      Merchant: data.merchantName,
                      NSU: data.rrn,
                      SaleDate: data.effectivePaymentDate,
                      Type: data.type,
                      Brand: data.brand,
                      InstallmentNumber: data.installmentNumber,
                      InstallmentValue: data.installmentAmount,
                      TransactionMdr: data.transactionMdr,
                      TransactionMdrFee: data.transactionMdrFee,
                      SettlementAmount: data.settlementAmount,
                      ExpectedDate: data.expectedSettlementDate,
                      AnticipationAmount: data.anticipatedAmount,
                      AnticipationCode: data.anticipationCode,
                    })
                  )}
                  globalStyles={globalStyles}
                  sheetName="Conciliação de antecipações"
                  fileName={`CONCILIAÇÃO DE ANTECIPAÇÕES ${dateTo || ""}`}
                />
              </div>
              <div className="w-full overflow-x-auto">
                <MerchantAgendaAntecipationList
                  merchantAgendaAnticipationList={merchantAgendaAnticipation}
                />
              </div>
              {totalRecordsAntecipations > 0 && (
                <PaginationRecords
                  totalRecords={totalRecordsAntecipations}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
              )}
            </div>
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
