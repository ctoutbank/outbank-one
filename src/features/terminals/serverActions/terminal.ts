import { db } from "@/server/db";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { terminals } from "../../../../drizzle/schema";

export async function getTerminals(
  search?: string,
  page: number = 1,
  pageSize: number = 20
) {
  try {
    const offset = (page - 1) * pageSize;

    let whereClause = undefined;

    if (search) {
      whereClause = or(
        ilike(terminals.slug, `%${search}%`),
        ilike(terminals.logicalNumber, `%${search}%`),
        ilike(terminals.model, `%${search}%`),
        ilike(terminals.manufacturer, `%${search}%`)
      );
    }

    const [terminalsList, totalCount] = await Promise.all([
      db
        .select({
          slug: terminals.slug,
          logicalNumber: terminals.logicalNumber,
          model: terminals.model,
          manufacturer: terminals.manufacturer,
        })
        .from(terminals)
        .where(and(eq(terminals.active, true), whereClause))
        .orderBy(desc(terminals.dtinsert))
        .limit(pageSize)
        .offset(offset),

      db
        .select({ count: terminals.id })
        .from(terminals)
        .where(and(eq(terminals.active, true), whereClause))
        .then((res: { count: number }[]) => res[0]?.count || 0),
    ]);

    return {
      terminals: terminalsList,
      totalCount,
    };
  } catch (error) {
    console.error("Erro ao buscar terminais:", error);
    throw new Error("Erro ao buscar terminais");
  }
}

export async function getTerminalById(slug: string) {
  try {
    const terminal = await db
      .select({
        slug: terminals.slug,
        logicalNumber: terminals.logicalNumber,
        model: terminals.model,
        manufacturer: terminals.manufacturer,
        serialNumber: terminals.serialNumber,
        type: terminals.type,
        status: terminals.status,
        pinpadSerialNumber: terminals.pinpadSerialNumber,
        pinpadFirmware: terminals.pinpadFirmware,
        slugMerchant: terminals.slugMerchant,
        slugCustomer: terminals.slugCustomer,
      })
      .from(terminals)
      .where(and(eq(terminals.slug, slug), eq(terminals.active, true)))
      .then((res) => res[0] || null);

    return terminal;
  } catch (error) {
    console.error("Erro ao buscar terminal:", error);
    throw new Error("Erro ao buscar terminal");
  }
}
