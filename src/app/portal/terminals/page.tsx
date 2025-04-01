import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PaginationRecords from "@/components/pagination-Records";
import PageSizeSelector from "@/components/page-size-selector";
import { TerminalsFilter } from "@/features/terminals/_components/terminals-filter";
import TerminalsList from "@/features/terminals/_components/terminals-list";
import { getTerminals } from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";

type TerminalsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
};

export default async function TerminalsPage({
  searchParams,
}: {
  searchParams: TerminalsProps;
}) {
  await checkPagePermission("Terminais");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";

  // Buscar dados de terminais com os filtros
  const terminalsList = await getTerminals(search, page, pageSize);

  const totalRecords = terminalsList.totalCount;

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Terminais", url: "/portal/terminals" }]}
      />
      <BaseBody title="Terminais" subtitle="Visualização de todos os terminais">
        <div className="flex flex-col space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <TerminalsFilter />
            </div>
          </div>

          <TerminalsList terminals={terminalsList.terminals} />

          {totalRecords > 0 && (
            <div className="flex items-center justify-between mt-4">
              <PageSizeSelector
                currentPageSize={pageSize}
                pageName="portal/terminals"
              />
              <PaginationRecords
                totalRecords={totalRecords}
                currentPage={page}
                pageSize={pageSize}
                pageName="portal/terminals"
              />
            </div>
          )}
        </div>
      </BaseBody>
    </>
  );
}
