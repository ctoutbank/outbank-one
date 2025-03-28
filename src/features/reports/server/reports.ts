"use server";

import { and, count, desc, eq, like, sql } from "drizzle-orm";
import {
  fileFormats,
  periodTypes,
  recurrenceTypes,
  reportFilters,
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
  const offset = (page - 1) * pageSize;

  const conditions = [like(reports.title, `%${search}%`)];

  if (type) {
    conditions.push(eq(reports.reportType, type));
  }

  if (format) {
    conditions.push(eq(reports.formatCode, format));
  }

  if (recurrence) {
    conditions.push(eq(reports.recurrenceCode, recurrence));
  }

  if (period) {
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
      startPeriodTime: reports.startPeriodTime,
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
      startPeriodTime: report.startPeriodTime || null,
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
      startPeriodTime: report.startPeriodTime,
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
