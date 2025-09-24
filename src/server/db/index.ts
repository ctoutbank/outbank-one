// @/server/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../../../drizzle/schema";
import { neonConfig as customNeonConfig } from "./pgConfig";

config({ path: ".env.local" });

Object.assign(neonConfig, customNeonConfig);

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required but not found in environment variables');
}

let sql: ReturnType<typeof neon>;

try {
  sql = neon(process.env.DATABASE_URL);
  
  if (process.env.NODE_ENV === 'development') {
    sql`SELECT 1 as test`.catch((error) => {
      console.warn('Database connection test failed during initialization:', error.message);
    });
  }
} catch (error) {
  console.error('Failed to initialize Neon connection:', error);
  throw new Error(`Database connection initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export const db = drizzle(sql, { schema });

export async function testConnection() {
  try {
    await sql`SELECT 1 as test`;
    return { success: true };
  } catch (error) {
    console.error('Database connection test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
