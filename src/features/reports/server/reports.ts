"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { and, count, desc, eq, like, sql } from "drizzle-orm";
import {
  fileFormats,
  periodTypes,
  recurrenceTypes,
  reportFilters,
  reportFiltersParam,
  reports,
  reportTypes,
} from "../../../../drizzle/schema";
import { db } from "../../../server/db";

export type ReportFull = {
  id: number;
  title: string;
  recurrenceCode: string | null;
  recurrenceName?: string | null;
  shippingTime: string | null;

  periodCode: string | null;
  periodName?: string | null;
  dayWeek?: string | null;
  dayMonth?: string | null;
  emails: string | null;
  formatCode: string | null;
  formatName?: string | null;
  reportType: string | null;
  reportTypeName?: string | null;
  dtinsert: Date | null;
  dtupdate: Date | null;
};

export interface ReportsList {
  reports: ReportFull[];
  totalCount: number;
}

export type ReportDetail = typeof reports.$inferSelect;
export type ReportInsert = typeof reports.$inferInsert;

export async function getReports(
  search: string,
  page: number,
  pageSize: number,
  type?: string,
  format?: string,
  recurrence?: string,
  period?: string,
  email?: string,
  creationDate?: string
): Promise<ReportsList> {
  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      reports: [],
      totalCount: 0,
    };
  }

  const offset = (page - 1) * pageSize;

  const conditions = [like(reports.title, `%${search}%`)];

  if (type) {
    // Filtrar pelos tipos de relatório suportados: VN (Vendas) ou AL (Agenda dos Lojistas)
    conditions.push(eq(reports.reportType, type));
  }

  if (format) {
    // Filtrar pelos formatos: PDF, EX, CSV, TXT
    conditions.push(eq(reports.formatCode, format));
  }

  if (recurrence) {
    // Filtrar pelas recorrências: DIA, SEM, MES
    conditions.push(eq(reports.recurrenceCode, recurrence));
  }

  if (period) {
    // Filtrar pelos períodos: DT (Dia Atual), DA (Dia Anterior), SA (Semana Atual),
    // SR (Semana Anterior), MA (Mês Atual), MR (Mês Anterior)
    conditions.push(eq(reports.periodCode, period));
  }

  if (email) {
    conditions.push(like(reports.emails, `%${email}%`));
  }

  if (creationDate) {
    const dateStr = new Date(creationDate).toISOString().split("T")[0];
    conditions.push(sql`CAST(${reports.dtinsert} AS DATE) = ${dateStr}`);
  }

  // Realizar consulta principal com JOIN para obter os nomes dos tipos
  const result = await db
    .select({
      id: reports.id,
      title: reports.title,
      recurrenceCode: reports.recurrenceCode,
      recurrenceName: recurrenceTypes.name,
      shippingTime: reports.shippingTime,

      periodCode: reports.periodCode,
      periodName: periodTypes.name,
      emails: reports.emails,
      formatCode: reports.formatCode,
      formatName: fileFormats.name,
      reportType: reports.reportType,
      reportTypeName: reportTypes.name,
      dtinsert: reports.dtinsert,
      dtupdate: reports.dtupdate,
      startTime: reports.startTime,
      endTime: reports.endTime,
      dayWeek: reports.dayWeek,
      dayMonth: reports.dayMonth,
    })
    .from(reports)
    .leftJoin(recurrenceTypes, eq(reports.recurrenceCode, recurrenceTypes.code))
    .leftJoin(periodTypes, eq(reports.periodCode, periodTypes.code))
    .leftJoin(fileFormats, eq(reports.formatCode, fileFormats.code))
    .leftJoin(reportTypes, eq(reports.reportType, reportTypes.code))
    .where(and(...conditions))
    .orderBy(desc(reports.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(reports)
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    reports: result.map((report) => ({
      id: report.id,
      title: report.title,
      recurrenceCode: report.recurrenceCode || null,
      recurrenceName: report.recurrenceName || null,
      shippingTime: report.shippingTime || null,
      periodCode: report.periodCode || null,
      periodName: report.periodName || null,
      dayWeek: report.dayWeek || null,
      dayMonth: report.dayMonth || null,
      emails: report.emails || null,
      formatCode: report.formatCode || null,
      formatName: report.formatName || null,
      reportType: report.reportType || null,
      reportTypeName: report.reportTypeName || null,
      startTime: report.startTime || null,
      endTime: report.endTime || null,
      dtinsert: report.dtinsert ? new Date(report.dtinsert) : new Date(),
      dtupdate: report.dtupdate ? new Date(report.dtupdate) : new Date(),
    })),
    totalCount,
  };
}

export async function getReportById(id: number): Promise<ReportDetail | null> {
  const result = await db
    .select()
    .from(reports)
    .where(eq(reports.id, id))
    .limit(1);

  return result[0] || null;
}

export async function insertReport(report: ReportInsert): Promise<number> {
  const result = await db.insert(reports).values(report).returning({
    id: reports.id,
  });

  console.log("Report inserted:", result[0].id);

  return result[0].id;
}

