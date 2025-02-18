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
  getMerchantAgendaInfo,
} from "@/features/merchantAgenda/server/merchantAgenda";
import { Search } from "lucide-react";

export const revalidate = 0;

type MerchantAgendaProps = {
  page: string;
  pageSize: string;
  search: string;
  sortField?: string;
  sortOrder?: string;
};

export default async function MerchantAgendaPage({
  searchParams,
}: {
  searchParams: MerchantAgendaProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";
  const sortField = searchParams.sortField || "id";
  const sortOrder = (searchParams.sortOrder || "desc") as "asc" | "desc";

  const merchantAgenda = await getMerchantAgenda(
    search,
    page,
    pageSize,
    sortField,
    sortOrder
  );
  const totalRecords = merchantAgenda.totalCount;
  const merchantAgendaCard = await getMerchantAgendaInfo();

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
          <TabsContent value="receivables" className="mt-2 overflow-x-hidden">
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
