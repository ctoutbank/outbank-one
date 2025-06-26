"use server";

import { UserMerchantsAccess } from "@/features/users/server/users";
import { db } from "@/server/db";
import { and, count, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import {
  addresses,
  categories,
  configurations,
  legalNatures,
  merchantPrice,
  merchants,
  salesAgents,
  transactions,
} from "../../../../drizzle/schema";

// Tipo para o gráfico A - Estabelecimentos cadastrados por período
export type MerchantRegistrationChart = {
  date: string;
  count: number;
};

// Tipo para sumário de estabelecimentos por período
export type MerchantRegistrationSummary = {
  currentMonth: number;
  previousMonth: number;
  currentWeek: number;
  today: number;
};

// Tipo para o gráfico B - Transaciona/Não Transaciona
export type MerchantTransactionChart = {
  name: string;
  value: number;
};

// Tipo para o gráfico C - Compulsória/Eventual
export type MerchantTypeChart = {
  name: string;
  value: number;
};
// Tipo para o gráfico de região
export type MerchantRegionChart = {
  name: string; // Nome da região (ex: "Sudeste", "Norte", etc.)
  value: number; // Quantidade de estabelecimentos
};

// Tipo para o gráfico de transação por turno
export type TransactionShiftChart = {
  name: string; // Nome do turno (Manhã, Tarde, Noite, Madrugada)
  value: number; // Quantidade de transações
};

// Tipo para o gráfico de transações aprovadas e negadas
export type TransactionStatusChart = {
  name: string; // "Aprovada" ou "Negada"
  value: number; // Quantidade de transações
};

// Cache para condições de filtro
let lastFilterKey: string = "";
let lastFilterConditions: any[] = [];

// Função auxiliar para criar as condições de filtro
export async function createFilterConditions(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
) {
  // Criar uma chave única para esta combinação de filtros
  const filterKey = JSON.stringify({
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent,
  });

  // Se já calculamos estas condições, reutilizar
  if (filterKey === lastFilterKey && lastFilterConditions.length > 0) {
    return [...lastFilterConditions]; // Retornar uma cópia para evitar mutações
  }

  const conditions = [];

  // Get user's merchant access

  // If user doesn't have full access, add merchant ID filter
  if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
    conditions.push(inArray(merchants.id, userAccess.idMerchants));
  } else if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    // Se o usuário não tem acesso, retorna uma condição impossível
    conditions.push(eq(merchants.id, -1));
  }

  if (search) {
    conditions.push(
      or(
        ilike(merchants.name, `%${search}%`),
        ilike(merchants.corporateName, `%${search}%`)
      )
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status) {
    // Verifica qual status KYC está sendo solicitado e aplica os filtros correspondentes
    if (status === "all") {
      // Não aplica nenhum filtro de status
    } else if (status === "PENDING") {
      // Status de análise (pendentes)
      conditions.push(
        inArray(merchants.riskAnalysisStatus, [
          "PENDING",
          "WAITINGDOCUMENTS",
          "NOTANALYSED",
        ])
      );
    } else if (status === "APPROVED") {
      // Aprovados
      conditions.push(eq(merchants.riskAnalysisStatus, "APPROVED"));
    } else if (status === "DECLINED") {
      // Recusados/rejeitados
      conditions.push(
        inArray(merchants.riskAnalysisStatus, ["DECLINED", "KYCOFFLINE"])
      );
    } else {
      // Caso seja outro status específico, usa o valor diretamente
      conditions.push(eq(merchants.riskAnalysisStatus, status));
    }
  }

  if (state) {
    conditions.push(eq(addresses.state, state));
  }

  if (dateFrom) {
    // Quando um dateFrom é fornecido, vamos interpretar como "cadastrado em"
    // e criar um filtro para pegar registros daquele dia específico
    const date = new Date(dateFrom);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Início e fim do dia específico
    const startOfDay = new Date(year, month, day, 0, 0, 0).toISOString();
    const endOfDay = new Date(year, month, day, 23, 59, 59, 999).toISOString();

    conditions.push(
      and(
        gte(merchants.dtinsert, startOfDay),
        lte(merchants.dtinsert, endOfDay)
      )
    );
  }

  // Novos filtros
  if (email) {
    conditions.push(ilike(merchants.email, `%${email}%`));
  }

  if (cnpj) {
    conditions.push(ilike(merchants.idDocument, `%${cnpj}%`));
  }

  if (active === "true") {
    conditions.push(eq(merchants.active, true));
  } else if (active === "false") {
    conditions.push(eq(merchants.active, false));
  }

  if (salesAgent) {
    conditions.push(ilike(salesAgents.firstName, `%${salesAgent}%`));
  }

  // Salvar as condições para reutilização
  lastFilterKey = filterKey;
  lastFilterConditions = [...conditions];

  return conditions;
}

