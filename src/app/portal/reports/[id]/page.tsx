import { getfileFormats, getperiodTypes, getRecorrenceTypes, getReportById, getreportTypes } from "@/features/reports/server/reports";
import ReportForm from "@/features/reports/_components/reports-form";
import BaseHeader from "@/components/layout/base-header";
import BaseBody from "@/components/layout/base-body";
import FilterTableAndForm from "@/features/reports/filter/filter-table";
import { getReportFilterParams, getReportFilters } from "@/features/reports/filter/filter-Actions";

export const revalidate = 0;

interface ReportDetailProps {
  params: {
    id: string;
  };
}

export default async function ReportDetail({ params }: ReportDetailProps) {
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
  const filters = await getReportFilters(report?.id || 0);
  const reportFilterParams = await getReportFilterParams();

  console.log("recorrence", recorrence);
  
 
  
  return (
    <>
      <BaseHeader
        breadcrumbItems={[{ title: "Relatórios", url: "/portal/reports" }]}
      />
      <BaseBody
        title="Relatório"
        subtitle={report?.id ? "Editar Relatório" : "Adicionar Relatório"}
      >
        <ReportForm
          report={{
            id: report?.id,
            title: report?.title || "",
            recurrenceCode: report?.recurrenceCode || "",
            shippingTime: report?.shippingTime || "",
            periodCode: report?.periodCode || "",
            dayWeek: report?.dayWeek || "",
            dayMonth: report?.dayMonth || "",
            startPeriodTime: report?.startPeriodTime || "",
            emails: report?.emails || "",
            formatCode: report?.formatCode || "",
            reportType: report?.reportType || "",
          }}
          recorrence={recorrence}
          period={periods}
          fileFormat={fileFormat}
          reportType={reportType}
        />
        <FilterTableAndForm
          reportId={report?.id || 0}
          reportFilterParams={reportFilterParams}
          reportTypeDD={reportType}
          filter={filters}
        />
      </BaseBody>
    </>
  );
}
