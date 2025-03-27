import { ReportSchema, ReportFilterSchema } from "../schema/schema";
import {
  ReportDetail,
  ReportInsert,
  insertReport,
  updateReport,
  ReportFilterDetail,
  ReportFilterInsert,
  insertReportFilter,
  updateReportFilter,
  deleteReportFilter,
  deleteReportFilters
} from "../server/reports";

export async function insertReportFormAction(data: ReportSchema) {
  console.log("Dados recebidos no insertReportFormAction:", data);
  
  const reportInsert: ReportInsert = {
    title: data.title,
    recurrenceCode: data.recurrenceCode || null,
    shippingTime: data.shippingTime || null,
    periodCode: data.periodCode || null,
    dayWeek: data.dayWeek || null,
    dayMonth: data.dayMonth || null,
    startPeriodTime: data.startPeriodTime || null,
    emails: data.emails || null,
    formatCode: data.formatCode || null,
    reportType: data.reportType || null,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
  };

  console.log("Dados a serem inseridos:", reportInsert);

  const newId = await insertReport(reportInsert);
  
  // Adicionar filtros, se houver
  if (data.filters && data.filters.length > 0) {
    for (const filter of data.filters) {
      const filterInsert: ReportFilterInsert = {
        idReport: newId,
        idReportFilterParam: filter.idReportFilterParam,
        value: filter.value,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
      };
      
      await insertReportFilter(filterInsert);
    }
  }
  
  return newId;
}

export async function updateReportFormAction(data: ReportSchema) {
  if (!data.id) {
    throw new Error("Cannot update report without an ID");
  }

  console.log("Dados recebidos no updateReportFormAction:", data);

  const reportUpdate: ReportDetail = {
    id: data.id,
    title: data.title,
    recurrenceCode: data.recurrenceCode || null,
    shippingTime: data.shippingTime || null,
    periodCode: data.periodCode || null,
    dayWeek: data.dayWeek || null,
    dayMonth: data.dayMonth || null,
    startPeriodTime: data.startPeriodTime || null,
    emails: data.emails || null,
    formatCode: data.formatCode || null,
    reportType: data.reportType || null,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
  };

  console.log("Dados a serem atualizados:", reportUpdate);

  await updateReport(reportUpdate);
  
  // Atualizar filtros
  // Primeiro, remover filtros existentes
  await deleteReportFilters(data.id);
  
  // Adicionar novos filtros
  if (data.filters && data.filters.length > 0) {
    for (const filter of data.filters) {
      const filterInsert: ReportFilterInsert = {
        idReport: data.id,
        idReportFilterParam: filter.idReportFilterParam,
        value: filter.value,
        dtinsert: new Date().toISOString(),
        dtupdate: new Date().toISOString(),
      };
      
      await insertReportFilter(filterInsert);
    }
  }
}

export async function insertReportFilterAction(data: ReportFilterSchema) {
  if (!data.idReport) {
    throw new Error("Cannot add filter without a report ID");
  }

  const filterInsert: ReportFilterInsert = {
    idReport: data.idReport,
    idReportFilterParam: data.idReportFilterParam,
    value: data.value,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
  };

  const newId = await insertReportFilter(filterInsert);
  return newId;
}

export async function updateReportFilterAction(data: ReportFilterSchema) {
  if (!data.id) {
    throw new Error("Cannot update filter without an ID");
  }

  const filterUpdate: ReportFilterDetail = {
    id: data.id,
    idReport: data.idReport!,
    idReportFilterParam: data.idReportFilterParam,
    value: data.value,
    dtinsert: new Date().toISOString(),
    dtupdate: new Date().toISOString(),
  };

  await updateReportFilter(filterUpdate);
}

export async function deleteReportFilterAction(filterId: number) {
  await deleteReportFilter(filterId);
} 