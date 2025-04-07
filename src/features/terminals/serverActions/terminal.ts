import { db } from "@/server/db";
import { and, count, desc, eq, ilike, like, lte, or, sql } from "drizzle-orm";
import { merchants, terminals } from "../../../../drizzle/schema";

export async function getTerminalss(
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
        inactivationDate: terminals.inactivationDate,
        dtinsert: terminals.dtinsert,
        slugMerchant: terminals.slugMerchant,
        slugCustomer: terminals.slugCustomer,
        // Campos do merchant
        merchantName: merchants.name,
        merchantCnpj: merchants.idDocument,
        merchantEmail: merchants.email,
      })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .where(eq(terminals.slug, slug))
      .then((res) => res[0] || null);

    return terminal;
  } catch (error) {
    console.error("Erro ao buscar terminal:", error);
    throw new Error("Erro ao buscar terminal");
  }
}

export type TerminalFull = {
  slug: string | null;
  logicalNumber: string | null;
  model: string | null;
  dtinsert: Date | null;
  serialNumber: string | null;
  type: string | null;
  status: string | null;
  isActive: boolean | null;
  slugMerchant: string | null;
  merchantName: string | null;
  merchantDocumentId: string | null;
  slugCustomer: string | null;
};

export interface TerminallsList {
  terminals: TerminalFull[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  desativadosCount: number;
  totalModelosAtivos: number;
}

export type TerminalesDetail = typeof terminals.$inferSelect;

export async function getTerminals(
  search: string,
  page: number,
  pageSize: number,
  filters?: {
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    numeroLogico?: string;
    numeroSerial?: string;
    estabelecimento?: string;
    modelo?: string;
    provedor?: string;
  }
): Promise<TerminallsList> {
  const offset = (page - 1) * pageSize;

  const conditions = [];

  // Adiciona busca geral se houver
  if (search && search.trim() !== "") {
    conditions.push(
      or(
        like(terminals.slug, `%${search}%`),
        like(terminals.logicalNumber, `%${search}%`),
        like(terminals.model, `%${search}%`)
      )
    );
  }

  // Adiciona filtros específicos
  if (filters?.status) {
    conditions.push(eq(terminals.status, filters.status));
  }

  if (filters?.dateFrom) {
    conditions.push(lte(terminals.dtinsert, filters.dateFrom));
  }

  if (filters?.dateTo) {
    conditions.push(lte(terminals.dtinsert, filters.dateTo));
  }

  if (filters?.numeroLogico) {
    conditions.push(like(terminals.logicalNumber, `%${filters.numeroLogico}%`));
  }

  if (filters?.numeroSerial) {
    conditions.push(like(terminals.serialNumber, `%${filters.numeroSerial}%`));
  }

  if (filters?.estabelecimento) {
    conditions.push(like(merchants.name, `%${filters.estabelecimento}%`));
  }

  if (filters?.modelo) {
    conditions.push(like(terminals.model, `%${filters.modelo}%`));
  }

  if (filters?.provedor) {
    conditions.push(like(terminals.manufacturer, `%${filters.provedor}%`));
  }

  // Se não houver condições, retorna todos
  if (conditions.length === 0) {
    conditions.push(eq(terminals.id, terminals.id)); // condição sempre verdadeira
  }

  const result = await db
    .select({
      slug: terminals.slug,
      logicalNumber: terminals.logicalNumber,
      model: terminals.model,
      dtinsert: terminals.dtinsert,
      serialNumber: terminals.serialNumber,
      type: terminals.type,
      isActive: terminals.active,
      slugMerchant: terminals.slugMerchant,
      merchantName: merchants.name,
      merchantDocumentId: merchants.idDocument,
      slugCustomer: terminals.slugCustomer,
      status: terminals.status,
    })
    .from(terminals)
    .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
    .where(and(...conditions))
    .orderBy(desc(terminals.id))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(terminals)
    .where(and(...conditions));
  const totalCount = totalCountResult[0]?.count || 0;

  // Contagem precisa de terminais ativos
  const activeCountResult = await db
    .select({ count: count() })
    .from(terminals)
    .where(
      and(
        eq(terminals.active, true),
        eq(terminals.status, "ACTIVE"),
        ...conditions
      )
    );
  const totalActiveCount = activeCountResult[0]?.count || 0;

  // Contagem precisa de terminais inativos
  const inactiveCountResult = await db
    .select({ count: count() })
    .from(terminals)
    .where(and(eq(terminals.status, "INACTIVE"), ...conditions));
  const totalInactiveCount = inactiveCountResult[0]?.count || 0;

  // Contagem precisa de terminais desativados
  const desativadosCountResult = await db
    .select({ count: count() })
    .from(terminals)
    .where(and(eq(terminals.active, false), ...conditions));
  const totalDesativadosCount = desativadosCountResult[0]?.count || 0;

  // Contagem de modelos ativos distintos
  const activeModelsCountResult = await db
    .select({ count: count(sql`DISTINCT ${terminals.model}`) })
    .from(terminals)
    .where(
      and(
        eq(terminals.active, true),
        eq(terminals.status, "ACTIVE"),
        ...conditions
      )
    );
  const activeModelsCount = activeModelsCountResult[0]?.count || 0;

  return {
    terminals: result.map((terminal) => ({
      slug: terminal.slug || "",
      logicalNumber: terminal.logicalNumber || "",
      model: terminal.model || "",
      dtinsert: terminal.dtinsert ? new Date(terminal.dtinsert) : new Date(),
      serialNumber: terminal.serialNumber || "",
      type: terminal.type || "",
      isActive: terminal.isActive || null,
      slugMerchant: terminal.slugMerchant || "",
      merchantName: terminal.merchantName || "",
      merchantDocumentId: terminal.merchantDocumentId || "",
      slugCustomer: terminal.slugCustomer || "",
      status: terminal.status || "",
    })),
    totalCount,
    activeCount: totalActiveCount,
    inactiveCount: totalInactiveCount,
    desativadosCount: totalDesativadosCount,
    totalModelosAtivos: activeModelsCount,
    pendingCount: result.filter((t) => t.status === "PENDING").length,
    approvedCount: result.filter((t) => t.status === "APPROVED").length,
    rejectedCount: result.filter((t) => t.status === "REJECTED").length,
  };
}