// Função para obter dados do gráfico A - Postos cadastrados por período
export async function getMerchantRegistrationsByPeriod(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantRegistrationChart[]> {
  // Obter data atual e calcular datas do mês atual e mês anterior
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Primeiro dia do mês anterior
  const firstDayPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
  const firstDayPreviousMonthStr = firstDayPreviousMonth.toISOString();

  // Criar condições de filtro
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // Garantir que pelo menos mostre dados dos últimos dois meses
  // se não estiver filtrando por "Cadastrado Em"
  if (!dateFrom) {
    const dateCondition = gte(merchants.dtinsert, firstDayPreviousMonthStr);
    filterConditions.push(dateCondition);
  }

  // Consulta direta usando db.select em vez da baseQuery para este caso específico
  const query = db
    .select({
      date: sql<string>`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`,
      count: count(merchants.id),
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id));

  if (filterConditions.length > 0) {
    query.where(and(...filterConditions));
  }

  const results = await query
    .groupBy(sql`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`)
    .orderBy(sql`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`);

  return results.map((item: { date: string; count: any }) => ({
    date: item.date,
    count: Number(item.count),
  }));
}

// Função para obter sumário de estabelecimentos por períodos (mês atual, mês anterior, semana atual, hoje)
export async function getMerchantRegistrationSummary(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantRegistrationSummary> {
  const now = new Date();

  // Datas para os períodos
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayStr = today.toISOString();

  // Primeiro dia da semana atual (considerando que a semana começa no domingo = 0)
  const currentDay = now.getDay(); // 0 (domingo) a 6 (sábado)
  const firstDayOfWeek = new Date(now);
  firstDayOfWeek.setDate(now.getDate() - currentDay);
  const firstDayOfWeekStr = firstDayOfWeek.toISOString();

  // Primeiro dia do mês atual
  const firstDayCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayCurrentMonthStr = firstDayCurrentMonth.toISOString();

  // Primeiro dia do mês anterior
  const firstDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );
  const firstDayPreviousMonthStr = firstDayPreviousMonth.toISOString();

  // Último dia do mês anterior
  const lastDayPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59,
    999
  );
  const lastDayPreviousMonthStr = lastDayPreviousMonth.toISOString();

  // Criar condições de filtro base
  const baseFilterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // Criar queries para cada período em paralelo
  const [
    currentMonthResult,
    previousMonthResult,
    currentWeekResult,
    todayResult,
  ] = await Promise.all([
    // Mês atual
    getMerchantCountForPeriod(
      baseFilterConditions,
      firstDayCurrentMonthStr,
      now.toISOString()
    ),
    // Mês anterior
    getMerchantCountForPeriod(
      baseFilterConditions,
      firstDayPreviousMonthStr,
      lastDayPreviousMonthStr
    ),
    // Semana atual
    getMerchantCountForPeriod(
      baseFilterConditions,
      firstDayOfWeekStr,
      now.toISOString()
    ),
    // Hoje
    getMerchantCountForPeriod(
      baseFilterConditions,
      todayStr,
      now.toISOString()
    ),
  ]);

  return {
    currentMonth: currentMonthResult,
    previousMonth: previousMonthResult,
    currentWeek: currentWeekResult,
    today: todayResult,
  };
}

// Função auxiliar para obter contagem de merchants para um período específico
async function getMerchantCountForPeriod(
  baseConditions: any[],
  startDate: string,
  endDate: string
): Promise<number> {
  const conditions = [...baseConditions];

  // Adicionar condições de data
  conditions.push(
    and(gte(merchants.dtinsert, startDate), lte(merchants.dtinsert, endDate))
  );

  // Usar consulta direta em vez da baseQuery
  const query = db
    .select({
      count: count(),
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id));

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const result = await query;
  return Number(result[0]?.count || 0);
}

