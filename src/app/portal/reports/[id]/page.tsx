import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ReportsWizardForm, {
  FormattedFilter,
} from "@/features/reports/_components/reports-wizard-form";
import {
  getMerchantBySlug,
  getReportFilters,
  ReportFilterDetailWithTypeName,
} from "@/features/reports/filter/filter-Actions";
import {
  fetchReportFilterParams,
  getfileFormats,
  getperiodTypes,
  getRecorrenceTypes,
  getReportById,
  getreportTypes,
} from "@/features/reports/server/reports";
import { getTerminalBySlug } from "@/features/terminals/serverActions/terminal";
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

// Função para buscar os parâmetros de filtro de relatório

interface ReportDetailProps {
  params: {
    id: string;
  };
  searchParams: {
    activeTab?: string;
  };
}

export default async function ReportDetail({
  params,
  searchParams,
}: ReportDetailProps) {
  const permissions = await checkPagePermission("Relatórios", "Atualizar");
  const activeTab = searchParams.activeTab || "step1";

  // Tenta buscar o relatório apenas se o ID não for "new" ou "0"
  let report = null;
  let reportFilters: ReportFilterDetailWithTypeName[] = [];
  let formattedFilters: FormattedFilter[] = [];

  const reportFilterParams = await fetchReportFilterParams();

  if (params.id !== "new" && params.id !== "0") {
    const reportId = parseInt(params.id);
    report = await getReportById(reportId);

    // Buscar os filtros do relatório
    reportFilters = await getReportFilters(reportId);

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
            const merchant = await getMerchantBySlug(filter.value);
            displayValue = merchant?.name || filter.value;
          } catch (error) {
            console.error(
              `Erro ao buscar merchant para slug ${filter.value}:`,
              error
            );
            displayValue = filter.value;
          }
        } else if (paramName === "Terminal") {
          const terminal = await getTerminalBySlug(filter.value);
          displayValue = terminal?.logicalNumber || filter.value;
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

        // Tratamento específico para Estabelecimento

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
        />
      </BaseBody>
    </>
  );
}
