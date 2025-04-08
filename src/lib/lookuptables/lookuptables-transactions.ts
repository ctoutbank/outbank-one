import { SelectItem } from "@/lib/lookuptables/lookuptables";

export const transactionStatusList: SelectItem[] = [
  { value: "CANCELED", label: "Cancelada" },
  { value: "EXPIRED", label: "Expirada" },
  { value: "PENDING", label: "Pendente" },
  { value: "DENIED", label: "Negada" },
  { value: "PRE_AUTHORIZED", label: "Pré-autorizada" },
  { value: "AUTHORIZED", label: "Autorizada" },
  { value: "APPROVED", label: "Aprovada" },
  { value: "REJECTED", label: "Rejeitada" },
  { value: "FAILED", label: "Falhou" },
];

export const transactionProductTypeList: SelectItem[] = [
  { value: "DEBIT", label: "Débito" },
  { value: "CREDIT", label: "Crédito" },
  { value: "VOUCHER", label: "Voucher" },
  { value: "PIX", label: "PIX" },
  { value: "PREPAID_CREDIT", label: "Crédito Pré-pago" },
  { value: "PREPAID_DEBIT", label: "Débito Pré-pago" },
];

export const cardPaymentMethod: SelectItem[] = [
  { value: "CP", label: "Presencial" },
  { value: "CNP", label: "Online" },
];

export const processingTypeList: SelectItem[] = [
  { value: "MANUAL_KEY_ENTRY", label: "Digitada" },
  { value: "MAGNETIC_STRIPE", label: "Tarja" },
  { value: "CHIP_EMV", label: "Chip" },
  { value: "CONTACTLESS", label: "Sem contato" },
  { value: "CARD_TOKEN", label: "Token" },
  { value: "PAYLINK", label: "Link de pagamento" },
  { value: "INTEGRATION", label: "Integração" },
  { value: "POS", label: "Ponto de venda" },
  { value: "TAP_ON_PHONE", label: "Tap on Phone" },
  { value: "VIRTUAL_TERMINAL", label: "Terminal virtual" },
  { value: "PDV", label: "PDV" },
];

export const brandList: SelectItem[] = [
  { value: "MASTERCARD", label: "Master" },
  { value: "VISA", label: "Visa" },
  { value: "ELO", label: "Elo" },
  { value: "AMEX", label: "Amex" },
  { value: "HIPERCARD", label: "Hipercard" },
  { value: "CABAL", label: "Cabal" },
];

export const cycleTypeList: SelectItem[] = [
  { value: "VOID", label: "Cancelamento" },
  { value: "REFUND", label: "Reembolso" },
  { value: "PRE_AUTHORIZATION", label: "Pré Autorização" },
];

export const splitTypeList: SelectItem[] = [
  { value: "WITH_SPLIT", label: "Com Split" },
  { value: "WITHOUT_SPLIT", label: "Sem Split" },
];
