import { EmptyState } from "@/components/empty-state";
import ListFilter from "@/components/filter";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnticipationList from "@/features/anticipations/_components/anticipation-list";
import { checkPagePermission } from "@/lib/auth/check-permissions";
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
  const search = searchParams.search || "";

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
