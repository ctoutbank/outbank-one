import { db } from "@/server/db";
import { sql } from "drizzle-orm";

export async function getIdBySlugs(
  tableName: string,
  slugs: string[]
): Promise<[{ id: number; slug: string }] | null> {
  try {
    const result: any = await db.execute(
      sql`SELECT id, slug FROM ${sql.identifier(
        tableName
      )} WHERE slug in (${slugs})`
    );
    console.log(`Resultado da busca: ${result.rows?.id}`);
    return result;
  } catch (error) {
    console.error(`Erro ao buscar ID na tabela ${tableName}`, error);
    return null;
  }
}