export async function updateReport(report: ReportDetail): Promise<void> {
  await db
    .update(reports)
    .set({
      title: report.title,
      recurrenceCode: report.recurrenceCode,
      shippingTime: report.shippingTime,
      periodCode: report.periodCode,
      dayWeek: report.dayWeek,
      dayMonth: report.dayMonth,
      emails: report.emails,
      formatCode: report.formatCode,
      reportType: report.reportType,
      startTime: report.startTime,
      endTime: report.endTime,
      referenceDateType: report.referenceDateType,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(reports.id, report.id));
}

export async function deleteReportFilter(filterId: number): Promise<void> {
  await db.delete(reportFilters).where(eq(reportFilters.id, filterId));
}

export async function deleteReportFilters(reportId: number): Promise<void> {
  await db.delete(reportFilters).where(eq(reportFilters.idReport, reportId));
}

export type Recorrence = {
  code: string;
  name: string;
};

export async function getRecorrenceTypes(): Promise<Recorrence[]> {
  return await db.select().from(recurrenceTypes).orderBy(recurrenceTypes.name);
}

export type PeriodDD = {
  code: string;
  name: string;
};

export async function getperiodTypes(): Promise<PeriodDD[]> {
  return await db.select().from(periodTypes).orderBy(periodTypes.name);
}

export type FileFormatDD = {
  code: string;
  name: string;
};

export async function getfileFormats(): Promise<FileFormatDD[]> {
  return await db.select().from(fileFormats).orderBy(fileFormats.name);
}

export type ReportTypeDD = {
  code: string;
  name: string;
};

export async function getreportTypes(): Promise<ReportTypeDD[]> {
  return await db.select().from(reportTypes).orderBy(reportTypes.name);
}

export async function fetchReportFilterParams() {
  return await db
    .select()
    .from(reportFiltersParam)
    .orderBy(reportFiltersParam.id);
}

export async function deleteEmailFromReport(
  reportId: number,
  emailToRemove: string
): Promise<void> {
  // Primeiro, obtém o relatório atual
  const currentReport = await getReportById(reportId);

  if (!currentReport || !currentReport.emails) {
    throw new Error("Relatório não encontrado ou não possui emails");
  }

  // Divide a string de emails e remove o email específico
  const currentEmails = currentReport.emails
    .split(",")
    .map((email) => email.trim());
  const updatedEmails = currentEmails
    .filter((email) => email !== emailToRemove)
    .join(", ");

  // Atualiza o relatório com a nova lista de emails
  await db
    .update(reports)
    .set({
      emails: updatedEmails,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(reports.id, reportId));
}

export type ReportStats = {
  totalReports: number;

  // Estatísticas por recorrência
  recurrenceStats: {
    daily: number; // DIA
    weekly: number; // SEM
    monthly: number; // MES
  };

  // Estatísticas por formato
  formatStats: {
    pdf: number; // PDF
    excel: number; // EX
  };

  // Estatísticas por tipo
  typeStats: {
    sales: number; // VN
    schedule: number; // AL
  };
};

export async function getReportStats(): Promise<ReportStats> {
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      totalReports: 0,
      recurrenceStats: {
        daily: 0,
        weekly: 0,
        monthly: 0,
      },
      formatStats: {
        pdf: 0,
        excel: 0,
      },
      typeStats: {
        sales: 0,
        schedule: 0,
      },
    };
  }
  // Contagem total de relatórios
  const totalCountResult = await db.select({ count: count() }).from(reports);
  const totalReports = totalCountResult[0]?.count || 0;

  // Estatísticas por recorrência
  const recurrenceStatsResult = await db
    .select({
      recurrenceCode: reports.recurrenceCode,
      count: count(),
    })
    .from(reports)
    .groupBy(reports.recurrenceCode);

  // Estatísticas por formato
  const formatStatsResult = await db
    .select({
      formatCode: reports.formatCode,
      count: count(),
    })
    .from(reports)
    .groupBy(reports.formatCode);

  // Estatísticas por tipo de relatório
  const typeStatsResult = await db
    .select({
      reportType: reports.reportType,
      count: count(),
    })
    .from(reports)
    .groupBy(reports.reportType);

  // Inicializar estatísticas com zero
  const recurrenceStats = {
    daily: 0,
    weekly: 0,
    monthly: 0,
  };

  const formatStats = {
    pdf: 0,
    excel: 0,
    csv: 0,
    text: 0,
  };

  const typeStats = {
    sales: 0,
    schedule: 0,
  };

  // Preencher as estatísticas de recorrência
  recurrenceStatsResult.forEach((stat) => {
    if (stat.recurrenceCode === "DIA") recurrenceStats.daily = stat.count;
    else if (stat.recurrenceCode === "SEM") recurrenceStats.weekly = stat.count;
    else if (stat.recurrenceCode === "MES")
      recurrenceStats.monthly = stat.count;
  });

  // Preencher as estatísticas de formato
  formatStatsResult.forEach((stat) => {
    if (stat.formatCode === "PDF") formatStats.pdf = stat.count;
    else if (stat.formatCode === "EX") formatStats.excel = stat.count;
  });

  // Preencher as estatísticas de tipo
  typeStatsResult.forEach((stat) => {
    if (stat.reportType === "VN") typeStats.sales = stat.count;
    else if (stat.reportType === "AL") typeStats.schedule = stat.count;
  });

  return {
    totalReports,
    recurrenceStats,
    formatStats,
    typeStats,
  };
}

export async function deleteReport(id: number): Promise<void> {
  try {
    // Primeiro, excluir os filtros associados ao relatório
    await db.delete(reportFilters).where(eq(reportFilters.idReport, id));

    // Em seguida, excluir o relatório
    await db.delete(reports).where(eq(reports.id, id));
  } catch (error) {
    console.error("Erro ao excluir relatório:", error);
    throw new Error(
      "Não foi possível excluir o relatório. Verifique se não existem dependências."
    );
  }
}