// Função para obter dados do gráfico B - Transaciona/Não Transaciona
export async function getMerchantTransactionData(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantTransactionChart[]> {
  // Criar condições de filtro
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // Executar consultas em paralelo
  const [transacionamResult, naoTransacionamResult] = await Promise.all([
    // Consulta para estabelecimentos que transacionam (com transações)
    countMerchantsWithTransactions(filterConditions, true),

    // Consulta para estabelecimentos que não transacionam (sem transações)
    countMerchantsWithTransactions(filterConditions, false),
  ]);

  // Montar resultado no formato esperado
  return [
    {
      name: "Transacionam",
      value: transacionamResult,
    },
    {
      name: "Não Transacionam",
      value: naoTransacionamResult,
    },
  ];
}

// Função auxiliar para contagem de merchants com/sem transações
async function countMerchantsWithTransactions(
  baseConditions: any[],
  hasTransactions: boolean
): Promise<number> {
  // Copiar as condições base
  const conditions = [...baseConditions];

  // Aplicar a condição que determina se o merchant tem transações (usando hasPix como exemplo)
  conditions.push(eq(merchants.hasPix, hasTransactions));

  const query = db
    .select({
      count: count(),
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id));

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const result = await query;
  return Number(result[0]?.count || 0);
}

// Função para obter dados do gráfico C - Compulsória/Eventual
export async function getMerchantTypeData(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantTypeChart[]> {
  // Criar condições de filtro
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // Executar consultas em paralelo
  const [compulsoriaResult, eventualResult] = await Promise.all([
    // Consulta para estabelecimentos de compra compulsória
    countMerchantsByType(filterConditions, "compulsória"),

    // Consulta para estabelecimentos de compra eventual
    countMerchantsByType(filterConditions, "eventual"),
  ]);

  // Montar resultado no formato esperado
  return [
    {
      name: "Compulsória",
      value: compulsoriaResult,
    },
    {
      name: "Eventual",
      value: eventualResult,
    },
  ];
}

// Função auxiliar para contagem de merchants por tipo
async function countMerchantsByType(
  baseConditions: any[],
  type: string
): Promise<number> {
  // Copiar as condições base
  const conditions = [...baseConditions];

  // Aplicar a condição que determina o tipo do merchant (usando hasTef como exemplo)
  if (type === "compulsória") {
    conditions.push(eq(merchants.hasTef, true));
  } else {
    conditions.push(eq(merchants.hasTef, false));
  }

  const query = db
    .select({
      count: count(),
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id));

  if (conditions.length > 0) {
    query.where(and(...conditions));
  }

  const result = await query;
  return Number(result[0]?.count || 0);
}

//Mapeamento de estados por região
const STATE_TO_REGION: Record<string, string> = {
  AC: "Norte",
  AP: "Norte",
  AM: "Norte",
  PA: "Norte",
  RO: "Norte",
  RR: "Norte",
  TO: "Norte",
  AL: "Nordeste",
  BA: "Nordeste",
  CE: "Nordeste",
  MA: "Nordeste",
  PB: "Nordeste",
  PE: "Nordeste",
  PI: "Nordeste",
  RN: "Nordeste",
  SE: "Nordeste",
  DF: "Centro-Oeste",
  GO: "Centro-Oeste",
  MT: "Centro-Oeste",
  MS: "Centro-Oeste",
  ES: "Sudeste",
  MG: "Sudeste",
  RJ: "Sudeste",
  SP: "Sudeste",
  PR: "Sul",
  RS: "Sul",
  SC: "Sul",
};

export async function getMerchantsGroupedByRegion(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<MerchantRegionChart[]> {
  console.log("🔍 getMerchantsGroupedByRegion called with:", {
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent,
  });
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  const query = db
    .select({
      state: addresses.state,
      total: count(),
    })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id));

  if (filterConditions.length > 0) {
    query.where(and(...filterConditions));
  }

  const stateResults = await query.groupBy(addresses.state);

  const regionMap: Record<string, number> = {};

  for (const { state, total } of stateResults) {
    if (!state) continue;

    const region = STATE_TO_REGION[state.trim().toUpperCase()] || "Sudeste";
    regionMap[region] = (regionMap[region] || 0) + Number(total);
  }

  return Object.entries(regionMap).map(([region, value]) => ({
    name: region,
    value,
  }));
}

export async function getTransactionsGroupedByShift(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<TransactionShiftChart[]> {
  // Criar condições de filtro aplicados aos merchants
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // 1. Buscar slugs dos merchants filtrados
  const merchantSlugsResult = await db
    .select({ slug: merchants.slug })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...filterConditions));

  const merchantSlugs = merchantSlugsResult
    .map((m) => m.slug)
    .filter((slug): slug is string => !!slug);

  // 2. Se não tiver merchants após filtro, retorna todos os turnos zerados
  if (merchantSlugs.length === 0) {
    return [
      { name: "Manhã", value: 0 },
      { name: "Tarde", value: 0 },
      { name: "Noite", value: 0 },
      { name: "Madrugada", value: 0 },
    ];
  }

  // 3. Buscar transações associadas aos merchants filtrados
  const transactionsResult = await db
    .select({ dtInsert: transactions.dtInsert })
    .from(transactions)
    .where(inArray(transactions.slugMerchant, merchantSlugs));

  // 4. Agrupar transações por turno
  const shiftMap: Record<string, number> = {
    Manhã: 0,
    Tarde: 0,
    Noite: 0,
    Madrugada: 0,
  };

  for (const { dtInsert } of transactionsResult) {
    if (!dtInsert) continue;

    const hour = new Date(dtInsert).getHours();

    const shift =
      hour >= 6 && hour < 12
        ? "Manhã"
        : hour >= 12 && hour < 18
          ? "Tarde"
          : hour >= 18 && hour < 24
            ? "Noite"
            : "Madrugada";

    shiftMap[shift]++;
  }

  // 5. Retornar no formato esperado pelo front
  return Object.entries(shiftMap).map(([name, value]) => ({
    name,
    value,
  }));
}

