import type { FeeData } from "@/features/newTax/data/mock-fee-data";
import { mockFeeData } from "@/features/newTax/data/mock-fee-data";

// Função para buscar todas as taxas
export async function getFees(): Promise<FeeData[]> {
  // Em uma aplicação real, você buscaria os dados de uma API ou banco de dados
  // Simulando uma chamada de API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Em um ambiente real, você retornaria dados do banco de dados
  return mockFeeData;
}

// Função para buscar uma taxa específica pelo ID
export async function getFeeById(id: string): Promise<FeeData | null> {
  // Em uma aplicação real, você buscaria os dados de uma API ou banco de dados
  // Simulando uma chamada de API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Buscar a taxa pelo ID
  const fee = mockFeeData.find((fee) => fee.id === id);

  return fee || null;
}

// Função para buscar as bandeiras disponíveis
export async function getBandeiras(): Promise<string[]> {
  // Em uma aplicação real, você buscaria os dados de uma API ou banco de dados
  // Simulando uma chamada de API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Lista de bandeiras disponíveis
  return ["VISA", "MASTERCARD", "ELO", "AMERICAN_EXPRESS", "HIPERCARD"];
}

// Função para buscar os modos de pagamento disponíveis
export async function getModosPagamento(): Promise<string[]> {
  // Em uma aplicação real, você buscaria os dados de uma API ou banco de dados
  // Simulando uma chamada de API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Lista de modos de pagamento disponíveis
  return [
    "Crédito à Vista",
    "Crédito Parcelado (2 a 6 vezes)",
    "Crédito Parcelado (7 a 12 vezes)",
    "Débito",
    "Voucher",
    "Pré-Pago",
  ];
}

// Função para salvar uma taxa (criar ou atualizar)
export async function saveFee(fee: FeeData): Promise<FeeData> {
  // Em uma aplicação real, você enviaria os dados para uma API ou banco de dados
  // Simulando uma chamada de API com um pequeno delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Retornar a taxa salva (em um ambiente real, isso viria do backend)
  return fee;
}
