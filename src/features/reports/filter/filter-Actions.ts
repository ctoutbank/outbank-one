"use server"

import { db } from "@/server/db";
import { reportFilters, reportFiltersParam } from "../../../../drizzle/schema";

import { eq } from "drizzle-orm";

export async function getReportFilters(
    reportId: number
  ): Promise<ReportFilterDetail[]> {
    return await db
      .select()
      .from(reportFilters)
      .where(eq(reportFilters.idReport, reportId))
      .orderBy(reportFilters.id);
  }



 export type ReportFilterDetail = typeof reportFilters.$inferSelect;
export type ReportFilterInsert = typeof reportFilters.$inferInsert;

export type ReportFilterParamDetail = typeof reportFiltersParam.$inferSelect;



export async function updateReportFilter(
    data: ReportFilterDetail
  ): Promise<void> {
    await db
      .update(reportFilters)
      .set({
        idReportFilterParam: data.idReportFilterParam,
        value: data.value,
        dtupdate: new Date().toISOString(),
      })
      .where(eq(reportFilters.id, data.id));
  }


  
export async function insertReportFilter(
    filter: ReportFilterInsert
  ): Promise<number> {
    const result = await db.insert(reportFilters).values({
      idReport: filter.idReport,
      idReportFilterParam: filter.idReportFilterParam,
      value: filter.value,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
    }).returning({
      id: reportFilters.id,
    });
  
    return result[0].id;
  }

  export async function deleteReportFilter(filterId: number): Promise<void> {
    await db.delete(reportFilters).where(eq(reportFilters.id, filterId));
  }

 

  export async function getReportFilterParams(): Promise<ReportFilterParamDetail[]> {
    return await db.select().from(reportFiltersParam).orderBy(reportFiltersParam.id);
  }

  
  export async function getReportFilterParamById(id: number): Promise<ReportFilterParamDetail | null> {
    const result = await db.select().from(reportFiltersParam).where(eq(reportFiltersParam.id, id)).limit(1);
    return result[0] || null;
  }

  export async function getReportFilterParamByType(type: string): Promise<ReportFilterParamDetail | null> {
    const result = await db.select().from(reportFiltersParam).where(eq(reportFiltersParam.type, type)).limit(1);
    return result[0] || null;
  }

  export async function getReportFilterById(id: number): Promise<ReportFilterDetail | null> {
    const result = await db.select().from(reportFilters).where(eq(reportFilters.id, id)).limit(1);
    return result[0] || null;
  }
  

