import { db } from "@/server/db";
import { configurations, } from "../../../../drizzle/schema";
import { eq } from "drizzle-orm";



export type ConfigurationInsert = typeof configurations.$inferInsert;
export type ConfigurationUpdate = typeof configurations.$inferSelect;


export async function getConfigurationsByMerchantId(id: number) {
    const result = await db
        .select()
        .from(configurations)
        .where(eq(configurations.id, id));
    return result[0] || null;
}

export async function insertConfiguration(configuration: ConfigurationInsert) {
    const result = await db.insert(configurations).values(configuration).returning({
        id: configurations.id,
    });
    console.log("result", result);
    return result[0] || null;
    
}

export async function updateConfiguration(configuration: ConfigurationUpdate) {
    const result = await db.update(configurations).set(configuration).where(eq(configurations.id, configuration.id)).returning({
        id: configurations.id,
    });
    return result[0] || null;
}

