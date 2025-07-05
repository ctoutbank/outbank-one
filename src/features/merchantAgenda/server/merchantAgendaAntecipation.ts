"use server";

import { getUserMerchantsAccess } from "@/features/users/server/users";
import { db } from "@/server/db";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNotNull,
  lte,
  or,
  sql,
  sum,
} from "drizzle-orm";
import { merchants, payoutAntecipations } from "../../../../drizzle/schema";

export interface MerchantAgendaAnticipation {
  merchantName: string | null;
  rrn: string | null;
  transactionDate: string | null;
  type: string | null;
  brand: string | null;
  installmentNumber: number | null;
  installmentAmount: number | null;
  transactionMdr: number | null;
  transactionMdrFee: number | null;
  settlementAmount: number | null;
  expectedSettlementDate: string | null;
  anticipatedAmount: number | null;
  anticipationDayNumber: number | null;
  anticipationMonthFee: number | null;
  anticipationFee: number | null;
  netAmount: number | null;
  anticipationCode: string | null;
  settlementDate: string | null;
  effectivePaymentDate: string | null;
  settlementUniqueNumber: string | null;
}

export interface MerchantAgendaAnticipationList {
  merchantAgendaAnticipations: MerchantAgendaAnticipation[];
  totalCount: number;
}

export async function getMerchantAgendaAnticipation(
  search: string,
  page: number,
  pageSize: number,
  dateFrom?: string,
  dateTo?: string,
  establishment?: string,
  status?: string,
  cardBrand?: string,
  settlementDateFrom?: string,
  settlementDateTo?: string,
  expectedSettlementDateFrom?: string,
  expectedSettlementDateTo?: string,
  saleDateFrom?: string,
  saleDateTo?: string,
  nsu?: string,
  orderId?: string
): Promise<MerchantAgendaAnticipationList> {
  const offset = (page - 1) * pageSize;

  // Get user's merchant access
  const userAccess = await getUserMerchantsAccess();

  // If user has no access and no full access, return empty result
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      merchantAgendaAnticipations: [],
      totalCount: 0,
    };
  }

  // Verifica se há algum filtro aplicado (incluindo busca por texto)
  const hasFilters = !!(
    (search && search.trim() !== "") ||
    dateFrom ||
    dateTo ||
    establishment ||
    (status && status !== "all") ||
    (cardBrand && cardBrand !== "all") ||
    settlementDateFrom ||
    settlementDateTo ||
    expectedSettlementDateFrom ||
    expectedSettlementDateTo ||
    saleDateFrom ||
    saleDateTo ||
    nsu ||
    orderId
  );

  // Se não há filtros aplicados, retorna dados vazios
  if (!hasFilters) {
    return {
      merchantAgendaAnticipations: [],
      totalCount: 0,
    };
  }

  const conditions = [];

  // Add search condition only if search term is provided
  if (search && search.trim() !== "") {
    conditions.push(or(ilike(merchants.name, `%${search}%`)));
  }

  // Add merchant access filter if user doesn't have full access
  if (!userAccess.fullAccess) {
    conditions.push(
      inArray(payoutAntecipations.idMerchants, userAccess.idMerchants)
    );
  }

  if (dateFrom) {
    conditions.push(
      gte(payoutAntecipations.transactionDate, new Date(dateFrom).toISOString())
    );
  }

  if (dateTo) {
    conditions.push(
      lte(payoutAntecipations.transactionDate, new Date(dateTo).toISOString())
    );
  }

  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  if (status && status !== "all") {
    conditions.push(eq(payoutAntecipations.status, status));
  }

  if (cardBrand && cardBrand !== "all") {
    conditions.push(eq(payoutAntecipations.brand, cardBrand));
  }

  if (settlementDateFrom) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = settlementDateFrom.split("T")[0];
    conditions.push(gte(payoutAntecipations.settlementDate, dateOnly));
  }

  if (settlementDateTo) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = settlementDateTo.split("T")[0];
    conditions.push(lte(payoutAntecipations.settlementDate, dateOnly));
  }

  if (expectedSettlementDateFrom) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = expectedSettlementDateFrom.split("T")[0];
    conditions.push(gte(payoutAntecipations.expectedSettlementDate, dateOnly));
  }

  if (expectedSettlementDateTo) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = expectedSettlementDateTo.split("T")[0];
    conditions.push(lte(payoutAntecipations.expectedSettlementDate, dateOnly));
  }

  if (saleDateFrom) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = saleDateFrom.split("T")[0];
    // Usa effectivePaymentDate se não for null, senão usa transactionDate
    conditions.push(
      or(
        and(
          isNotNull(payoutAntecipations.effectivePaymentDate),
          gte(payoutAntecipations.effectivePaymentDate, dateOnly)
        ),
        and(
          isNotNull(payoutAntecipations.transactionDate),
          gte(
            payoutAntecipations.transactionDate,
            new Date(dateOnly).toISOString()
          )
        )
      )
    );
  }

  if (saleDateTo) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = saleDateTo.split("T")[0];
    // Usa effectivePaymentDate se não for null, senão usa transactionDate
    conditions.push(
      or(
        and(
          isNotNull(payoutAntecipations.effectivePaymentDate),
          lte(payoutAntecipations.effectivePaymentDate, dateOnly)
        ),
        and(
          isNotNull(payoutAntecipations.transactionDate),
          lte(
            payoutAntecipations.transactionDate,
            new Date(dateOnly + "T23:59:59.999Z").toISOString()
          )
        )
      )
    );
  }

  if (nsu) {
    conditions.push(ilike(payoutAntecipations.rrn, `%${nsu}%`));
  }

  if (orderId) {
    conditions.push(
      ilike(payoutAntecipations.anticipationCode, `%${orderId}%`)
    );
  }

  const result = await db
    .select({
      merchantName: merchants.name,
      rrn: payoutAntecipations.rrn,
      transactionDate: payoutAntecipations.transactionDate,
      type: payoutAntecipations.type,
      brand: payoutAntecipations.brand,
      installmentNumber: payoutAntecipations.installmentNumber,
      installmentAmount: payoutAntecipations.installmentAmount,
      transactionMdr: payoutAntecipations.transactionMdr,
      transactionMdrFee: payoutAntecipations.transactionMdrFee,
      settlementAmount: payoutAntecipations.settlementAmount,
      expectedSettlementDate: payoutAntecipations.expectedSettlementDate,
      anticipatedAmount: payoutAntecipations.anticipatedAmount,
      anticipationDayNumber: payoutAntecipations.anticipationDayNumber,
      anticipationMonthFee: payoutAntecipations.anticipationMonthFee,
      anticipationFee: payoutAntecipations.anticipationFee,
      netAmount: payoutAntecipations.netAmount,
      anticipationCode: payoutAntecipations.anticipationCode,
      settlementDate: payoutAntecipations.settlementDate,
      effectivePaymentDate: payoutAntecipations.effectivePaymentDate,
      settlementUniqueNumber: payoutAntecipations.settlementUniqueNumber,
    })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions))
    .orderBy(desc(payoutAntecipations.settlementDate))
    .limit(pageSize)
    .offset(offset);

  const totalCountResult = await db
    .select({ count: count() })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions));

  const totalCount = totalCountResult[0]?.count || 0;

  return {
    merchantAgendaAnticipations: result.map((item) => ({
      merchantName: item.merchantName,
      rrn: item.rrn,
      transactionDate: item.transactionDate,
      type: item.type,
      brand: item.brand,
      installmentNumber: item.installmentNumber,
      installmentAmount: item.installmentAmount
        ? Number(item.installmentAmount)
        : null,
      transactionMdr: item.transactionMdr ? Number(item.transactionMdr) : null,
      transactionMdrFee: item.transactionMdrFee
        ? Number(item.transactionMdrFee)
        : null,
      settlementAmount: item.settlementAmount
        ? Number(item.settlementAmount)
        : null,
      expectedSettlementDate: item.expectedSettlementDate,
      anticipatedAmount: item.anticipatedAmount
        ? Number(item.anticipatedAmount)
        : null,
      anticipationDayNumber: item.anticipationDayNumber,
      anticipationMonthFee: item.anticipationMonthFee
        ? Number(item.anticipationMonthFee)
        : null,
      anticipationFee: item.anticipationFee
        ? Number(item.anticipationFee)
        : null,
      netAmount: item.netAmount ? Number(item.netAmount) : null,
      anticipationCode: item.anticipationCode,
      settlementDate: item.settlementDate,
      effectivePaymentDate: item.effectivePaymentDate,
      settlementUniqueNumber: item.settlementUniqueNumber,
    })),
    totalCount,
  };
}

