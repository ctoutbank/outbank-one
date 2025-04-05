import BaseBody from "@/components/layout/base-body";
import BaseHeader from "@/components/layout/base-header";
import ReportsWizardForm from "@/features/reports/_components/reports-wizard-form";
import {
  fetchReportFilterParams,
  getfileFormats,
  getperiodTypes,
  getRecorrenceTypes,
  getReportById,
  getreportTypes,
} from "@/features/reports/server/reports";
import { checkPagePermission } from "@/lib/auth/check-permissions";

export const revalidate = 0;

// Função para buscar os parâmetros de filtro de relatório

interface ReportDetailProps {
  params: {
    id: string;
  };
}

export default async function ReportDetail({ params }: ReportDetailProps) {
  const permissions = await checkPagePermission("Relatórios", "Atualizar");

  // Tenta buscar o relatório apenas se o ID não for "new" ou "0"
  let report = null;
  if (params.id !== "new" && params.id !== "0") {
    const reportId = parseInt(params.id);
    report = await getReportById(reportId);
  }

  const recorrence = await getRecorrenceTypes();
  const periods = await getperiodTypes();
  const fileFormat = await getfileFormats();
  const reportType = await getreportTypes();
  const reportFilterParams = await fetchReportFilterParams();

  // Inicializar filtro vazio para novos relatórios
  const emptyFilter = {
    idReport: report?.id || 0,
    idReportFilterParam: 0,
    value: "",
  };

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
          }}
          recorrence={recorrence}
          period={periods}
          fileFormat={fileFormat}
          reportType={reportType}
          permissions={permissions}
          reportFilterParams={reportFilterParams}
          filter={emptyFilter}
        />
      </BaseBody>
    </>
  );
}
