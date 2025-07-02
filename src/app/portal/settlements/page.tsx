import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import PaginationRecords from "@/components/pagination-Records";
import MerchantSettlementsList from "../../../features/settlements/_components/settlements-list";

import { EmptyState } from "@/components/empty-state";
import ExcelExport from "@/components/excelExport";
import PageSizeSelector from "@/components/page-size-selector";
import FinancialOverview from "@/features/settlements/_components/overview";
import {
  getMerchantSettlements,
  getSettlementBySlug,
} from "@/features/settlements/server/settlements";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { formatDate } from "@/lib/utils";
import { Fill, Font } from "exceljs";
import { Search } from "lucide-react";

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
  await checkPagePermission("Liquidação");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const settlementSlug = searchParams.settlementSlug || "";
  const merchantSettlements = await getMerchantSettlements(
    search,
    page,
    pageSize,
    settlementSlug
  );
  console.log(merchantSettlements);
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
        subtitle={`Visualização de Todas as Liquidações`}
        //actions={<SyncButton syncType="settlement" />}
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
                totalAdjustmentAmount: Number(
                  settlements.settlement[0]?.total_adjustment_amount || 0
                ),
              }}
            />
          </>
        )}
        {settlements.settlement.length > 0 && (
          <div className="relative">
            <div className="absolute top-5 right-0 z-10 ">
              <ExcelExport
                data={merchantSettlements.merchant_settlements.flatMap(
                  (settlement) =>
                    settlement.orders?.map((order) => ({
                      Name: order.corporatename,
                      CorporateName: order.corporatename,
                      FederalTAXID: order.documentid,
                      ISO: settlement.customerId,
                      Date: order.effectivepaymentdate,
                      ReceivableUnit: order.receivableUnit,
                      Amount: order.amount,
                      Bank: order.bank,
                      Agency: order.agency,
                      AccountNumber: order.accountnumber,
                      AccountType: order.accounttype,
                      EffectivePaymentDate: formatDate(
                        new Date(order.effectivepaymentdate)
                      ),
                      PaymentNumber: order.paymentnumber,
                      Status: order.status,
                      Lock: order.lock,
                      LockBank: "",
                      LockFederalTAXID: "",
                      LockAccountNumber: "",
                      LockAgency: "",
                      Identifier: order.settlementuniquenumber,
                    }))
                )}
                globalStyles={globalStyles}
                sheetName="Liquidação"
                fileName={
                  `LIQUIDAÇÕES ${settlements.settlement[0]?.payment_date}` || ""
                }
                onClick={undefined}
                hasDateFilter={true}
              />
            </div>
          </div>
        )}
        <ListFilter pageName="portal/settlements" search={search} />
        {merchantSettlements.merchant_settlements.length == 0 ? (
          <EmptyState
            icon={Search}
            title="Nenhum resultado encontrado"
            description=""
          />
        ) : (
          <>
            <MerchantSettlementsList
              merchantSettlementList={merchantSettlements}
            />

            {totalRecords > 0 && (
              <div className="flex items-center justify-between mt-4">
                <PageSizeSelector
                  currentPageSize={pageSize}
                  pageName="portal/settlements"
                />
                <PaginationRecords
                  totalRecords={totalRecords}
                  currentPage={page}
                  pageSize={pageSize}
                  pageName="portal/settlements"
                />
              </div>
            )}
          </>
        )}
      </BaseBody>
    </>
  );
}
