import { EmptyState } from "@/components/empty-state";
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
import { LazyTerminalsDashboard } from "@/components/lazy/LazyTerminalsDashboard";
import { TerminalsExcelExportButton } from "@/features/terminals/_components/terminals-excel-export-button";
import { TerminalsFilter } from "@/features/terminals/_components/terminals-filter";
import TerminalsList from "@/features/terminals/_components/terminals-list";
import { getTerminals } from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import type { Fill, Font } from "exceljs";
import { Search } from "lucide-react";

type TerminalsProps = {
  searchParams: {
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
};

export default async function TerminalsPage({ searchParams }: TerminalsProps) {
  await checkPagePermission("Terminais");

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "10");
  const search = searchParams.search || "";
  const dateTo = searchParams.dateTo;
  const numeroLogico = searchParams.numeroLogico;
  const numeroSerial = searchParams.numeroSerial;
  const estabelecimento = searchParams.estabelecimento;
  const modelo = searchParams.modelo;
  const status = searchParams.status;
  const provedor = searchParams.provedor;
  const sortBy = searchParams.sortBy;
  const sortOrder = searchParams.sortOrder as "asc" | "desc" | undefined;

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
    { sortBy, sortOrder }
  );

  const totalRecords = terminalsList.totalCount;
  const globalStyles = {
    header: {
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "808080" } } as Fill,
      font: { color: { argb: "FFFFFF" }, bold: true } as Font,
    },
    row: { font: { color: { argb: "000000" } } as Font },
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Terminais"
        description="Gerencie e visualize todos os terminais cadastrados."
      >
        <TerminalsExcelExportButton
          filters={{
            search, dateTo, numeroLogico, numeroSerial,
            estabelecimento, modelo, status, provedor,
          }}
          globalStyles={globalStyles}
          sheetName="Terminais"
          fileName={`TERMINAIS-${new Date().toLocaleDateString()}`}
        />
      </PageHeader>

      <LazyTerminalsDashboard
        totalTerminals={totalRecords}
        ativosTerminals={terminalsList.activeCount || 0}
        inativosTerminals={terminalsList.inactiveCount || 0}
        modelosAtivosDetalhes={terminalsList.modelosAtivosDetalhes || []}
        evolucaoData={terminalsList.evolucaoData || []}
      />

      <Card>
        <CardHeader>
          <CardTitle>Lista de Terminais</CardTitle>
          <CardDescription>
            Filtre e visualize todos os terminais.
          </CardDescription>
          <div className="pt-4">
            <TerminalsFilter
              dateToIn={dateTo}
              numeroLogicoIn={numeroLogico}
              numeroSerialIn={numeroSerial}
              estabelecimentoIn={estabelecimento}
              modeloIn={modelo}
              statusIn={status}
              provedorIn={provedor}
            />
          </div>
        </CardHeader>
        <CardContent>
          {terminalsList.terminals.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Nenhum terminal encontrado"
              description="Tente ajustar seus filtros para encontrar o que procura."
            />
          ) : (
            <TerminalsList terminals={terminalsList} />
          )}
        </CardContent>
        {totalRecords > 0 && (
          <CardFooter className="flex items-center justify-between">
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
          </CardFooter>
        )}
      </Card>
    </div>
  );
}