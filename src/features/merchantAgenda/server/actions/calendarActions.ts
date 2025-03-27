"use server";

import { getDailyStatistics } from "../merchantAgenda";
import { PaymentMethodData, BrandData } from "../merchantAgenda";

interface DailyStats {
  [date: string]: {
    paymentMethods: PaymentMethodData[];
    brands: BrandData[];
  };
}

/**
 * Server Action para obter estatísticas de múltiplos dias
 * Esta função é chamada do componente cliente Calendar
 */
export async function fetchDailyStats(dates: string[]): Promise<DailyStats> {
  try {
    // Criar as promises para cada data
    const statsPromises = dates.map(async (date) => {
      const stats = await getDailyStatistics(date);
      return { date, stats };
    });
    
    // Executar todas as promises em paralelo
    const results = await Promise.all(statsPromises);
    
    // Construir o objeto de retorno
    const dailyStats: DailyStats = {};
    results.forEach(({ date, stats }) => {
      dailyStats[date] = stats;
    });
    
    return dailyStats;
  } catch (error) {
    console.error("Erro ao buscar estatísticas diárias:", error);
    return {};
  }
} 