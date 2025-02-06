import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import Categorylist from "../../../features/categories/_components/categories-list";
import PaginationRecords from "@/components/pagination-Records";
import { getCategories } from "@/features/categories/server/category";
import MerchantAgendaList from "@/features/merchantAgenda/_components/merchantAgenda-list";
import MerchantAgendaOverview from "@/features/merchantAgenda/_components/overview";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getMerchantAgenda } from "@/features/merchantAgenda/server/merchantAgenda";

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
      >
        <Tabs defaultValue="receivables" className="w-full">
          <TabsList className="border-b rounded-none w-full justify-start h-auto bg-transparent">
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
          <TabsContent value="receivables" className="mt-6">
            <ListFilter pageName="portal/merchantAgenda" search={search} />
            <div className="mb-4">
              <MerchantAgendaOverview
                totalSales={0}
                totalAmount={0}
                grossAmount={0}
                taxAmount={0}
                settledInstallments={0}
                pendingInstallments={0}
                date={new Date()}
                settledGrossAmount={0}
                settledTaxAmount={0}
                anticipatedGrossAmount={0}
                anticipatedTaxAmount={0}
                toSettleInstallments={0}
                toSettleGrossAmount={0}
                toSettleTaxAmount={0}
              />
            </div>
            <MerchantAgendaList
              merchantAgendaList={merchantAgenda}
              sortField={sortField}
              sortOrder={sortOrder}
            />
          </TabsContent>
          <TabsContent value="anticipations" className="mt-6"></TabsContent>
          <TabsContent value="adjustment" className="mt-6"></TabsContent>
        </Tabs>

        {totalRecords > 0 && (
          <PaginationRecords
            totalRecords={totalRecords}
            currentPage={page}
            pageSize={pageSize}
            pageName="portal/merchantAgenda"
          />
        )}
      </BaseBody>
    </>
  );
}
