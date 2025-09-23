import { EmptyState } from "@/components/empty-state";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { TerminalsDashboardContent } from "@/features/terminals/_components/terminals-dashboard-content";
import { TerminalsExcelExportButton } from "@/features/terminals/_components/terminals-excel-export-button";
import { TerminalsFilter } from "@/features/terminals/_components/terminals-filter";
import TerminalsList from "@/features/terminals/_components/terminals-list";
import { getTerminals } from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";
import { Search } from "lucide-react";

type TerminalsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  dateTo?: string;
  numeroLogico?: string;
  numeroSerial?: string;
  estabelecimento?: string;
  modelo?: string;
  status?: string;
  provedor?: string;
  sortBy?: string;
  sortOrder?: string;
};

export default async function TerminalsPage({
  searchParams,
}: {
  searchParams: Promise<TerminalsProps>;
}) {
  await checkPagePermission("Terminais");

  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page || "1");
  const pageSize = parseInt(resolvedSearchParams.pageSize || "10");
  const search = resolvedSearchParams.search || "";
  const dateTo = resolvedSearchParams.dateTo;
  const numeroLogico = resolvedSearchParams.numeroLogico;
  const numeroSerial = resolvedSearchParams.numeroSerial;
  const estabelecimento = resolvedSearchParams.estabelecimento;
  const modelo = resolvedSearchParams.modelo;
  const status = resolvedSearchParams.status;
  const provedor = resolvedSearchParams.provedor;
  const sortBy = resolvedSearchParams.sortBy;
  const sortOrder = resolvedSearchParams.sortOrder as "asc" | "desc" | undefined;

  // Buscar dados de terminais com os filtros e ordenação
  const terminalsList = await getTerminals(
    search,
    page,
    pageSize,
    {
      dateTo,
      numeroLogico,
      numeroSerial,
      estabelecimento,
      modelo,
      status,
      provedor,
    },
    {
      sortBy,
      sortOrder,
    }
  );

  const totalRecords = terminalsList.totalCount;
  const ativosTerminals = terminalsList.activeCount || 0;
  const inativosTerminals = terminalsList.inactiveCount || 0;
  const modelosAtivosDetalhes = terminalsList.modelosAtivosDetalhes || [];
  const evolucaoData = terminalsList.evolucaoData || [];

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

  console.log("esse é o terminalsList", terminalsList);

  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Terminais", url: "/portal/terminals" }]}
      />
      <BaseBody title="Terminais" subtitle="Visualização de Todos os Terminais">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col items-start gap-4">
            <div className="flex items-center justify-between w-full">
              <TerminalsFilter
                dateToIn={dateTo}
                numeroLogicoIn={numeroLogico}
                numeroSerialIn={numeroSerial}
                estabelecimentoIn={estabelecimento}
                modeloIn={modelo}
                statusIn={status}
                provedorIn={provedor}
              />
              <TerminalsExcelExportButton
                filters={{
                  search,
                  dateTo,
                  numeroLogico,
                  numeroSerial,
                  estabelecimento,
                  modelo,
                  status,
                  provedor,
                }}
                globalStyles={globalStyles}
                sheetName="Terminais"
                fileName={`TERMINAIS-${new Date().toLocaleDateString()}`}
              />
            </div>

            <div className="w-full">
              <TerminalsDashboardContent
                totalTerminals={totalRecords}
                ativosTerminals={ativosTerminals}
                inativosTerminals={inativosTerminals}
                modelosAtivosDetalhes={modelosAtivosDetalhes}
                evolucaoData={evolucaoData}
              />
            </div>
          </div>
          {terminalsList.terminals.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum resultado encontrado"
              description=""
            />
          ) : (
            <TerminalsList terminals={terminalsList} />
          )}

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
