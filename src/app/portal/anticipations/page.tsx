import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnticipationListComponent from "@/features/anticipations/_components/anticipation-list";
import { AnticipationsListFilter } from "@/features/anticipations/_components/anticipations-filter";
import EventualAnticipationListComponent from "@/features/anticipations/_components/eventual-anticipation-list";
import { EventualAnticipationsListFilter } from "@/features/anticipations/_components/eventual-anticipations-filter";
import {
  getAnticipations,
  getEventualAnticipations,
  getMerchantDD,
} from "@/features/anticipations/server/anticipation";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Search } from "lucide-react";

export const revalidate = 0;

type AntecipationsProps = {
  page: string;
  pageSize: string;
  search: string;
  merchantSlug: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  expectedSettlementStartDate: string;
  expectedSettlementEndDate: string;
};

export default async function AntecipationsPage({
  searchParams,
}: {
  searchParams: AntecipationsProps;
}) {
  const search = searchParams.search || "";
  const page = searchParams.page || "1";
  const pageSize = searchParams.pageSize || "10";
  const merchantSlug = searchParams.merchantSlug || "";
  const type = searchParams.type || "";
  const status = searchParams.status || "";
  const startDate = searchParams.startDate || "";
  const endDate = searchParams.endDate || "";
  const expectedSettlementStartDate =
    searchParams.expectedSettlementStartDate || "";
  const expectedSettlementEndDate =
    searchParams.expectedSettlementEndDate || "";

  const merchantDD = await getMerchantDD();

  const anticipations = await getAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status
  );

  const eventualAnticipations = await getEventualAnticipations(
    search,
    Number(page),
    Number(pageSize),
    startDate,
    endDate,
    merchantSlug,
    type,
    status,
    expectedSettlementStartDate,
    expectedSettlementEndDate
  );

  await checkPagePermission("Antecipações de Recebíveis");

  return (
    <>
      <BaseHeader
        breadcrumbItems={[
          { title: "Antecipações", url: "/portal/anticipations" },
        ]}
      />

      <BaseBody
        title="Antecipações"
        subtitle={`visualização das antecipações`}
        className="overflow-x-hidden"
      >
        <Tabs defaultValue="compulsory" className="w-full">
          <TabsList>
            <TabsTrigger value="compulsory">COMPULSÓRIA</TabsTrigger>
            <TabsTrigger value="eventual">EVENTUAL</TabsTrigger>
            <TabsTrigger value="report">RELATÓRIO</TabsTrigger>
          </TabsList>
          <TabsContent value="compulsory" className="mt-6">
            <AnticipationsListFilter
              merchantDD={merchantDD}
              dateFromIn={startDate ? new Date(startDate) : undefined}
              dateToIn={endDate ? new Date(endDate) : undefined}
              merchantSlugIn={merchantSlug}
              typeIn={type}
              statusIn={status}
            />
            <div className="mb-4"></div>

            <div className="w-full overflow-x-auto">
              <AnticipationListComponent
                anticipations={anticipations}
              ></AnticipationListComponent>
              {anticipations.totalCount > 0 && (
                <PaginationRecords
                  totalRecords={anticipations.totalCount}
                  currentPage={Number(page)}
                  pageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="eventual" className="mt-6 ">
            <EventualAnticipationsListFilter
              merchantDD={merchantDD}
              dateFromIn={startDate ? new Date(startDate) : undefined}
              dateToIn={endDate ? new Date(endDate) : undefined}
              expectedSettlementDateFromIn={
                expectedSettlementStartDate
                  ? new Date(expectedSettlementStartDate)
                  : undefined
              }
              expectedSettlementDateToIn={
                expectedSettlementEndDate
                  ? new Date(expectedSettlementEndDate)
                  : undefined
              }
              merchantSlugIn={merchantSlug}
              typeIn={type}
              statusIn={status}
            />
            <div className="mb-4"></div>

            <div className="w-full overflow-x-auto">
              <EventualAnticipationListComponent
                anticipations={eventualAnticipations}
              ></EventualAnticipationListComponent>
              {eventualAnticipations.totalCount > 0 && (
                <PaginationRecords
                  totalRecords={eventualAnticipations.totalCount}
                  currentPage={Number(page)}
                  pageSize={Number(pageSize)}
                  pageName="portal/anticipations"
                />
              )}
            </div>
          </TabsContent>
          <TabsContent value="report" className="mt-6">
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
/*   {totalRecords > 0 && (
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/merchantAgenda"
              />
            )}*/
