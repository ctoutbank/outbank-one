import DeleteReportButton from "@/components/delete-report-button";
import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ReportsWizardForm, {
  FormattedFilter,
} from "@/features/reports/_components/reports-wizard-form";
import {
  getAllBrands,
  getMerchantByName,
  getReportFilters,
  PreloadedFilterData,
  ReportFilterDetailWithTypeName,
  searchTerminals,
} from "@/features/reports/filter/filter-Actions";
import {
  fetchReportFilterParams,
  getfileFormats,
  getperiodTypes,
  getRecorrenceTypes,
  getReportById,
  getreportTypes,
} from "@/features/reports/server/reports";
import { checkPagePermission } from "@/lib/auth/check-permissions";
import {
  brandList,
  cardPaymentMethod,
  cycleTypeList,
  processingTypeList,
  splitTypeList,
  transactionProductTypeList,
  transactionStatusList,
} from "@/lib/lookuptables/lookuptables-transactions";

export const revalidate = 0;

export default async function ReportDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { activeTab?: string; filterId?: string };
}) {
  const permissions = await checkPagePermission("Relatórios", "Atualizar");
  const activeTab = searchParams.activeTab || "step1";

  // Tenta buscar o relatório apenas se o ID não for "new" ou "0"
  let report = null;
  let reportFilters: ReportFilterDetailWithTypeName[] = [];
  let formattedFilters: FormattedFilter[] = [];
  const preloadedFilterData: PreloadedFilterData = {
    merchant: null,
    terminal: null,
    brands: [],
  };

  const reportFilterParams = await fetchReportFilterParams();

  if (params.id !== "new" && params.id !== "0") {
    const reportId = parseInt(params.id);
    report = await getReportById(reportId);

    // Buscar os filtros do relatório
    reportFilters = await getReportFilters(reportId);

    // Pré-carregar as bandeiras para evitar chamadas no cliente
    preloadedFilterData.brands = await getAllBrands();

    // Se temos um ID de filtro específico, pré-carregar os dados do merchant ou terminal
    if (searchParams.filterId) {
      const filterId = parseInt(searchParams.filterId);
      const filterToEdit = reportFilters.find(
        (filter) => filter.id === filterId
      );

      if (filterToEdit) {
        const paramInfo = reportFilterParams.find(
          (p) => p.id === filterToEdit.idReportFilterParam
        );

        // Se for um filtro de estabelecimento, buscar os dados do merchant
        if (paramInfo?.name === "Estabelecimento" && filterToEdit.value) {
          preloadedFilterData.merchant = await getMerchantByName(
            filterToEdit.value
          );
        }

        // Se for um filtro de terminal, buscar os dados do terminal
        if (paramInfo?.name === "Terminal" && filterToEdit.value) {
          const terminals = await searchTerminals(filterToEdit.value);
          preloadedFilterData.terminal =
            terminals.find((t) => t.logical_number === filterToEdit.value) ||
            null;
        }
      }
    }

    // Formatar os filtros com as labels adequadas
    formattedFilters = await Promise.all(
      reportFilters.map(async (filter) => {
        const paramInfo = reportFilterParams.find(
          (p) => p.id === filter.idReportFilterParam
        );
        const paramName = paramInfo?.name || "Parâmetro desconhecido";

        let displayValue = filter.value;

        // Tratamento específico para Status
        if (paramName === "Status") {
          const statusValues = filter.value
            .split(",")
            .map((s: string) => s.trim());
          displayValue = statusValues
            .map((value: string) => {
              const status = transactionStatusList.find(
                (s) => s.value === value
              );
              return status ? status.label : value;
            })
            .join(", ");
        } else if (paramName === "Tipo de Pagamento") {
          const productTypeValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = productTypeValues
            .map((value: string) => {
              const status = transactionProductTypeList.find(
                (s) => s.value === value
              );
              return status ? status.label : value;
            })
            .join(", ");
        } else if (paramName === "Bandeira") {
          const brandValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = brandValues
            .map((value: string) => {
              const bandeira = brandList.find((s) => s.value === value);
              return bandeira ? bandeira.label : value;
            })
            .join(", ");
        } else if (paramName === "Estabelecimento") {
          try {
            displayValue = filter.value;
          } catch (error) {
            console.error(
              `Erro ao buscar merchant para slug ${filter.value}:`,
              error
            );
            displayValue = filter.value;
          }
        } else if (paramName === "Terminal") {
          displayValue = filter.value;
        } else if (paramName === "Ciclo da Transação") {
          const cycleValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = cycleValues
            .map((value: string) => {
              const cycle = cycleTypeList.find((s) => s.value === value);
              return cycle ? cycle.label : value;
            })
            .join(", ");
        } else if (paramName === "Modo de Captura") {
          const captureValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = captureValues
            .map((value: string) => {
              const capture = cardPaymentMethod.find((s) => s.value === value);
              return capture ? capture.label : value;
            })
            .join(", ");
        } else if (paramName === "Modo de Entrada") {
          const entryValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = entryValues
            .map((value: string) => {
              const entry = processingTypeList.find((s) => s.value === value);
              return entry ? entry.label : value;
            })
            .join(", ");
        } else if (paramName === "Repasse da Transação") {
          const repassValues = filter.value
            .split(",")
            .map((s: string) => s.trim());

          displayValue = repassValues
            .map((value: string) => {
              const repass = splitTypeList.find((s) => s.value === value);
              return repass ? repass.label : value;
            })
            .join(", ");
        }

        // Converter string para Date quando necessário
        const dtinsert = filter.dtinsert ? new Date(filter.dtinsert) : null;
        const dtupdate = filter.dtupdate ? new Date(filter.dtupdate) : null;

        return {
          id: filter.id,
          idReport: filter.idReport,
          idReportFilterParam: filter.idReportFilterParam,
          value: filter.value,
          dtinsert,
          dtupdate,
          typeName: filter.typeName,
          paramName,
          displayValue,
        };
      })
    );
  }

  const recorrence = await getRecorrenceTypes();
  const periods = await getperiodTypes();
  const fileFormat = await getfileFormats();
  const reportType = await getreportTypes();




  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Relatórios", url: "/portal/reports" }]}
      />
      <BaseBody
        title="Relatório"
        subtitle={report?.id ? "Editar Relatório" : "Adicionar Relatório"}
      >
          {report?.id && <DeleteReportButton reportId={report.id} />}
        <ReportsWizardForm
          report={{
            id: report?.id,
            title: report?.title || "",
            recurrenceCode: report?.recurrenceCode || "",
            shippingTime: report?.shippingTime || "",
            periodCode: report?.periodCode || "",
            dayWeek: report?.dayWeek || "",
            dayMonth: report?.dayMonth || "",
            startTime: report?.startTime || "",
            endTime: report?.endTime || "",
            emails: report?.emails || "",
            formatCode: report?.formatCode || "",
            reportType: report?.reportType || "",
            referenceDateType: report?.referenceDateType || "",
          }}
          recorrence={recorrence}
          period={periods}
          fileFormat={fileFormat}
          reportType={reportType}
          permissions={permissions}
          reportFilterParams={reportFilterParams}
          activeTabDefault={activeTab}
          existingFilters={formattedFilters}
          preloadedFilterData={preloadedFilterData}
          editFilterId={
            searchParams.filterId ? parseInt(searchParams.filterId) : undefined
          }
        />
      </BaseBody>
    </>
  );
}
