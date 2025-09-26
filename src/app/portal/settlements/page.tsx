import { EmptyState } from "@/components/empty-state";
import ExcelExport from "@/components/excelExport";
import ListFilter from "@/components/filter";
import { PageHeader } from "@/components/layout/portal/PageHeader";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FinancialOverview from "@/features/settlements/_components/overview";
import MerchantSettlementsList from "@/features/settlements/_components/settlements-list";
import {
  getMerchantSettlements,
  getSettlementBySlug,
} from "@/features/settlements/server/settlements";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { formatDate } from "@/lib/utils";
import type { Fill, Font } from "exceljs";
import { Search } from "lucide-react";

export const revalidate = 300;

type SettlementsPageProps = {
  searchParams: {
    page?: string;
    pageSize?: string;
    search?: string;
    settlementSlug?: string;
    sortBy?: string;
    sortOrder?: string;
  };
};

export default async function SettlementsPage({
  searchParams,
}: SettlementsPageProps) {
  await checkPagePermission("Liquidação");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const settlementSlug = searchParams.settlementSlug || "";
  const sortBy = searchParams.sortBy || "id";
  const sortOrder =
    searchParams.sortOrder === "asc" || searchParams.sortOrder === "desc"
      ? searchParams.sortOrder
      : "asc";

  const [merchantSettlements, settlements] = await Promise.all([
    getMerchantSettlements(search, page, pageSize, settlementSlug, {
      sortBy,
      sortOrder,
    }),
    getSettlementBySlug(settlementSlug),
  ]);

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
    <div className="space-y-8">
      <PageHeader
        title="Liquidações"
        description="Visualize os detalhes das suas liquidações."
      />

      {settlements.settlement.length > 0 && (
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
      )}

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>Detalhes da Liquidação</CardTitle>
              <CardDescription>
                Visualize e filtre os pagamentos individuais da liquidação.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <ListFilter pageName="portal/settlements" search={search} />
              {settlements.settlement.length > 0 && (
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
                  hasDateFilter={true}
                />
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {merchantSettlements.merchant_settlements.length == 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description="Nenhum pagamento encontrado para esta liquidação."
            />
          ) : (
            <MerchantSettlementsList
              merchantSettlementList={merchantSettlements}
            />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}