export interface AnticipationDashboardStats {
  totalEstablishments: number;
  totalAnticipationRequests: number;
  totalParcels: number;
  fullyAnticipatedParcels: number;
  partiallyAnticipatedParcels: number;
  totalNetAnticipated: number;
  totalGrossAnticipated: number;
  totalAnticipationFees: number;
  firstTransactionDate?: string;
  lastTransactionDate?: string;
}

/**
 * Obtém estatísticas de antecipação da agenda do comerciante
 *
 * Esta função recupera estatísticas detalhadas sobre antecipações de pagamentos,
 * incluindo contagens totais, valores e datas de transações.
 *
 * @param dateFrom - Data inicial para filtrar transações
 * @param dateTo - Data final para filtrar transações
 * @param establishment - Nome do estabelecimento para filtrar
 * @param status - Status da antecipação
 * @param cardBrand - Bandeira do cartão
 * @param settlementDateFrom - Data inicial de liquidação
 * @param settlementDateTo - Data final de liquidação
 * @param saleDateFrom - Data inicial de pagamento efetivo
 * @param saleDateTo - Data final de pagamento efetivo
 * @param nsu - Número de referência (RRN)
 * @param orderId - Código de antecipação
 * @returns Estatísticas de antecipação do dashboard
 */
export async function getMerchantAgendaAnticipationStats(
  dateFrom?: string,
  dateTo?: string,
  establishment?: string,
  status?: string,
  cardBrand?: string,
  settlementDateFrom?: string,
  settlementDateTo?: string,
  saleDateFrom?: string,
  saleDateTo?: string,
  nsu?: string,
  orderId?: string
): Promise<AnticipationDashboardStats> {
  // Obtém o acesso do usuário aos comerciantes
  const userAccess = await getUserMerchantsAccess();

  // Se o usuário não tiver acesso e nem acesso total, retorna resultado vazio
  if (!userAccess.fullAccess && userAccess.idMerchants.length === 0) {
    return {
      totalEstablishments: 0,
      totalAnticipationRequests: 0,
      totalParcels: 0,
      fullyAnticipatedParcels: 0,
      partiallyAnticipatedParcels: 0,
      totalNetAnticipated: 0,
      totalGrossAnticipated: 0,
      totalAnticipationFees: 0,
      firstTransactionDate: undefined,
      lastTransactionDate: undefined,
    };
  }

  // Verifica se há algum filtro aplicado
  const hasFilters = !!(
    dateFrom ||
    dateTo ||
    establishment ||
    (status && status !== "all") ||
    (cardBrand && cardBrand !== "all") ||
    settlementDateFrom ||
    settlementDateTo ||
    saleDateFrom ||
    saleDateTo ||
    nsu ||
    orderId
  );

  // Se não há filtros aplicados, retorna dados vazios
  if (!hasFilters) {
    return {
      totalEstablishments: 0,
      totalAnticipationRequests: 0,
      totalParcels: 0,
      fullyAnticipatedParcels: 0,
      partiallyAnticipatedParcels: 0,
      totalNetAnticipated: 0,
      totalGrossAnticipated: 0,
      totalAnticipationFees: 0,
      firstTransactionDate: undefined,
      lastTransactionDate: undefined,
    };
  }

  const conditions = [];

  // Adiciona filtro de acesso ao comerciante se o usuário não tiver acesso total
  if (!userAccess.fullAccess) {
    conditions.push(
      inArray(payoutAntecipations.idMerchants, userAccess.idMerchants)
    );
  }

  // Determina qual campo de data usar para o período baseado nos filtros aplicados
  let minDateSql: any;
  let maxDateSql: any;

  if (saleDateFrom || saleDateTo) {
    // Se filtrou por Data de Venda, usa effectivePaymentDate
    minDateSql = sql<string>`MIN(${payoutAntecipations.effectivePaymentDate})`;
    maxDateSql = sql<string>`MAX(${payoutAntecipations.effectivePaymentDate})`;
  } else if (settlementDateFrom || settlementDateTo) {
    // Se filtrou por Data de Liquidação, usa settlementDate
    minDateSql = sql<string>`MIN(${payoutAntecipations.settlementDate})`;
    maxDateSql = sql<string>`MAX(${payoutAntecipations.settlementDate})`;
  } else {
    // Caso contrário, usa transactionDate como padrão
    minDateSql = sql<string>`MIN(${payoutAntecipations.transactionDate})`;
    maxDateSql = sql<string>`MAX(${payoutAntecipations.transactionDate})`;
  }

  // Filtro por data de transação (início)
  if (dateFrom) {
    conditions.push(
      gte(payoutAntecipations.transactionDate, new Date(dateFrom).toISOString())
    );
  }

  // Filtro por data de transação (fim)
  if (dateTo) {
    conditions.push(
      lte(payoutAntecipations.transactionDate, new Date(dateTo).toISOString())
    );
  }

  // Filtro por nome do estabelecimento
  if (establishment) {
    conditions.push(ilike(merchants.name, `%${establishment}%`));
  }

  // Filtro por status (exceto "todos")
  if (status && status !== "all") {
    conditions.push(eq(payoutAntecipations.status, status));
  }

  // Filtro por bandeira de cartão (exceto "todas")
  if (cardBrand && cardBrand !== "all") {
    conditions.push(eq(payoutAntecipations.brand, cardBrand));
  }

  // Filtro por data de liquidação (início)
  if (settlementDateFrom) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = settlementDateFrom.split("T")[0];
    conditions.push(gte(payoutAntecipations.settlementDate, dateOnly));
  }

  // Filtro por data de liquidação (fim)
  if (settlementDateTo) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = settlementDateTo.split("T")[0];
    conditions.push(lte(payoutAntecipations.settlementDate, dateOnly));
  }

  // Filtro por data de pagamento efetivo (início)
  if (saleDateFrom) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = saleDateFrom.split("T")[0];
    // Usa effectivePaymentDate se não for null, senão usa transactionDate
    conditions.push(
      or(
        and(
          isNotNull(payoutAntecipations.effectivePaymentDate),
          gte(payoutAntecipations.effectivePaymentDate, dateOnly)
        ),
        and(
          isNotNull(payoutAntecipations.transactionDate),
          gte(
            payoutAntecipations.transactionDate,
            new Date(dateOnly).toISOString()
          )
        )
      )
    );
  }

  // Filtro por data de pagamento efetivo (fim)
  if (saleDateTo) {
    // Extrai apenas a parte da data (YYYY-MM-DD) da string ISO
    const dateOnly = saleDateTo.split("T")[0];
    // Usa effectivePaymentDate se não for null, senão usa transactionDate
    conditions.push(
      or(
        and(
          isNotNull(payoutAntecipations.effectivePaymentDate),
          lte(payoutAntecipations.effectivePaymentDate, dateOnly)
        ),
        and(
          isNotNull(payoutAntecipations.transactionDate),
          lte(
            payoutAntecipations.transactionDate,
            new Date(dateOnly + "T23:59:59.999Z").toISOString()
          )
        )
      )
    );
  }

  // Filtro por número de referência (RRN)
  if (nsu) {
    conditions.push(ilike(payoutAntecipations.rrn, `%${nsu}%`));
  }

  // Filtro por código de antecipação
  if (orderId) {
    conditions.push(
      ilike(payoutAntecipations.anticipationCode, `%${orderId}%`)
    );
  }

  // Buscar contagens e valores totais
  const totalStats = await db
    .select({
      totalRequests: count(),
      totalNetAnticipated: sum(payoutAntecipations.netAmount),
      totalGrossAnticipated: sum(payoutAntecipations.anticipatedAmount),
      totalAnticipationFees: sum(payoutAntecipations.anticipationFee),
      minTransactionDate: minDateSql,
      maxTransactionDate: maxDateSql,
    })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions));

  // Contagem de parcelas
  const parcelStats = await db
    .select({
      totalParcels: count(),
      // Aqui assumimos que parcelas totalmente antecipadas têm algum valor específico em algum campo
      // Isso precisará ser ajustado conforme a estrutura real do banco
      fullyAnticipated: sql<number>`SUM(CASE WHEN ${payoutAntecipations.anticipationDayNumber} > 0 THEN 1 ELSE 0 END)`,
      partiallyAnticipated: sql<number>`SUM(CASE WHEN ${payoutAntecipations.anticipationDayNumber} = 0 AND ${payoutAntecipations.anticipatedAmount} > 0 THEN 1 ELSE 0 END)`,
    })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions));

  // Contar estabelecimentos únicos
  const establishmentCount = await db
    .select({
      uniqueCount: sql<number>`COUNT(DISTINCT ${merchants.id})`,
    })
    .from(payoutAntecipations)
    .leftJoin(merchants, eq(payoutAntecipations.idMerchants, merchants.id))
    .where(and(...conditions));

  return {
    totalEstablishments: Number(establishmentCount[0]?.uniqueCount || 0),
    totalAnticipationRequests: Number(totalStats[0]?.totalRequests || 0),
    totalParcels: Number(parcelStats[0]?.totalParcels || 0),
    fullyAnticipatedParcels: Number(parcelStats[0]?.fullyAnticipated || 0),
    partiallyAnticipatedParcels: Number(
      parcelStats[0]?.partiallyAnticipated || 0
    ),
    totalNetAnticipated: Number(totalStats[0]?.totalNetAnticipated || 0),
    totalGrossAnticipated: Number(totalStats[0]?.totalGrossAnticipated || 0),
    totalAnticipationFees: Number(totalStats[0]?.totalAnticipationFees || 0),
    firstTransactionDate: totalStats[0]?.minTransactionDate,
    lastTransactionDate: totalStats[0]?.maxTransactionDate,
  };
}
