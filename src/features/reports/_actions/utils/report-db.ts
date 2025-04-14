import { currentDateTimeSP } from "@/lib/datetime-utils";
import { format } from "date-fns";
import { and, eq, sql } from "drizzle-orm";
import { DateTime } from "luxon";
import {
  reportExecution,
  reportFilters,
  reportFiltersParam,
  reports,
} from "../../../../../drizzle/schema";
import { db } from "../../../../server/db";
import { logger } from "./report-logger";

export async function getPendingReportExecutions() {
  logger.info("Data e hora atual no fuso horário de São Paulo", {
    currentDateTimeSP: currentDateTimeSP(),
  });
  return await db
    .select()
    .from(reportExecution)
    .where(
      and(
        eq(reportExecution.status, "SCHEDULED"),
        sql`${reportExecution.scheduleDate} <= ${currentDateTimeSP()}`
      )
    )
    .limit(5);
}

export async function getReportById(idReport: number) {
  const report = await db
    .select()
    .from(reports)
    .where(eq(reports.id, idReport))
    .limit(1);

  if (!report.length) {
    throw new Error("Relatório não encontrado");
  }

  return report[0];
}

export async function updateReportExecutionStatus(
  executionId: number,
  status: string,
  now: Date
) {
  await db
    .update(reportExecution)
    .set({
      status,
      executionStart: format(now, "yyyy-MM-dd HH:mm:ss"),
    })
    .where(eq(reportExecution.id, executionId));
}

export async function getRecurringReports() {
  return await db
    .select()
    .from(reports)
    .where(
      and(
        sql`${reports.recurrenceCode} IS NOT NULL`,
        sql`${reports.shippingTime} IS NOT NULL`
      )
    );
}

export async function findExistingReportExecution(
  reportId: number,
  scheduleDate: string
) {
  return await db
    .select()
    .from(reportExecution)
    .where(
      and(
        eq(reportExecution.idReport, reportId),
        eq(reportExecution.scheduleDate, scheduleDate),
        sql`${sql.raw("1")} = 1`
      )
    );
}

export async function getReportFilterParameters(reportId: number) {
  return await db
    .select({
      filterName: reportFiltersParam.name,
      filterValue: reportFilters.value,
      filterType: reportFiltersParam.type,
    })
    .from(reportFilters)
    .innerJoin(
      reportFiltersParam,
      eq(reportFilters.idReportFilterParam, reportFiltersParam.id)
    )
    .where(eq(reportFilters.idReport, reportId));
}

export async function createReportExecution(
  reportId: number,
  scheduleDate: string,
  filters: Record<string, any>,
  emails: string,
  dateStart: DateTime,
  dateEnd: DateTime
) {
  return await db
    .insert(reportExecution)
    .values({
      idReport: reportId,
      status: "SCHEDULED",
      scheduleDate,
      createdOn: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
      filters,
      emailsSent: emails,
      reportFilterStartDate: dateStart.toISO() || null,
      reportFilterEndDateTime: dateEnd.toISO() || null,
    })
    .returning();
}

export async function updateReportExecutionCompletion(
  executionId: number,
  status: string,
  fileId: number | null,
  now: Date
) {
  await db
    .update(reportExecution)
    .set({
      status,
      executionEnd: format(now, "yyyy-MM-dd HH:mm:ss"),
      fileId,
    })
    .where(eq(reportExecution.id, executionId));
}
