// @/server/db.ts
import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import { config } from "dotenv";
import * as schema from "../../../drizzle/schema";

config({ path: ".env" });

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
