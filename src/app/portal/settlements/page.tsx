import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import MerchantSettlementsList from "../../../features/settlements/_components/settlements-list";

import ExcelExport from "@/components/excelExport";
import FinancialOverview from "@/features/settlements/_components/overview";
import {
  getMerchantSettlements,
  getSettlementBySlug,
} from "@/features/settlements/server/settlements";
import { Alignment, Fill, Font } from "exceljs";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

type CategoryProps = {
  page: string;
  pageSize: string;
  search: string;
  settlementSlug: string;
};

export default async function SettlementsPage({
  searchParams,
}: {
  searchParams: CategoryProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const settlementSlug = searchParams.settlementSlug || "";
  const merchantSettlements = await getMerchantSettlements(
    search,
    page,
    pageSize,
    settlementSlug
  );
  const settlements = await getSettlementBySlug(settlementSlug);
  const totalRecords = merchantSettlements.totalCount;
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
        breadcrumbItems={[{ title: "Liquidações", url: "/portal/settlements" }]}
      />

      <BaseBody
        title="Liquidações"
        subtitle={`Visualização de todas as Liquidações`}
      >
        {settlements.settlement.length > 0 && (
          <>
            <FinancialOverview
              financialOverviewProps={{
                date:
                  new Date(settlements.settlement[0].payment_date || "") ||
                  new Date(),
                grossSalesAmount: Number(
                  settlements.settlement[0]?.batch_amount || 0
                ),
                netAnticipationsAmount: Number(
                  settlements.settlement[0]?.total_anticipation_amount || 0
                ),
                restitutionAmount: Number(
                  settlements.settlement[0]?.total_restitution_amount || 0
                ),
                settlementAmount: Number(
                  settlements.settlement[0]?.total_settlement_amount || 0
                ),
                creditStatus: settlements.settlement[0].credit_status || "",
                debitStatus: settlements.settlement[0].debit_status || "",
                anticipationStatus:
                  settlements.settlement[0].anticipation_status || "",
                pixStatus: settlements.settlement[0].pix_status || "",
              }}
            />
          </>
        )}
        <div className="relative">
         <div className="absolute top-4 right-0 z-10">
            <ExcelExport
              data={merchantSettlements.merchant_settlements.flatMap(
                (settlement) =>
                  settlement.orders?.map((order) => ({
                    Name: order.corporateName,
                    CorporateName: order.corporateName,
                    FederalTAXID: order.documentId,
                    ISO: settlement.customerId,
                    Date: order.effectivePaymentDate,
                    ReceivableUnit: order.receivableUnit,
                    Amount: order.amount,
                    Bank: order.bank,
                    Agency: order.agency,
                    AccountNumber: order.accountNumber,
                    AccountType: order.accountType,
                    EffectivePaymentDate: formatDate(
                      new Date(order.effectivePaymentDate)
                    ),
                    PaymentNumber: order.paymentNumber,
                    Status: order.status,
                    Lock: order.lock,
                    LockBank: "",
                    LockFederalTAXID: "",
                    LockAccountNumber: "",
                    LockAgency: "",
                    Identifier: order.settlementUniqueNumber,
                  }))
              )}
              globalStyles={globalStyles}
              sheetName="Liquidação"
              fileName={
                `LIQUIDAÇÕES ${settlements.settlement[0]?.payment_date}` || ""
              }
            />
            </div>
            </div>
        <ListFilter pageName="portal/settlements" search={search} />
        {merchantSettlements.merchant_settlements.length == 0 ? (
          <div className="flex justify-center items-center mt-10">
            Nenhum item encontrado
          </div>
        ) : (
          <>
            <MerchantSettlementsList
              merchantSettlementList={merchantSettlements}
            />

            {totalRecords > 0 && (
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/settlements"
              ></PaginationRecords>
            )}
          </>
        )}
      </BaseBody>
    </>
  );
}
