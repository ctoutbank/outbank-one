import { getUserMerchantSlugs } from "@/features/users/server/users";
import { db } from "@/server/db";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { terminals } from "../../../../drizzle/schema";

export async function getTerminals(
  search?: string,
  page: number = 1,
  pageSize: number = 20
) {
  try {
    const offset = (page - 1) * pageSize;
    const conditions = [];

    const userMerchants = await getUserMerchantSlugs();

    if (userMerchants.fullAccess) {
    } else {
      if (userMerchants.slugMerchants.length > 0) {
        conditions.push(
          inArray(terminals.slugMerchant, userMerchants.slugMerchants)
        );
      } else {
        return {
          terminals: [],
          totalCount: 0,
        };
      }
    }

    conditions.push(eq(terminals.active, true));

    if (search) {
      conditions.push(
        or(
          ilike(terminals.slug, `%${search}%`),
          ilike(terminals.logicalNumber, `%${search}%`),
          ilike(terminals.model, `%${search}%`),
          ilike(terminals.manufacturer, `%${search}%`)
        )
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [terminalsList, totalCount] = await Promise.all([
      db
        .select({
          slug: terminals.slug,
          logicalNumber: terminals.logicalNumber,
          model: terminals.model,
          manufacturer: terminals.manufacturer,
        })
        .from(terminals)
        .where(whereClause)
        .orderBy(desc(terminals.dtinsert))
        .limit(pageSize)
        .offset(offset),

      db
        .select({ count: terminals.id })
        .from(terminals)
        .where(whereClause)
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
    const userMerchants = await getUserMerchantSlugs();
    const conditions = [eq(terminals.slug, slug), eq(terminals.active, true)];

    if (!userMerchants.fullAccess) {
      if (userMerchants.slugMerchants.length > 0) {
        conditions.push(
          inArray(terminals.slugMerchant, userMerchants.slugMerchants)
        );
      } else {
        return null;
      }
    }

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
      .where(and(...conditions))
      .then((res) => res[0] || null);

    return terminal;
  } catch (error) {
    console.error("Erro ao buscar terminal:", error);
    throw new Error("Erro ao buscar terminal");
  }
}
