"use client";

import ExcelExport from "@/components/excelExport";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdjustmentsListFilter } from "@/features/merchantAgenda/_components/merchantAgenda-adjustments-filter";
import MerchantAgendaAdjustmentList from "@/features/merchantAgenda/_components/merchantAgenda-adjustments-list";
import { AnticipationsListFilter } from "@/features/merchantAgenda/_components/merchantAgenda-anticipations-filter";
import MerchantAgendaAntecipationList from "@/features/merchantAgenda/_components/merchantAgenda-anticipations-list";
import { MerchantAgendaAnticipationsDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenda-dasboardAntecipation-content";
import { MerchantAgendaDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenda-dashboard-content";
import { MerchantAgendaFilter } from "@/features/merchantAgenda/_components/merchantAgenda-filter";
import MerchantAgendaList from "@/features/merchantAgenda/_components/merchantAgenda-list";
import { MerchantAdjustmentsDashboardContent } from "@/features/merchantAgenda/_components/merchantAgenta-adjustments-dashboard-content";
import { TabChangeHandler } from "@/features/merchantAgenda/_components/tab-change-handler";
import { MerchantAgendaListType } from "@/features/merchantAgenda/server/merchantAgenda";
import {
  AdjustmentDashboardStats,
  MerchantAgendaAdjustment,
  MerchantAgendaAdjustmentListType,
} from "@/features/merchantAgenda/server/merchantAgendaAdjustment";
import {
  AnticipationDashboardStats,
  MerchantAgendaAnticipationList,
} from "@/features/merchantAgenda/server/merchantAgendaAntecipation";
import { Fill, Font } from "exceljs";
import { useState } from "react";

export type SearchParams = {
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
  page?: string;
  pageSize?: string;
};

export type MerchantAgendaTabsProps = {
  merchantAgenda: MerchantAgendaListType;
  merchantAgendaAnticipation: MerchantAgendaAnticipationList;
  merchantAgendaAdjustment: MerchantAgendaAdjustmentListType;
  anticipationDashboardStats: AnticipationDashboardStats;
  adjustmentDashboardStats: AdjustmentDashboardStats;
};

type MerchantAgendaTabsPropsSearchParams = MerchantAgendaTabsProps & {
  searchParams: SearchParams;
};

export function MerchantAgendaTabs({
  merchantAgendaTabsProps,
}: {
  merchantAgendaTabsProps: MerchantAgendaTabsPropsSearchParams;
}) {
  const page = parseInt(merchantAgendaTabsProps.searchParams.page || "1");
  const pageSize = parseInt(
    merchantAgendaTabsProps.searchParams.pageSize || "10"
  );
  const dateFrom = merchantAgendaTabsProps.searchParams.dateFrom || "";
  const dateTo = merchantAgendaTabsProps.searchParams.dateTo || "";
  console.log("dateTo", dateTo);
  const settlementDateFromIn = merchantAgendaTabsProps.searchParams
    .settlementDateFrom
    ? new Date(merchantAgendaTabsProps.searchParams.settlementDateFrom)
    : undefined;

  const settlementDateToIn = merchantAgendaTabsProps.searchParams
    .settlementDateTo
    ? new Date(merchantAgendaTabsProps.searchParams.settlementDateTo)
    : undefined;

  const saleDateFromIn = merchantAgendaTabsProps.searchParams.saleDateFrom
    ? new Date(merchantAgendaTabsProps.searchParams.saleDateFrom)
    : undefined;

  const saleDateToIn = merchantAgendaTabsProps.searchParams.saleDateTo
    ? new Date(merchantAgendaTabsProps.searchParams.saleDateTo)
    : undefined;

  const establishmentIn =
    merchantAgendaTabsProps.searchParams.establishment || undefined;
  const nsuIn = merchantAgendaTabsProps.searchParams.nsu || undefined;
  const statusIn = merchantAgendaTabsProps.searchParams.status || undefined;
  const orderIdIn = merchantAgendaTabsProps.searchParams.orderId || undefined;

  // Fetch data in parallel for better performance
  const merchantAgenda = merchantAgendaTabsProps.merchantAgenda;
  const merchantAgendaAnticipation =
    merchantAgendaTabsProps.merchantAgendaAnticipation;
  const merchantAgendaAdjustment =
    merchantAgendaTabsProps.merchantAgendaAdjustment;

  // Buscar dados para o dashboard
  const anticipationDashboardStats =
    merchantAgendaTabsProps.anticipationDashboardStats;

  // Buscar dados para o dashboard de ajustes
  const adjustmentDashboardStats =
    merchantAgendaTabsProps.adjustmentDashboardStats;

  const totalRecordsReceivables =
    merchantAgendaTabsProps.merchantAgenda.totalCount;
  const totalRecordsAntecipations =
    merchantAgendaTabsProps.merchantAgendaAnticipation.totalCount;
  const totalRecordsAdjustments =
    merchantAgendaTabsProps.merchantAgendaAdjustment.totalCount;

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

  const [activeTab, setActiveTab] = useState("receivables");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <TabChangeHandler>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {activeTab === "receivables" ? (
              <MerchantAgendaFilter
                dateFromIn={dateFrom}
                dateToIn={dateTo}
                establishmentIn={establishmentIn}
                statusIn={statusIn}
                cardBrandIn={merchantAgendaTabsProps.searchParams.cardBrand}
                settlementDateFromIn={settlementDateFromIn?.toISOString()}
                settlementDateToIn={settlementDateToIn?.toISOString()}
                expectedSettlementDateFromIn={
                  merchantAgendaTabsProps.searchParams
                    .expectedSettlementDateFrom
                }
                expectedSettlementDateToIn={
                  merchantAgendaTabsProps.searchParams.expectedSettlementDateTo
                }
              />
            ) : activeTab === "anticipations" ? (
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
            ) : (
              <AdjustmentsListFilter
                dateFromIn={dateFrom ? new Date(dateFrom) : undefined}
                dateToIn={dateTo ? new Date(dateTo) : undefined}
                establishmentIn={establishmentIn}
              />
            )}

            <TabsList className="flex h-9 items-center rounded-lg bg-muted p-1 text-muted-foreground">
              <TabsTrigger
                value="receivables"
                onClick={() => handleTabChange("receivables")}
              >
                Recebíveis
              </TabsTrigger>
              <TabsTrigger
                value="anticipations"
                onClick={() => handleTabChange("anticipations")}
              >
                Antecipações
              </TabsTrigger>
              <TabsTrigger
                value="adjustment"
                onClick={() => handleTabChange("adjustment")}
              >
                Ajustes
              </TabsTrigger>
            </TabsList>
          </div>
          <div>
            {activeTab === "receivables" ? (
              <ExcelExport
                data={merchantAgenda.merchantAgenda.map((data) => ({
                  Merchant: data.merchant,
                  NSU: data.rnn,
                  SaleDate: data.effectivePaymentDate,
                  Type: data.type,
                  Brand: data.brand,
                  InstallmentNumber: data.installmentNumber,
                  Installments: data.installments,
                  GrossAmount: data.grossAmount,
                  FeePercentage: data.feePercentage,
                  FeeAmount: data.feeAmount,
                  NetAmount: data.netAmount,
                  ExpectedSettlementDate: data.expectedSettlementDate,
                  SettledAmount: data.settledAmount,
                  SettlementDate: data.settlementDate,
                  EffectivePaymentDate: data.effectivePaymentDate,
                  PaymentNumber: data.paymentNumber,
                }))}
                hasDateFilter={
                  (!!merchantAgendaTabsProps.searchParams.dateFrom &&
                    !!merchantAgendaTabsProps.searchParams.dateTo) ||
                  (!!merchantAgendaTabsProps.searchParams.settlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams.settlementDateTo) ||
                  (!!merchantAgendaTabsProps.searchParams
                    .expectedSettlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams
                      .expectedSettlementDateTo)
                }
                globalStyles={globalStyles}
                sheetName="Conciliação de recebíveis"
                fileName={`CONCILIAÇÃO DE RECEBÍVEIS ${dateTo || ""}`}
              />
            ) : activeTab === "anticipations" ? (
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
                hasDateFilter={
                  (!!merchantAgendaTabsProps.searchParams.dateFrom &&
                    !!merchantAgendaTabsProps.searchParams.dateTo) ||
                  (!!merchantAgendaTabsProps.searchParams.settlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams.settlementDateTo) ||
                  (!!merchantAgendaTabsProps.searchParams
                    .expectedSettlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams
                      .expectedSettlementDateTo)
                }
                globalStyles={globalStyles}
                sheetName="Conciliação de antecipações"
                fileName={`CONCILIAÇÃO DE ANTECIPAÇÕES ${dateTo || ""}`}
              />
            ) : (
              <ExcelExport
                data={merchantAgendaAdjustment.merchantAgendaAdjustments.map(
                  (data: MerchantAgendaAdjustment) => ({
                    Merchant: data.merchantName,
                    PaymentDate: data.paymentDate,
                    Amount: data.amount,
                    Type: data.type,
                    Title: data.title,
                    Reason: data.reason,
                    AdjustmentType: data.adjustmentType,
                  })
                )}
                hasDateFilter={
                  (!!merchantAgendaTabsProps.searchParams.dateFrom &&
                    !!merchantAgendaTabsProps.searchParams.dateTo) ||
                  (!!merchantAgendaTabsProps.searchParams.settlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams.settlementDateTo) ||
                  (!!merchantAgendaTabsProps.searchParams
                    .expectedSettlementDateFrom &&
                    !!merchantAgendaTabsProps.searchParams
                      .expectedSettlementDateTo)
                }
                globalStyles={globalStyles}
                sheetName="Conciliação de ajustes"
                fileName={`CONCILIAÇÃO DE AJUSTES ${dateTo || ""}.xlsx`}
              />
            )}
          </div>
        </div>
        <TabsContent value="receivables" className="overflow-x-visible">
          <div className="flex flex-col space-y-4 mt-2">
            <div className="flex items-start justify-between gap-4 mb-2">
              <MerchantAgendaDashboardContent
                totalMerchant={merchantAgenda.aggregates.total_merchants}
                date={new Date()}
                totalSales={merchantAgenda.aggregates.total_sales}
                grossAmount={merchantAgenda.aggregates.gross_amount}
                taxAmount={merchantAgenda.aggregates.fee_amount}
                settledInstallments={
                  merchantAgenda.aggregates.total_installments
                }
                pendingInstallments={
                  merchantAgenda.merchantAgenda.filter(
                    (item) => !item.settlementDate
                  ).length
                }
                settledGrossAmount={merchantAgenda.aggregates.net_amount}
                settledTaxAmount={merchantAgenda.aggregates.fee_amount}
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
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
                <PaginationRecords
                  totalRecords={totalRecordsReceivables}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="anticipations" className="mt-6">
          <div className="flex flex-col space-y-4 mt-2">
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
                settlementDateFrom={
                  merchantAgendaTabsProps.searchParams.settlementDateFrom
                }
                settlementDateTo={
                  merchantAgendaTabsProps.searchParams.settlementDateTo
                }
                saleDateFrom={merchantAgendaTabsProps.searchParams.saleDateFrom}
                saleDateTo={merchantAgendaTabsProps.searchParams.saleDateTo}
              />
            </div>

            <div className="w-full overflow-x-auto">
              <MerchantAgendaAntecipationList
                merchantAgendaAnticipationList={merchantAgendaAnticipation}
              />
            </div>

            {totalRecordsAntecipations > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
                <PaginationRecords
                  totalRecords={totalRecordsAntecipations}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="adjustment" className="mt-6">
          <div className="flex flex-col space-y-4 mt-2">
            <div className="flex items-start justify-between gap-4 mb-2">
              <MerchantAdjustmentsDashboardContent
                totalAdjustments={adjustmentDashboardStats.totalAdjustments}
                totalSettledAdjustments={
                  adjustmentDashboardStats.totalSettledAdjustments
                }
                totalSettledAdjustmentsValue={
                  adjustmentDashboardStats.totalSettledAdjustmentsValue
                }
                settledCreditAdjustments={
                  adjustmentDashboardStats.settledCreditAdjustments
                }
                settledCreditAdjustmentsValue={
                  adjustmentDashboardStats.settledCreditAdjustmentsValue
                }
                settledDebitAdjustments={
                  adjustmentDashboardStats.settledDebitAdjustments
                }
                settledDebitAdjustmentsValue={
                  adjustmentDashboardStats.settledDebitAdjustmentsValue
                }
                totalPartiallySettledAdjustments={
                  adjustmentDashboardStats.totalPartiallySettledAdjustments
                }
                totalPartiallySettledAdjustmentsValue={
                  adjustmentDashboardStats.totalPartiallySettledAdjustmentsValue
                }
                partiallySettledCreditAdjustments={
                  adjustmentDashboardStats.partiallySettledCreditAdjustments
                }
                partiallySettledCreditAdjustmentsValue={
                  adjustmentDashboardStats.partiallySettledCreditAdjustmentsValue
                }
                partiallySettledDebitAdjustments={
                  adjustmentDashboardStats.partiallySettledDebitAdjustments
                }
                partiallySettledDebitAdjustmentsValue={
                  adjustmentDashboardStats.partiallySettledDebitAdjustmentsValue
                }
                totalPendingAdjustments={
                  adjustmentDashboardStats.totalPendingAdjustments
                }
                totalPendingAdjustmentsValue={
                  adjustmentDashboardStats.totalPendingAdjustmentsValue
                }
                pendingCreditAdjustments={
                  adjustmentDashboardStats.pendingCreditAdjustments
                }
                pendingCreditAdjustmentsValue={
                  adjustmentDashboardStats.pendingCreditAdjustmentsValue
                }
                pendingDebitAdjustments={
                  adjustmentDashboardStats.pendingDebitAdjustments
                }
                pendingDebitAdjustmentsValue={
                  adjustmentDashboardStats.pendingDebitAdjustmentsValue
                }
                firstTransactionDate={
                  adjustmentDashboardStats.firstTransactionDate
                }
                lastTransactionDate={
                  adjustmentDashboardStats.lastTransactionDate
                }
              />
            </div>
            <div className="w-full overflow-x-auto">
              <MerchantAgendaAdjustmentList
                merchantAgendaAdjustmentList={merchantAgendaAdjustment}
              />
            </div>

            {totalRecordsAdjustments > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
                <PaginationRecords
                  totalRecords={totalRecordsAdjustments}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/merchantAgenda"
                />
              </div>
            )}
          </div>
        </TabsContent>
      </TabChangeHandler>
    </div>
  );
}
