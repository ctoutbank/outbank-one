import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";

import { EmptyState } from "@/components/empty-state";
import PaginationRecords from "@/components/pagination-Records";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnticipationList from "@/features/anticipations/_components/anticipation-list";
import {
  getMerchantAgenda
} from "@/features/merchantAgenda/server/merchantAgenda";
import { Search } from "lucide-react";

export const revalidate = 0;

type AntecipationsProps = {
  page: string;
  pageSize: string;
  search: string;
};

export default async function AntecipationsPage({
  searchParams,
}: {
  searchParams: AntecipationsProps;
}) {
  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "5");
  const search = searchParams.search || "";

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
          <TabsList className="border-b rounded-none w-full justify-start h-auto bg-transparent overflow-x-auto">
            <TabsTrigger
              value="compulsory"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              COMPULSÓRIA
            </TabsTrigger>
            <TabsTrigger
              value="eventual"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              EVENTUAL
            </TabsTrigger>
            <TabsTrigger
              value="report"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-2"
            >
              RELATÓRIO
            </TabsTrigger>
          </TabsList>
          <TabsContent value="compulsory" className="mt-6 overflow-x-hidden">
            <ListFilter pageName="portal/merchantAgenda" search={search} />
            <div className="mb-4"></div>

            <div className="w-full overflow-x-auto">
              <AnticipationList></AnticipationList>
            </div>
          </TabsContent>
          <TabsContent value="eventual" className="mt-6">
            <EmptyState
              icon={Search}
              title={"Nenhum resultado encontrado"}
              description={""}
            ></EmptyState>
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
