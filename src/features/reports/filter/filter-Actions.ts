"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { db } from "@/server/db";
import { and, eq, ilike, inArray, or } from "drizzle-orm";
import {
  brand,
  merchants,
  reportFilters,
  reportFiltersParam,
  reportTypes,
  reports,
  terminals,
} from "../../../../drizzle/schema";

export async function getReportFilters(
  reportId: number
): Promise<ReportFilterDetailWithTypeName[]> {
  const result = await db
    .select({
      id: reportFilters.id,
      idReport: reportFilters.idReport,
      idReportFilterParam: reportFilters.idReportFilterParam,
      value: reportFilters.value,
      dtinsert: reportFilters.dtinsert,
      dtupdate: reportFilters.dtupdate,
      typeName: reportTypes.name,
    })
    .from(reportFilters)
    .leftJoin(
      reportFiltersParam,
      eq(reportFilters.idReportFilterParam, reportFiltersParam.id)
    )
    .leftJoin(reportTypes, eq(reportFiltersParam.type, reportTypes.code))
    .where(eq(reportFilters.idReport, reportId))
    .orderBy(reportFilters.id);

  return result;
}

export type ReportFilterDetail = typeof reportFilters.$inferSelect & {
  typeName: string | null;
};
export type ReportFilterDetailWithTypeName = ReportFilterDetail & {
  typeName: string | null;
};
export type ReportFilterInsert = typeof reportFilters.$inferInsert;
export type ReportFilterParamDetail = typeof reportFiltersParam.$inferSelect;

export async function updateReportFilter(
  data: ReportFilterDetail
): Promise<void> {
  await db
    .update(reportFilters)
    .set({
      idReportFilterParam: data.idReportFilterParam,
      value: data.value,
      dtupdate: new Date().toISOString(),
    })
    .where(eq(reportFilters.id, data.id));
}

export async function insertReportFilter(
  filter: ReportFilterInsert
): Promise<number> {
  const result = await db
    .insert(reportFilters)
    .values({
      idReport: filter.idReport,
      idReportFilterParam: filter.idReportFilterParam,
      value: filter.value,
      dtinsert: new Date().toISOString(),
      dtupdate: new Date().toISOString(),
    })
    .returning({
      id: reportFilters.id,
    });

  return result[0].id;
}

export async function deleteReportFilter(filterId: number): Promise<void> {
  await db.delete(reportFilters).where(eq(reportFilters.id, filterId));
}

export type BrandOption = {
  code: string;
  name: string;
};

export async function getAllBrands(): Promise<BrandOption[]> {
  try {
    const results = await db
      .select({
        code: brand.code,
        name: brand.name,
      })
      .from(brand)
      .orderBy(brand.name);

    return results;
  } catch (error) {
    console.error("Erro ao buscar brands:", error);
    return [];
  }
}

export async function getFilterFormData(reportId: number): Promise<{
  brands: BrandOption[];
  reportType: string | null;
}> {
  try {
    // Buscar o tipo de relatório
    const reportTypeResult = await db
      .select({
        reportType: reports.reportType,
      })
      .from(reports)
      .where(eq(reports.id, reportId))
      .limit(1);

    // Buscar as bandeiras
    const brandsResult = await db
      .select({
        code: brand.code,
        name: brand.name,
      })
      .from(brand)
      .orderBy(brand.name);

    return {
      brands: brandsResult,
      reportType: reportTypeResult[0]?.reportType || null,
    };
  } catch (error) {
    console.error("Erro ao buscar dados para o formulário:", error);
    return {
      brands: [],
      reportType: null,
    };
  }
}

export type MerchantOption = {
  id: number;
  name: string | null;
  corporateName: string | null;
  slug?: string | null;
};

// Cache para as pesquisas de estabelecimentos com tempo de expiração
const MAX_CACHE_SIZE = 10;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos
const merchantsCache: {
  [key: string]: {
    data: MerchantOption[];
    timestamp: number;
  };
} = {};

// Função para gerenciar o tamanho do cache e remover itens expirados
const manageCache = () => {
  const now = Date.now();
  const cacheKeys = Object.keys(merchantsCache);

  // Remover entradas expiradas
  cacheKeys.forEach((key) => {
    if (now - merchantsCache[key].timestamp > CACHE_TTL) {
      delete merchantsCache[key];
    }
  });

  // Se ainda estiver acima do limite, remover as entradas mais antigas
  if (Object.keys(merchantsCache).length > MAX_CACHE_SIZE) {
    const oldestKeys = Object.entries(merchantsCache)
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, Object.keys(merchantsCache).length - MAX_CACHE_SIZE)
      .map(([key]) => key);

    oldestKeys.forEach((key) => delete merchantsCache[key]);
  }
};