export async function getTransactionStatusData(
  userAccess: UserMerchantsAccess,
  search?: string,
  establishment?: string,
  status?: string,
  state?: string,
  dateFrom?: string,
  email?: string,
  cnpj?: string,
  active?: string,
  salesAgent?: string
): Promise<TransactionStatusChart[]> {
  // Criar condições de filtro aplicados aos merchants
  const filterConditions = await createFilterConditions(
    userAccess,
    search,
    establishment,
    status,
    state,
    dateFrom,
    email,
    cnpj,
    active,
    salesAgent
  );

  // 1. Buscar slugs dos merchants filtrados
  const merchantSlugsResult = await db
    .select({ slug: merchants.slug })
    .from(merchants)
    .leftJoin(addresses, eq(merchants.idAddress, addresses.id))
    .leftJoin(salesAgents, eq(merchants.idSalesAgent, salesAgents.id))
    .leftJoin(configurations, eq(merchants.idConfiguration, configurations.id))
    .leftJoin(merchantPrice, eq(merchants.idMerchantPrice, merchantPrice.id))
    .leftJoin(legalNatures, eq(merchants.idLegalNature, legalNatures.id))
    .leftJoin(categories, eq(merchants.idCategory, categories.id))
    .where(and(...filterConditions));

  const merchantSlugs = merchantSlugsResult
    .map((m) => m.slug)
    .filter((slug): slug is string => !!slug);

  // 2. Se não tiver merchants após filtro, retorna todos os status zerados
  if (merchantSlugs.length === 0) {
    return [
      { name: "Aprovada", value: 0 },
      { name: "Negada", value: 0 },
    ];
  }

  // 3. Buscar transações associadas aos merchants filtrados
  const transactionsResult = await db
    .select({
      status: transactions.transactionStatus,
      count: count(),
    })
    .from(transactions)
    .where(inArray(transactions.slugMerchant, merchantSlugs))
    .groupBy(transactions.transactionStatus);

  // 4. Montar o mapa com contagem
  const statusMap: Record<string, number> = {
    AUTHORIZED: 0,
    DENIED: 0,
  };

  for (const { status, count: total } of transactionsResult) {
    if (status === "AUTHORIZED") {
      statusMap.AUTHORIZED += Number(total);
    } else if (status === "DENIED") {
      statusMap.DENIED += Number(total);
    }
  }

  // 5. Retornar no formato esperado
  return [
    {
      name: "Aprovada",
      value: statusMap.AUTHORIZED,
    },
    {
      name: "Negada",
      value: statusMap.DENIED,
    },
  ];
}
