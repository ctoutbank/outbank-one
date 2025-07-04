import { getUserMerchantSlugs } from "@/features/users/server/users";
import { convertUTCToSaoPaulo } from "@/lib/datetime-utils";
import { db } from "@/server/db";
import {
  and,
  count,
  desc,
  eq,
  ilike,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";
import { merchants, terminals } from "../../../../drizzle/schema";

// Mapeamento de mês para sigla em português
const MESES_PT = [
  "",
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];
function getMesAbreviado(mes: number): string {
  return MESES_PT[mes] || "";
}

export async function getTerminalss(
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
      .where(and(...conditions))
      .then((res) => res[0] || null);

    return terminal
      ? {
          ...terminal,
          merchantName: terminal.merchantName?.toUpperCase() || "",
        }
      : null;
  } catch (error) {
    console.error("Erro ao buscar terminal:", error);
    throw new Error("Erro ao buscar terminal");
  }
}

export type TerminalFull = {
  slug: string | null;
  logicalNumber: string | null;
  model: string | null;
  dtinsert: string | null;
  serialNumber: string | null;
  type: string | null;
  status: string | null;
  isActive: boolean | null;
  slugMerchant: string | null;
  merchantName: string | null;
  merchantDocumentId: string | null;
  slugCustomer: string | null;
  customerName?: string | null;
  inactivationDate?: Date | null;
  dtUltimaTransacao?: Date | null;
  versao?: string | null;
  manufacturer?: string | null;
};

export type ModeloAtivo = {
  nome: string;
  quantidade: number;
};

export type EvolucaoMensal = {
  mes: string;
  valor: number;
};

export interface TerminallsList {
  terminals: TerminalFull[];
  totalCount: number;
  activeCount: number;
  inactiveCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  modelosAtivosDetalhes: ModeloAtivo[];
  evolucaoData: EvolucaoMensal[];
}

export type TerminalesDetail = typeof terminals.$inferSelect;

