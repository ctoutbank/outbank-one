import { db } from "@/server/db";
import { configurations, } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";


export async function getConfigurationsByMerchantId(id: number) {
    const result = await db.select().from(configurations).where(eq(configurations.id, id));
    return result[0] || null;
}
