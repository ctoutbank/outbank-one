import { SelectItem } from "@/lib/lookuptables/lookuptables";

// Corrigido a exportação para garantir que StatusMerchantAgendaList seja corretamente definido
export const StatusMerchantAgendaList: SelectItem[] = [
  { value: "SETTLED", label: "Liquidadas" },
  { value: "FULLY_ANTICIPATED", label: "Antecipadas" },
  { value: "PARTIAL_ANTICIPATED", label: "Parcialmente Antecipadas" },
  { value: "PARTIAL_SETTLED", label: "Parcialmente Liquidadas" },
  { value: "PROVISIONED", label: "Previstas" },
  { value: "PARTIAL_PROVISIONED", label: "Parcialmente Previstas" },
  { value: "CANCELLED", label: "Canceladas" },
];

export const DateMerchantAgendaList: SelectItem[] = [
  { value: "SD", label: "Data de Liquidação" },
  { value: "SV", label: "Data de Venda" },
  { value: "DPL", label: "Data Prevista de Liquidação" },
  { value: "DEP", label: "Data Efetiva do Pagamento" },
];