export async function getTerminals(
  search: string,
  page: number,
  pageSize: number,
  filters?: {
    status?: string;
    dateTo?: string;
    numeroLogico?: string;
    numeroSerial?: string;
    estabelecimento?: string;
    modelo?: string;
    provedor?: string;
  }
): Promise<TerminallsList> {
  try {
    const offset = (page - 1) * pageSize;

    const conditions = [];

    // Verificar permissões de usuário
    const userMerchants = await getUserMerchantSlugs();
    if (!userMerchants.fullAccess) {
      if (userMerchants.slugMerchants.length > 0) {
        conditions.push(
          inArray(terminals.slugMerchant, userMerchants.slugMerchants)
        );
      } else {
        // Usuário sem acesso a nenhum merchant, retornar vazio
        return {
          terminals: [],
          totalCount: 0,
          activeCount: 0,
          inactiveCount: 0,
          pendingCount: 0,
          approvedCount: 0,
          rejectedCount: 0,
          modelosAtivosDetalhes: [],
          evolucaoData: [],
        };
      }
    }

    // Adiciona busca geral se houver
    if (search && search.trim() !== "") {
      conditions.push(
        or(
          like(terminals.slug, `%${search}%`),
          like(terminals.logicalNumber, `%${search}%`),
          like(terminals.model, `%${search}%`),
          like(merchants.name, `%${search}%`)
        )
      );
    }

    // Adiciona filtros específicos com verificação de valores vazios
    if (filters?.status && filters.status.trim() !== "") {
      conditions.push(eq(terminals.status, filters.status));
      console.log(`Filtro status aplicado: ${filters.status}`);
    }

    if (filters?.dateTo && filters.dateTo.trim() !== "") {
      console.log(filters.dateTo);
      conditions.push(sql`DATE(${terminals.dtinsert})  = ${filters.dateTo}`);
    }

    if (filters?.numeroLogico && filters.numeroLogico.trim() !== "") {
      conditions.push(
        like(terminals.logicalNumber, `%${filters.numeroLogico}%`)
      );
      console.log(`Filtro numeroLogico aplicado: ${filters.numeroLogico}`);
    }

    if (filters?.numeroSerial && filters.numeroSerial.trim() !== "") {
      conditions.push(
        like(terminals.serialNumber, `%${filters.numeroSerial}%`)
      );
      console.log(`Filtro numeroSerial aplicado: ${filters.numeroSerial}`);
    }

    if (filters?.estabelecimento && filters.estabelecimento.trim() !== "") {
      conditions.push(ilike(merchants.name, `%${filters.estabelecimento}%`));
      console.log(
        `Filtro estabelecimento aplicado: ${filters.estabelecimento}`
      );
    }

    if (filters?.modelo && filters.modelo.trim() !== "") {
      conditions.push(like(terminals.model, `%${filters.modelo}%`));
      console.log(`Filtro modelo aplicado: ${filters.modelo}`);
    }

    if (filters?.provedor && filters.provedor.trim() !== "") {
      conditions.push(like(terminals.manufacturer, `%${filters.provedor}%`));
      console.log(`Filtro provedor aplicado: ${filters.provedor}`);
    }

    // Se não houver condições, retorna todos
    if (conditions.length === 0) {
      conditions.push(eq(terminals.id, terminals.id)); // condição sempre verdadeira
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

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
      .where(whereClause)
      .orderBy(desc(terminals.id))
      .limit(pageSize)
      .offset(offset);

    const totalCountResult = await db
      .select({ count: count() })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .where(whereClause);
    const totalCount = totalCountResult[0]?.count || 0;

    // Contagem precisa de terminais ativos
    const activeCountResult = await db
      .select({ count: count() })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
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
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .where(and(eq(terminals.status, "INACTIVE"), ...conditions));
    const totalInactiveCount = inactiveCountResult[0]?.count || 0;

    // Obter lista de modelos ativos distintos com contagem
    const activeModelsDetailResult = await db
      .select({
        model: terminals.model,
        count: count(),
      })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .where(
        and(
          eq(terminals.active, true),
          eq(terminals.status, "ACTIVE"),
          ...conditions
        )
      )
      .groupBy(terminals.model)
      .orderBy(desc(count()));

    const activeModelsDetails = activeModelsDetailResult
      .filter((item) => item.model)
      .map((item) => ({
        nome: item.model || "",
        quantidade: Number(item.count) || 0,
      }));

    const evolucaoDataRaw = await db
      .select({
        mes: sql<number>`EXTRACT(MONTH FROM ${terminals.dtinsert})`,
        ano: sql<number>`EXTRACT(YEAR FROM ${terminals.dtinsert})`,
        valor: sql<number>`COUNT(*)`,
      })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .where(
        and(
          eq(terminals.active, true),
          eq(terminals.status, "ACTIVE"),
          ...conditions
        )
      )
      .groupBy(
        sql`EXTRACT(YEAR FROM ${terminals.dtinsert})`,
        sql`EXTRACT(MONTH FROM ${terminals.dtinsert})`
      )
      .orderBy(
        sql`EXTRACT(YEAR FROM ${terminals.dtinsert})`,
        sql`EXTRACT(MONTH FROM ${terminals.dtinsert})`
      );

    const evolucaoData = evolucaoDataRaw.map((item) => ({
      mes: getMesAbreviado(item.mes),
      ano: item.ano,
      valor: item.valor,
    }));

    return {
      terminals: result.map((terminal) => ({
        slug: terminal.slug || "",
        logicalNumber: terminal.logicalNumber || "",
        model: terminal.model || "",
        dtinsert: terminal.dtinsert,
        serialNumber: terminal.serialNumber || "",
        type: terminal.type || "",
        isActive: terminal.isActive || null,
        slugMerchant: terminal.slugMerchant || "",
        merchantName: terminal.merchantName?.toUpperCase() || "",
        merchantDocumentId: terminal.merchantDocumentId || "",
        slugCustomer: terminal.slugCustomer || "",
        status: terminal.status || "",
      })),
      totalCount,
      activeCount: totalActiveCount,
      inactiveCount: totalInactiveCount,
      modelosAtivosDetalhes: activeModelsDetails,
      pendingCount: result.filter((t) => t.status === "PENDING").length,
      approvedCount: result.filter((t) => t.status === "APPROVED").length,
      rejectedCount: result.filter((t) => t.status === "REJECTED").length,
      evolucaoData: evolucaoData,
    };
  } catch (error) {
    console.error("Erro ao buscar terminais:", error);
    throw new Error("Erro ao buscar terminais");
  }
}

export async function getTerminalsPorModelo() {
  const result = await db
    .select({
      nome: terminals.model,
      quantidade: sql<number>`COUNT(*)`,
    })
    .from(terminals)
    .groupBy(terminals.model);

  return result.filter((item) => item.nome !== null);
}

export async function getTerminalBySlug(slug: string) {
  const terminal = await db
    .select()
    .from(terminals)
    .where(eq(terminals.slug, slug));
  return terminal[0] || null;
}

export interface TerminalsExportList {
  terminals: TerminalFull[];
  totalCount: number;
}

export async function getTerminalsForExport(
  search: string,
  filters?: {
    status?: string;
    dateTo?: string;
    numeroLogico?: string;
    numeroSerial?: string;
    estabelecimento?: string;
    modelo?: string;
    provedor?: string;
  }
): Promise<TerminalsExportList> {
  try {
    const userMerchants = await getUserMerchantSlugs();
    const whereParts: any[] = [];

    // Montar partes do WHERE usando sql``
    if (!userMerchants.fullAccess) {
      if (userMerchants.slugMerchants.length > 0) {
        whereParts.push(
          sql`t.slug_merchant IN (${sql.join(userMerchants.slugMerchants, sql`, `)})`
        );
      } else {
        return { terminals: [], totalCount: 0 };
      }
    }
    if (search && search.trim() !== "") {
      const s = `%${search}%`;
      whereParts.push(sql`(
        t.logical_number ILIKE ${s} OR
        t.serial_number ILIKE ${s} OR
        t.model ILIKE ${s} OR
        m.name ILIKE ${s}
      )`);
    }
    if (filters?.status && filters.status.trim() !== "") {
      whereParts.push(sql`t.status ILIKE ${`%${filters.status}%`}`);
    }
    if (filters?.numeroLogico && filters.numeroLogico.trim() !== "") {
      whereParts.push(
        sql`t.logical_number ILIKE ${`%${filters.numeroLogico}%`}`
      );
    }
    if (filters?.numeroSerial && filters.numeroSerial.trim() !== "") {
      whereParts.push(
        sql`t.serial_number ILIKE ${`%${filters.numeroSerial}%`}`
      );
    }
    if (filters?.estabelecimento && filters.estabelecimento.trim() !== "") {
      whereParts.push(sql`m.name ILIKE ${`%${filters.estabelecimento}%`}`);
    }
    if (filters?.modelo && filters.modelo.trim() !== "") {
      whereParts.push(sql`t.model ILIKE ${`%${filters.modelo}%`}`);
    }
    if (filters?.provedor && filters.provedor.trim() !== "") {
      whereParts.push(sql`t.manufacturer ILIKE ${`%${filters.provedor}%`}`);
    }
    if (filters?.dateTo && filters.dateTo.trim() !== "") {
      whereParts.push(sql`t.dtinsert::date = ${filters.dateTo}`);
    }
    const whereClause =
      whereParts.length > 0
        ? sql`WHERE ${sql.join(whereParts, sql` AND `)}`
        : sql``;

    const result = await db.execute(sql`
      WITH ultimas_transacoes AS (
        SELECT slug_terminal, MAX(dt_insert) AS dt_ultima_transacao
        FROM transactions
        GROUP BY slug_terminal
      )
      SELECT
        t.slug,
        t.logical_number,
        t.model,
        t.dtinsert,
        t.serial_number,
        t.type,
        t.status,
        t.active,
        t.slug_merchant,
        m.name AS merchant_name,
        m.id_document AS merchant_document_id,
        t.slug_customer,
        c.name AS customer_name,
        t.inactivation_date,
        t.manufacturer,
        ut.dt_ultima_transacao
      FROM terminals t
      LEFT JOIN ultimas_transacoes ut ON ut.slug_terminal = t.slug
      LEFT JOIN merchants m ON t.slug_merchant = m.slug
      LEFT JOIN customers c ON t.slug_customer = c.slug
      ${whereClause}
      ORDER BY t.logical_number ASC
    `);
    const rows = result.rows as any[];
    const terminals = rows.map((terminal) => ({
      slug: terminal.slug || "",
      logicalNumber: terminal.logical_number || "",
      model: terminal.model || "",
      dtinsert: terminal.dtinsert,
      serialNumber: terminal.serial_number || "",
      type: terminal.type || "",
      isActive: terminal.active ?? null,
      slugMerchant: terminal.slug_merchant || "",
      merchantName: terminal.merchant_name?.toUpperCase() || "",
      merchantDocumentId: terminal.merchant_document_id || "",
      slugCustomer: terminal.slug_customer || "",
      status: terminal.status || "",
      customerName: terminal.customer_name || "",
      manufacturer: terminal.manufacturer || "",
      inactivationDate: terminal.inactivation_date
        ? new Date(convertUTCToSaoPaulo(terminal.inactivation_date))
        : null,
      dtUltimaTransacao: terminal.dt_ultima_transacao
        ? new Date(convertUTCToSaoPaulo(terminal.dt_ultima_transacao))
        : terminal.dtinsert
          ? new Date(convertUTCToSaoPaulo(terminal.dtinsert))
          : null,
      versao: null, // Campo não disponível no schema atual
    }));
    return { terminals, totalCount: terminals.length };
  } catch (error) {
    console.error("Erro ao buscar terminais para exportação:", error);
    throw new Error("Erro ao buscar terminais para exportação");
  }
}