// Buscar estabelecimentos por termo de pesquisa
export const searchMerchants = async (
  searchTerm = ""
): Promise<MerchantOption[]> => {
  // Limpeza e normalização do termo de busca
  const normalizedTerm = searchTerm.toLowerCase().trim();
  const cacheKey = normalizedTerm || "all";

  // Limpar o cache antes de cada nova consulta para evitar crescimento excessivo
  manageCache();

  // Verificar se temos resultados válidos em cache
  if (
    merchantsCache[cacheKey] &&
    Date.now() - merchantsCache[cacheKey].timestamp < CACHE_TTL
  ) {
    return merchantsCache[cacheKey].data;
  }

  try {
    // Get user's merchant access
    const userAccess = await getUserMerchantsAccess();

    const conditions = [];

    // Add merchant access control
    if (!userAccess.fullAccess && userAccess.idMerchants.length > 0) {
      conditions.push(inArray(merchants.id, userAccess.idMerchants));
    } else if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
      return [];
    }

    // Add search condition if term exists
    if (normalizedTerm.length > 0) {
      conditions.push(
        or(
          ilike(merchants.name, `%${normalizedTerm}%`),
          ilike(merchants.corporateName, `%${normalizedTerm}%`)
        )
      );
    }

    // Busca com condições
    const results: MerchantOption[] = await db
      .select({
        id: merchants.id,
        name: merchants.name,
        corporateName: merchants.corporateName,
        slug: merchants.slug,
      })
      .from(merchants)
      .where(and(...conditions))
      .orderBy(merchants.name)
      .limit(100);

    // Armazenar resultado em cache
    merchantsCache[cacheKey] = {
      data: results,
      timestamp: Date.now(),
    };

    return results;
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error);
    return [];
  }
};

// Tipo de terminal que será retornado pela função
export type TerminalOption = {
  id: number;
  logical_number: string | null;
  model: string | null;
  active?: boolean | null;
  slug: string | null;
};

// Cache para as pesquisas de terminais com tempo de expiração
const MAX_TERMINAL_CACHE_SIZE = 10;
const TERMINAL_CACHE_TTL = 5 * 60 * 1000; // 5 minutos em milissegundos
const terminalsCache: {
  [key: string]: {
    data: TerminalOption[];
    timestamp: number;
  };
} = {};

// Função para gerenciar o tamanho do cache de terminais e remover itens expirados
const manageTerminalsCache = () => {
  const now = Date.now();
  const cacheKeys = Object.keys(terminalsCache);

  // Remover entradas expiradas
  cacheKeys.forEach((key) => {
    if (now - terminalsCache[key].timestamp > TERMINAL_CACHE_TTL) {
      delete terminalsCache[key];
    }
  });

  // Se ainda estiver acima do limite, remover as entradas mais antigas
  if (Object.keys(terminalsCache).length > MAX_TERMINAL_CACHE_SIZE) {
    const oldestKeys = Object.entries(terminalsCache)
      .sort(([, a], [, b]) => a.timestamp - b.timestamp)
      .slice(0, Object.keys(terminalsCache).length - MAX_TERMINAL_CACHE_SIZE)
      .map(([key]) => key);

    oldestKeys.forEach((key) => delete terminalsCache[key]);
  }
};

// Buscar terminais por termo de pesquisa
export const searchTerminals = async (
  searchTerm = ""
): Promise<TerminalOption[]> => {
  // Limpeza e normalização do termo de busca
  const normalizedTerm = searchTerm.toLowerCase().trim();
  const cacheKey = normalizedTerm || "all";

  // Limpar o cache antes de cada nova consulta para evitar crescimento excessivo
  manageTerminalsCache();

  // Verificar se temos resultados válidos em cache
  if (
    terminalsCache[cacheKey] &&
    Date.now() - terminalsCache[cacheKey].timestamp < TERMINAL_CACHE_TTL
  ) {
    return terminalsCache[cacheKey].data;
  }

  try {
    let results: TerminalOption[];

    // Consulta direta ao banco
    if (normalizedTerm.length > 0) {
      // Busca com termo específico
      results = await db
        .select({
          id: terminals.id,
          logical_number: terminals.logicalNumber,
          model: terminals.model,
          active: terminals.active,
          slug: terminals.slug,
        })
        .from(terminals)
        .where(
          or(
            ilike(terminals.logicalNumber, `%${normalizedTerm}%`),
            ilike(terminals.model, `%${normalizedTerm}%`)
          )
        )
        .orderBy(terminals.logicalNumber)
        .limit(100);
    } else {
      // Busca de todos os terminais ativos (limitado)
      results = await db
        .select({
          id: terminals.id,
          logical_number: terminals.logicalNumber,
          model: terminals.model,
          active: terminals.active,
          slug: terminals.slug,
        })
        .from(terminals)
        .orderBy(terminals.logicalNumber)
        .limit(100);
    }

    // Armazenar resultado em cache
    terminalsCache[cacheKey] = {
      data: results,
      timestamp: Date.now(),
    };

    return results;
  } catch (error) {
    console.error("Erro ao buscar terminais:", error);

    // Em caso de erro, retornar cache mesmo que expirado, se disponível
    if (terminalsCache[cacheKey]) {
      return terminalsCache[cacheKey].data;
    }

    return [];
  }
};
