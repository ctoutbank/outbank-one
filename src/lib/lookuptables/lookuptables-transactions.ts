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
  { value: "MANUAL_KEY_ENTRY", label: "Manual" },
  { value: "MAGNETIC_STRIPE", label: "Magnect stripe" },
  { value: "CHIP_EMV", label: "Chip" },
  { value: "CONTACTLESS", label: "Contactless" },
  { value: "CARD_TOKEN", label: "Token" },
  { value: "PAYLINK", label: "Payment Link" },
  { value: "INTEGRATION", label: "Integration" },
  { value: "POS", label: "Point of Sale" },
  { value: "TAP_ON_PHONE", label: "Tap on Phone" },
  { value: "VIRTUAL_TERMINAL", label: "Virtual Terminal" },
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
  { value: "AUTHORIZATION", label: "Autorização" },
  { value: "VOID", label: "Cancelamento" },
  { value: "REFUND", label: "Reembolso" },
  { value: "PRE_AUTHORIZATION", label: "Pré-autorização" },
  { value: "PRE_AUTHORIZATION_ADJUSTMENT", label: "Ajuste de pré-autorização" },
  {
    value: "PRE_AUTHORIZATION_COMPLETION",
    label: "Conclusão de pré-autorização",
  },
  { value: "REVERSAL", label: "Estorno" },
];
