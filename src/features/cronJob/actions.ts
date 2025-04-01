import { cronJobMonitoring, db } from "@/lib/db";
import { eq } from "drizzle-orm";

// Define tipos usando inferência do Drizzle
export type CronJobMonitoring = typeof cronJobMonitoring.$inferSelect;
export type NewCronJobMonitoring = typeof cronJobMonitoring.$inferInsert;

// Create
export async function createCronJobMonitoring(data: NewCronJobMonitoring) {
  try {
    const newRecord = await db
      .insert(cronJobMonitoring)
      .values(data)
      .returning();
    return { success: true, data: newRecord[0] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Read
export async function getCronJobMonitoring(id: number) {
  try {
    const record = await db
      .select()
      .from(cronJobMonitoring)
      .where(eq(cronJobMonitoring.id, id));
    return { success: true, data: record[0] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

export async function getAllCronJobMonitoring() {
  try {
    const records = await db.select().from(cronJobMonitoring);
    return { success: true, data: records };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Update
export async function updateCronJobMonitoring(
  id: number,
  data: Partial<CronJobMonitoring>
) {
  try {
    const updatedRecord = await db
      .update(cronJobMonitoring)
      .set(data)
      .where(eq(cronJobMonitoring.id, id))
      .returning();
    return { success: true, data: updatedRecord[0] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Delete
export async function deleteCronJobMonitoring(id: number) {
  try {
    await db.delete(cronJobMonitoring).where(eq(cronJobMonitoring.id, id));
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
