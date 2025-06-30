// Tipos específicos para a funcionalidade de taxas
// Reutiliza tipos existentes do projeto e define novos tipos específicos

// Re-exporta tipos base do projeto (agora exportados)
export type {
  MerchantPrice as BaseMerchantPrice,
  MerchantPriceGroup as BaseMerchantPriceGroup,
  TransactionPrice as BaseTransactionPrice,
} from "../server/types";

// Importa para uso interno
import type {
  MerchantPriceGroup as BaseMerchantPriceGroup,
  TransactionPrice as BaseTransactionPrice,
} from "../server/types";

// Tipos específicos para transações organizadas
/**
 * Transação organizada - estende BaseTransactionPrice com campos adicionais
 * para compatibilidade com a lógica de organização de dados
 */
export interface OrganizedTransaction extends BaseTransactionPrice {
  // Campos adicionais para compatibilidade com a lógica existente
  mdr?: number;
}

export interface OrganizedTransactionData {
  credit: {
    vista?: OrganizedTransaction;
    parcela2_6?: OrganizedTransaction;
    parcela7_12?: OrganizedTransaction;
  };
  debit?: OrganizedTransaction;
  prepaid?: OrganizedTransaction;
}

/**
 * Grupo de taxas organizado - baseado em BaseMerchantPriceGroup
 * mas com transações organizadas por tipo
 */
export interface OrganizedFeeGroup
  extends Omit<BaseMerchantPriceGroup, "listMerchantTransactionPrice"> {
  transactions: OrganizedTransactionData;
}

// Tipo para dados de atualização de transações
export interface TransactionUpdateData {
  cardTransactionMdr?: number;
  nonCardTransactionMdr?: number;
  cardTransactionFee?: number;
  nonCardTransactionFee?: number;
}

export interface TransactionUpdate {
  id: number;
  data: TransactionUpdateData;
}

// Tipos para taxas PIX
export interface PixFeeData {
  mdr: number;
  custoMinimo: number;
  custoMaximo: number;
  antecipacao: number;
}

export type PixFeeField = keyof PixFeeData;
export type PixFeeType = "pos" | "online";

// Tipos auxiliares para type safety na manipulação de transações
export type TransactionType = keyof OrganizedTransactionData;
export type CreditSubType = keyof OrganizedTransactionData["credit"];
export type TransactionField = keyof OrganizedTransaction;

// Tipo flexível para dados de grupo que podem vir de diferentes fontes
export interface FlexibleMerchantPriceGroup {
  id: number;
  name: string;
  active: boolean;
  dtinsert: string;
  dtupdate: string;
  idMerchantPrice?: number; // Opcional para compatibilidade
  listMerchantTransactionPrice: BaseTransactionPrice[];
}
