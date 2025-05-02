import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Suspense } from "react";
import Loading from "./loading";

import ExcelExport from "@/components/excelExport";
import PaginationRecords from "@/components/pagination-Records";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdjustmentsListFilter } from "@/features/merchantAgenda/_components/merchantAgenda-adjustments-filter";
import MerchantAgendaAdjustmentList from "@/features/merchantAgenda/_components/merchantAgenda-adjustments-list";
import { AnticipationsListFilter } from "@/features/merchantAgenda/_components/merchantAgenda-anticipations-filter";
import MerchantAgendaAntecipationList from "@/features/merchantAgenda/_components/merchantAgenda-anticipations-list";
import { MerchantAgendaAnticipationsDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenda-dasboardAntecipation-content";
import { MerchantAgendaDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenda-dashboard-content";
import MerchantAgendaExcelExport from "@/features/merchantAgenda/_components/merchantAgenda-excel-export";
import { MerchantAgendaFilter } from "@/features/merchantAgenda/_components/merchantAgenda-filter";
import MerchantAgendaList from "@/features/merchantAgenda/_components/merchantAgenda-list";
import { getMerchantAgenda } from "@/features/merchantAgenda/server/merchantAgenda";
import { getMerchantAgendaAdjustment } from "@/features/merchantAgenda/server/merchantAgendaAdjustment";
import {
  getMerchantAgendaAnticipation,
  getMerchantAgendaAnticipationStats,
} from "@/features/merchantAgenda/server/merchantAgendaAntecipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";

export const revalidate = 0;

// Create TabChangeHandler in a separate file
import { TabChangeHandler } from "@/features/merchantAgenda/_components/tab-change-handler";

type MerchantAgendaProps = {
  page?: string;
  pageSize?: string;
  search?: string;
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
  const settlementDateFromIn = searchParams.settlementDateFrom
    ? new Date(searchParams.settlementDateFrom)
    : undefined;

  const settlementDateToIn = searchParams.settlementDateTo
    ? new Date(searchParams.settlementDateTo)
    : undefined;

  const saleDateFromIn = searchParams.saleDateFrom
    ? new Date(searchParams.saleDateFrom)
    : undefined;

  const saleDateToIn = searchParams.saleDateTo
    ? new Date(searchParams.saleDateTo)
    : undefined;

  const establishmentIn = searchParams.establishment || undefined;
  const nsuIn = searchParams.nsu || undefined;
  const statusIn = searchParams.status || undefined;
  const orderIdIn = searchParams.orderId || undefined;

  // Fetch data in parallel for better performance
  const [merchantAgenda, merchantAgendaAnticipation, merchantAgendaAdjustment] =
    await Promise.all([
      getMerchantAgenda(
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
      ),
      getMerchantAgendaAnticipation(search, page, pageSize, dateFrom, dateTo),
      getMerchantAgendaAdjustment(
        search,
        page,
        pageSize,
        dateFrom,
        dateTo,
        establishmentIn
      ),
    ]);

  const totalRecordsReceivables = merchantAgenda.totalCount;
  const totalRecordsAntecipations = merchantAgendaAnticipation.totalCount;
  const totalRecordsAdjustments = merchantAgendaAdjustment.totalCount;

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

  // Buscar dados para o dashboard
  const anticipationDashboardStats = await getMerchantAgendaAnticipationStats(
    dateFrom,
    dateTo,
    establishmentIn,
    statusIn,
    searchParams.cardBrand,
    searchParams.settlementDateFrom,
    searchParams.settlementDateTo,
    searchParams.saleDateFrom,
    searchParams.saleDateTo,
    nsuIn,
    orderIdIn
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
        className="overflow-x-visible"
      >
        <Suspense fallback={<Loading />}>
          <TabChangeHandler>
            <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
              <TabsTrigger value="anticipations">Antecipações</TabsTrigger>
              <TabsTrigger value="adjustment">Ajustes</TabsTrigger>
            </TabsList>
            <TabsContent value="receivables" className="overflow-x-visible">
              <div className="flex flex-col space-y-4 mt-2">
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex-1">
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
                  </div>
                  <div className="ml-2">
                    <MerchantAgendaExcelExport
                      dateFrom={dateFrom}
                      dateTo={dateTo}
                    />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 mb-2">
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
                <div className="mb-1 flex items-center justify-between">
                  <div className="flex-1">
                    <AnticipationsListFilter
                      settlementDateFromIn={settlementDateFromIn}
                      settlementDateToIn={settlementDateToIn}
                      saleDateFromIn={saleDateFromIn}
                      saleDateToIn={saleDateToIn}
                      establishmentIn={establishmentIn}
                      nsuIn={nsuIn}
                      statusIn={statusIn}
                      orderIdIn={orderIdIn}
                    />
                  </div>
                  <div className="ml-2">
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
                </div>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <MerchantAgendaAnticipationsDashboardContent
                    totalEstablishments={
                      anticipationDashboardStats.totalEstablishments
                    }
                    totalAnticipationRequests={
                      anticipationDashboardStats.totalAnticipationRequests
                    }
                    totalParcels={anticipationDashboardStats.totalParcels}
                    fullyAnticipatedParcels={
                      anticipationDashboardStats.fullyAnticipatedParcels
                    }
                    partiallyAnticipatedParcels={
                      anticipationDashboardStats.partiallyAnticipatedParcels
                    }
                    totalNetAnticipated={
                      anticipationDashboardStats.totalNetAnticipated
                    }
                    totalGrossAnticipated={
                      anticipationDashboardStats.totalGrossAnticipated
                    }
                    totalAnticipationFees={
                      anticipationDashboardStats.totalAnticipationFees
                    }
                    firstTransactionDate={
                      anticipationDashboardStats.firstTransactionDate
                    }
                    lastTransactionDate={
                      anticipationDashboardStats.lastTransactionDate
                    }
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
              <div className="flex flex-col space-y-4 mt-2">
                <div className="flex items-center justify-between gap-4 relative z-50">
                  <div className="flex items-start gap-4 flex-1">
                    <AdjustmentsListFilter
                      dateFromIn={dateFrom ? new Date(dateFrom) : undefined}
                      dateToIn={dateTo ? new Date(dateTo) : undefined}
                      establishmentIn={establishmentIn}
                    />
                  </div>
                  <ExcelExport
                    data={merchantAgendaAdjustment.merchantAgendaAdjustments.map(
                      (data) => ({
                        Merchant: data.merchantName,
                        PaymentDate: data.paymentDate,
                        Amount: data.amount,
                        Type: data.type,
                        Title: data.title,
                        Reason: data.reason,
                        AdjustmentType: data.adjustmentType,
                      })
                    )}
                    globalStyles={globalStyles}
                    sheetName="Conciliação de ajustes"
                    fileName={`CONCILIAÇÃO DE AJUSTES ${dateTo || ""}`}
                  />
                </div>
                <div className="w-full overflow-x-auto">
                  <MerchantAgendaAdjustmentList
                    merchantAgendaAdjustmentList={merchantAgendaAdjustment}
                  />
                </div>
                {totalRecordsAdjustments > 0 && (
                  <PaginationRecords
                    totalRecords={totalRecordsAdjustments}
                    currentPage={page}
                    pageSize={pageSize}
                    pageName="portal/merchantAgenda"
                  />
                )}
              </div>
            </TabsContent>
          </TabChangeHandler>
        </Suspense>
      </BaseBody>
    </>
  );
}
