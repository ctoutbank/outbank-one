"use server";

import { db } from "@/server/db";
import { and, count, eq, gte, lte, sql } from "drizzle-orm";
import { merchants } from "../../../../drizzle/schema";

// Tipo para o gráfico A - Estabelecimentos cadastrados por período
export type MerchantRegistrationChart = {
  date: string;
  count: number;
}

// Tipo para sumário de estabelecimentos por período
export type MerchantRegistrationSummary = {
  currentMonth: number;
  previousMonth: number;
  currentWeek: number;
  today: number;
}

// Tipo para o gráfico B - Transaciona/Não Transaciona
export type MerchantTransactionChart = {
  name: string;
  value: number;
}

// Tipo para o gráfico C - Compulsória/Eventual
export type MerchantTypeChart = {
  name: string;
  value: number;
}

// Função para obter dados do gráfico A - Postos cadastrados por período
export async function getMerchantRegistrationsByPeriod(): Promise<MerchantRegistrationChart[]> {
  // Obter data atual e calcular datas do mês atual e mês anterior
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  // Primeiro dia do mês atual
 
  
  // Primeiro dia do mês anterior
  const firstDayPreviousMonth = new Date(currentYear, currentMonth - 1, 1);
  
  const firstDayPreviousMonthStr = firstDayPreviousMonth.toISOString();

  // Consultar dados dia a dia para os últimos dois meses
  const results = await db.select({
    date: sql<string>`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`,
    count: count(merchants.id),
  })
  .from(merchants)
  .where(gte(merchants.dtinsert, firstDayPreviousMonthStr))
  .groupBy(sql`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`)
  .orderBy(sql`TO_CHAR(${merchants.dtinsert}::date, 'YYYY-MM-DD')`);

  return results.map(item => ({
    date: item.date,
    count: Number(item.count)
  }));
}

// Função para obter sumário de estabelecimentos por períodos (mês atual, mês anterior, semana atual, hoje)
export async function getMerchantRegistrationSummary(): Promise<MerchantRegistrationSummary> {
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
  const firstDayPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const firstDayPreviousMonthStr = firstDayPreviousMonth.toISOString();
  
  // Último dia do mês anterior
  const lastDayPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const lastDayPreviousMonthStr = lastDayPreviousMonth.toISOString();
  
  // Consulta para estabelecimentos cadastrados hoje
  const todayCount = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(
    and(
      gte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${todayStr})`),
      lte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${todayStr})`)
    )
  );
  
  // Consulta para estabelecimentos cadastrados na semana atual
  const currentWeekCount = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(gte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${firstDayOfWeekStr})`));
  
  // Consulta para estabelecimentos cadastrados no mês atual
  const currentMonthCount = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(gte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${firstDayCurrentMonthStr})`));
  
  // Consulta para estabelecimentos cadastrados no mês anterior
  const previousMonthCount = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(
    and(
      gte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${firstDayPreviousMonthStr})`),
      lte(sql`DATE(${merchants.dtinsert})`, sql`DATE(${lastDayPreviousMonthStr})`)
    )
  );
  
  return {
    currentMonth: Number(currentMonthCount[0]?.count || 0),
    previousMonth: Number(previousMonthCount[0]?.count || 0),
    currentWeek: Number(currentWeekCount[0]?.count || 0),
    today: Number(todayCount[0]?.count || 0)
  };
}

// Função para obter dados do gráfico B - Transaciona/Não Transaciona
export async function getMerchantTransactionData(): Promise<MerchantTransactionChart[]> {
  // Como não temos hasTransactions, usamos hasPix como proxy para "transaciona"
  // Consultar quantidade de estabelecimentos que transacionam
  const transactionMerchants = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(eq(merchants.hasPix, true));

  // Consultar quantidade de estabelecimentos que não transacionam
  const nonTransactionMerchants = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(eq(merchants.hasPix, false));

  return [
    { name: "Transaciona", value: Number(transactionMerchants[0]?.count || 0) },
    { name: "Não Transaciona", value: Number(nonTransactionMerchants[0]?.count || 0) }
  ];
}

// Função para obter dados do gráfico C - Compulsória/Eventual
export async function getMerchantTypeData(): Promise<MerchantTypeChart[]> {
  // Como não temos isCompulsory, usaremos hasTef como proxy para ilustrar a consulta
  // Na prática, será necessário criar essa coluna ou encontrar uma alternativa adequada
  
  // Consultar quantidade de estabelecimentos compulsórios (usando hasTef como exemplo)
  const compulsoryMerchants = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(eq(merchants.hasTef, true));

  // Consultar quantidade de estabelecimentos eventuais
  const eventualMerchants = await db.select({
    count: count(),
  })
  .from(merchants)
  .where(eq(merchants.hasTef, false));

  return [
    { name: "Compulsória", value: Number(compulsoryMerchants[0]?.count || 0) },
    { name: "Eventual", value: Number(eventualMerchants[0]?.count || 0) }
  ];
} 