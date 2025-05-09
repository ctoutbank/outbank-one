import { getUserMerchantSlugs } from "@/features/users/server/users";
import { convertUTCToSaoPaulo, getDateUTC } from "@/lib/datetime-utils";
import { db } from "@/server/db";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  like,
  or,
  sql,
} from "drizzle-orm";
import { customers, merchants, terminals } from "../../../../drizzle/schema";

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
  modelosAtivos: string[];
  modelosAtivosDetalhes: ModeloAtivo[];
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
          desativadosCount: 0,
          totalModelosAtivos: 0,
          modelosAtivos: [],
          modelosAtivosDetalhes: [],
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

    if (filters?.dateFrom && filters.dateFrom.trim() !== "") {
      const dateFromUTC = getDateUTC(filters.dateFrom, "America/Sao_Paulo");
      if (dateFromUTC) {
        conditions.push(sql`${terminals.dtinsert} >= ${dateFromUTC}`);
        console.log(`Filtro dateFrom aplicado: ${dateFromUTC}`);
      }
    }

    if (filters?.dateTo && filters.dateTo.trim() !== "") {
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      const dateToUTC = getDateUTC(dateTo.toISOString(), "America/Sao_Paulo");
      if (dateToUTC) {
        conditions.push(sql`${terminals.dtinsert} <= ${dateToUTC}`);
        console.log(`Filtro dateTo aplicado: ${dateToUTC}`);
      }
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
      conditions.push(like(merchants.name, `%${filters.estabelecimento}%`));
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

    console.log("Condições de filtro aplicadas:", conditions.length);

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
      .where(whereClause);
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

    // Obter lista de modelos ativos distintos com contagem
    const activeModelsDetailResult = await db
      .select({
        model: terminals.model,
        count: count(),
      })
      .from(terminals)
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

    const activeModels = activeModelsDetails
      .map((item) => item.nome)
      .filter(Boolean);

    return {
      terminals: result.map((terminal) => ({
        slug: terminal.slug || "",
        logicalNumber: terminal.logicalNumber || "",
        model: terminal.model || "",
        dtinsert: terminal.dtinsert
          ? new Date(convertUTCToSaoPaulo(terminal.dtinsert))
          : new Date(),
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
      modelosAtivos: activeModels,
      modelosAtivosDetalhes: activeModelsDetails,
      pendingCount: result.filter((t) => t.status === "PENDING").length,
      approvedCount: result.filter((t) => t.status === "APPROVED").length,
      rejectedCount: result.filter((t) => t.status === "REJECTED").length,
    };
  } catch (error) {
    console.error("Erro ao buscar terminais:", error);
    throw new Error("Erro ao buscar terminais");
  }
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
    dateFrom?: string;
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

    // Construir condições de filtro
    const conditions = [];

    // Aplicar filtros de acesso por merchant
    if (!userMerchants.fullAccess) {
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

    // Aplicar filtros da pesquisa
    if (search && search.trim() !== "") {
      conditions.push(
        or(
          ilike(terminals.logicalNumber, `%${search}%`),
          ilike(terminals.serialNumber, `%${search}%`),
          ilike(terminals.model, `%${search}%`),
          ilike(merchants.name, `%${search}%`)
        )
      );
    }

    // Aplicar filtros específicos
    if (filters?.status && filters.status.trim() !== "") {
      conditions.push(ilike(terminals.status, `%${filters.status}%`));
    }

    if (filters?.numeroLogico && filters.numeroLogico.trim() !== "") {
      conditions.push(
        ilike(terminals.logicalNumber, `%${filters.numeroLogico}%`)
      );
    }

    if (filters?.numeroSerial && filters.numeroSerial.trim() !== "") {
      conditions.push(
        ilike(terminals.serialNumber, `%${filters.numeroSerial}%`)
      );
    }

    if (filters?.estabelecimento && filters.estabelecimento.trim() !== "") {
      conditions.push(ilike(merchants.name, `%${filters.estabelecimento}%`));
    }

    if (filters?.modelo && filters.modelo.trim() !== "") {
      conditions.push(ilike(terminals.model, `%${filters.modelo}%`));
    }

    // Adicionar filtro de provedor
    if (filters?.provedor && filters.provedor.trim() !== "") {
      conditions.push(ilike(terminals.manufacturer, `%${filters.provedor}%`));
    }

    // Filtro de data
    if (filters?.dateFrom && filters.dateFrom.trim() !== "") {
      console.log(filters?.dateFrom);
      const dateFromUTC = getDateUTC(filters.dateFrom, "America/Sao_Paulo");
      console.log(dateFromUTC);
      if (dateFromUTC) {
        conditions.push(sql`${terminals.dtinsert} >= ${dateFromUTC}`);
      }
    }

    if (filters?.dateTo && filters.dateTo.trim() !== "") {
      console.log(filters?.dateTo);
      const dateTo = new Date(filters.dateTo);
      dateTo.setHours(23, 59, 59, 999);
      const dateToUTC = getDateUTC(dateTo.toISOString(), "America/Sao_Paulo");
      console.log(dateToUTC);
      if (dateToUTC) {
        conditions.push(sql`${terminals.dtinsert} <= ${dateToUTC}`);
      }
    }

    console.log("Condições de filtro para exportação:", conditions.length);

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Usar agregação para evitar duplicações
    const terminalsQuery = db
      .select({
        slug: terminals.slug,
        logicalNumber: terminals.logicalNumber,
        model: terminals.model,
        dtinsert: terminals.dtinsert,
        serialNumber: terminals.serialNumber,
        type: terminals.type,
        status: terminals.status,
        isActive: terminals.active,
        slugMerchant: terminals.slugMerchant,
        merchantName: merchants.name,
        merchantDocumentId: merchants.idDocument,
        slugCustomer: terminals.slugCustomer,
        customerName: customers.name,
        inactivationDate: terminals.inactivationDate,
        manufacturer: terminals.manufacturer,
      })
      .from(terminals)
      .leftJoin(merchants, eq(terminals.slugMerchant, merchants.slug))
      .leftJoin(customers, eq(terminals.slugCustomer, customers.slug))
      .where(whereClause)
      .orderBy(asc(terminals.logicalNumber));

    // Executar a consulta principal e contar os resultados
    const result = await terminalsQuery;
    const totalCount = result.length;

    // Inicializar o mapa de últimas transações
    const ultimasTransacoesMap = new Map<string, string>();

    // Buscar as datas das últimas transações se houver terminais no resultado
    if (result.length > 0) {
      const slugsTerminais = result
        .map((terminal) => terminal.slug)
        .filter(Boolean);

      if (slugsTerminais.length > 0) {
        try {
          // Limite a quantidade de slugs para evitar consultas muito grandes
          const slugsParaConsulta = slugsTerminais
            .filter(
              (slug): slug is string =>
                typeof slug === "string" && slug !== null && slug !== ""
            )
            .slice(0, 500);

          if (slugsParaConsulta.length > 0) {
            // Escape dos slugs para evitar SQL injection
            const terminaisString = slugsParaConsulta
              .map((slug) => `'${slug.replace(/'/g, "''")}'`)
              .join(",");

            if (terminaisString && terminaisString.trim() !== "") {
              console.log(
                `Consultando últimas transações para ${slugsParaConsulta.length} terminais`
              );

              // Consulta SQL direta
              const consultaSQL = `
                SELECT 
                  slug_terminal, 
                  MAX(dt_insert) AS ultima_transacao
                FROM 
                  transactions
                WHERE 
                  slug_terminal IN (${terminaisString})
                GROUP BY 
                  slug_terminal
              `;

              try {
                // Executa a consulta SQL com tratamento de erro
                const resultadoConsulta = await db.execute(
                  sql.raw(consultaSQL)
                );

                if (resultadoConsulta && resultadoConsulta.rows) {
                  console.log(
                    "Resultados encontrados:",
                    resultadoConsulta.rows.length
                  );

                  // Preenche o mapa com os resultados
                  resultadoConsulta.rows.forEach((row: any) => {
                    if (row.slug_terminal && row.ultima_transacao) {
                      ultimasTransacoesMap.set(
                        row.slug_terminal,
                        row.ultima_transacao
                      );
                    }
                  });

                  console.log(
                    "Mapa de últimas transações construído, tamanho:",
                    ultimasTransacoesMap.size
                  );
                } else {
                  console.log("Nenhum resultado obtido da consulta SQL");
                }
              } catch (sqlError) {
                console.error("Erro na execução da consulta SQL:", sqlError);
              }
            }
          }
        } catch (error) {
          console.error(
            "Erro ao processar consulta de últimas transações:",
            error
          );
        }
      }
    }

    return {
      terminals: result.map((terminal) => {
        // Obter a data da última transação do mapa
        const dtUltimaTransacao = ultimasTransacoesMap.get(terminal.slug || "");

        return {
          slug: terminal.slug || "",
          logicalNumber: terminal.logicalNumber || "",
          model: terminal.model || "",
          dtinsert: terminal.dtinsert
            ? new Date(convertUTCToSaoPaulo(terminal.dtinsert))
            : new Date(),
          serialNumber: terminal.serialNumber || "",
          type: terminal.type || "",
          isActive: terminal.isActive || null,
          slugMerchant: terminal.slugMerchant || "",
          merchantName: terminal.merchantName || "",
          merchantDocumentId: terminal.merchantDocumentId || "",
          slugCustomer: terminal.slugCustomer || "",
          status: terminal.status || "",
          customerName: terminal.customerName || "",
          manufacturer: terminal.manufacturer || "",
          inactivationDate: terminal.inactivationDate
            ? new Date(convertUTCToSaoPaulo(terminal.inactivationDate))
            : null,
          dtUltimaTransacao: dtUltimaTransacao
            ? new Date(convertUTCToSaoPaulo(dtUltimaTransacao))
            : terminal.dtinsert
            ? new Date(convertUTCToSaoPaulo(terminal.dtinsert))
            : null,
          versao: null, // Campo não disponível no schema atual
        };
      }),
      totalCount,
    };
  } catch (error) {
    console.error("Erro ao buscar terminais para exportação:", error);
    throw new Error("Erro ao buscar terminais para exportação");
  }
}
