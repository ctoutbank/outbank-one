import ExcelExport from "@/components/excelExport";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import PageSizeSelector from "@/components/page-size-selector";
import PaginationRecords from "@/components/pagination-Records";
import { TerminalsDashboardContent } from "@/features/terminals/_components/terminals-dashboard-content";
import { TerminalsFilter } from "@/features/terminals/_components/terminals-filter";
import TerminalsList from "@/features/terminals/_components/terminals-list";
import {
  TerminalFull,
  getTerminals,
  getTerminalsForExport,
} from "@/features/terminals/serverActions/terminal";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import { Fill, Font } from "exceljs";

type TerminalsProps = {
  page?: string;
  pageSize?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  numeroLogico?: string;
  numeroSerial?: string;
  estabelecimento?: string;
  modelo?: string;
  status?: string;
  provedor?: string;
};

export default async function TerminalsPage({
  searchParams,
}: {
  searchParams: TerminalsProps;
}) {
  await checkPagePermission("Terminais");
  console.log(searchParams);

  const page = parseInt(searchParams.page || "1");
  const pageSize = parseInt(searchParams.pageSize || "20");
  const search = searchParams.search || "";
  const dateFrom = searchParams.dateFrom;
  const dateTo = searchParams.dateTo;
  const numeroLogico = searchParams.numeroLogico;
  const numeroSerial = searchParams.numeroSerial;
  const estabelecimento = searchParams.estabelecimento;
  const modelo = searchParams.modelo;
  const status = searchParams.status;
  const provedor = searchParams.provedor;

  // Buscar dados de terminais com os filtros
  const terminalsList = await getTerminals(search, page, pageSize, {
    dateFrom,
    dateTo,
    numeroLogico,
    numeroSerial,
    estabelecimento,
    modelo,
    status,
    provedor,
  });

  // Buscar dados para exportação Excel apenas se houver filtro de data
  const hasDateFilter = !!(dateFrom || dateTo);
  let terminalsExcel = { terminals: [] as TerminalFull[], totalCount: 0 };

  if (hasDateFilter) {
    terminalsExcel = await getTerminalsForExport(search, {
      dateFrom,
      dateTo,
      numeroLogico,
      numeroSerial,
      estabelecimento,
      modelo,
      status,
      provedor,
    });
  }

  const totalRecords = terminalsList.totalCount;
  const ativosTerminals = terminalsList.activeCount || 0;
  const inativosTerminals = terminalsList.inactiveCount || 0;
  const desativadosTerminals = terminalsList.desativadosCount || 0;
  const totalModelosAtivos = terminalsList.totalModelosAtivos || 0;
  const modelosAtivos = terminalsList.modelosAtivos || [];
  const modelosAtivosDetalhes = terminalsList.modelosAtivosDetalhes || [];

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

  // Função para traduzir o status
  const traduzirStatus = (status: string | null): string => {
    if (!status) return "";

    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "Ativo";
      case "INACTIVE":
        return "Inativo";
      default:
        return status;
    }
  };
  console.log("esse é o terminalsList", terminalsList);
  console.log(terminalsExcel);

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
                dateFromIn={dateFrom}
                dateToIn={dateTo}
                numeroLogicoIn={numeroLogico}
                numeroSerialIn={numeroSerial}
                estabelecimentoIn={estabelecimento}
                modeloIn={modelo}
                statusIn={status}
                provedorIn={provedor}
              />
              <ExcelExport
                data={terminalsExcel.terminals.map((terminal) => ({
                  "Data de Inclusão": terminal.dtinsert
                    ? terminal.dtinsert instanceof Date
                      ? terminal.dtinsert.toLocaleString()
                      : terminal.dtinsert
                    : "",
                  "Data de Desativação": terminal.inactivationDate
                    ? terminal.inactivationDate instanceof Date
                      ? terminal.inactivationDate.toLocaleString()
                      : terminal.inactivationDate
                    : "",
                  "Número Lógico": terminal.logicalNumber || "",
                  "Número Serial": terminal.serialNumber || "",
                  Estabelecimento: terminal.merchantName || "",
                  "CNPJ/CPF": terminal.merchantDocumentId || "",
                  ISO: terminal.customerName || "",
                  Modelo: terminal.model || "",
                  Provedor: terminal.manufacturer || "",
                  "Data da última Transação": terminal.dtUltimaTransacao
                    ? terminal.dtUltimaTransacao instanceof Date
                      ? terminal.dtUltimaTransacao.toLocaleString()
                      : terminal.dtUltimaTransacao
                    : "",
                  Status: traduzirStatus(terminal.status),
                  Versão: terminal.versao || "",
                }))}
                globalStyles={globalStyles}
                sheetName="Terminais"
                fileName={`TERMINAIS-${new Date().toLocaleDateString()}`}
                onClick={undefined}
                hasDateFilter={!!(dateFrom || dateTo)}
              />
            </div>

            <div className="w-full">
              <TerminalsDashboardContent
                totalTerminals={totalRecords}
                ativosTerminals={ativosTerminals}
                inativosTerminals={inativosTerminals}
                desativadosTerminals={desativadosTerminals}
                totalModelosAtivos={totalModelosAtivos}
                modelosAtivos={modelosAtivos}
                modelosAtivosDetalhes={modelosAtivosDetalhes}
              />
            </div>
          </div>
          <TerminalsList terminals={terminalsList} />

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
