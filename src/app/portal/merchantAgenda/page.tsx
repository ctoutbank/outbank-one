import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { EmptyState } from "@/components/empty-state";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  page: string;
  pageSize: string;
  search: string;
  dateFrom: string;
  dateTo: string;
};

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: MerchantAgendaProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";

  const merchantAgenda = await getMerchantAgenda(search, page, pageSize);
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
        subtitle={`visualização da agenda dos Lojistas`}
        className="overflow-x-hidden"
      >
        <Tabs defaultValue="receivables" className="w-full">
          <TabsList className="border-b rounded-none w-full justify-start h-auto bg-transparent overflow-x-auto">
            <TabsTrigger
              value="receivables"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              RECEBÍVEIS
            </TabsTrigger>
            <TabsTrigger
              value="anticipations"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              ANTECIPAÇÕES
            </TabsTrigger>
            <TabsTrigger
              value="adjustment"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              AJUSTES
            </TabsTrigger>
          </TabsList>
          <TabsContent value="receivables" className="mt-6 overflow-x-hidden">
            <ListFilter pageName="portal/merchantAgenda" search={search} />
            <div className="mb-4">
              <MerchantAgendaOverview
                totalMerchant={Number(merchantAgendaCard.count || 0)}
                totalSales={Number(
                  merchantAgendaCard.totalSettlementAmount || 0
                )}
                grossAmount={Number(
                  merchantAgendaCard.totalSettlementAmount || 0
                )}
                taxAmount={Number(merchantAgendaCard.totalTaxAmount || 0)}
                settledInstallments={Number(
                  merchantAgendaCard.totalSettlementAmount || 0
                )}
                pendingInstallments={0}
                date={new Date()}
                settledGrossAmount={Number(
                  merchantAgendaCard.totalSettlementAmount || 0
                )}
                settledTaxAmount={Number(
                  merchantAgendaCard.totalTaxAmount || 0
                )}
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
            <MerchantAgendaList merchantAgendaList={merchantAgenda} />
            <div className="w-full overflow-x-auto">
              <MerchantAgendaList
                merchantAgendaList={merchantAgenda}
                sortField={sortField}
                sortOrder={sortOrder}
              />
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
            ></EmptyState>
          </TabsContent>
          <TabsContent value="adjustment" className="mt-6">
            <EmptyState
              icon={Search}
              title={"Nenhum resultado encontrado"}
              description={""}
            ></EmptyState>
          </TabsContent>
        </Tabs>
      </BaseBody>
    </>
  );
}
