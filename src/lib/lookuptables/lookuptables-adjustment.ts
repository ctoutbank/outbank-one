import { SelectItem } from "@/lib/lookuptables/lookuptables";

export const adjustmentTypes: SelectItem[] = [
  {
    value: "SINGLE",
    label: "Único",
  },
  {
    value: "RECURRING",
    label: "Recorrente",
  },
];

export const adjustmentReasons: SelectItem[] = [
  {
    value: "ADE",
    label: "Aluguel de Equipamento",
  },
  {
    value: "AJT",
    label: "Ajustes(erros)",
  },
  {
    value: "OTHER",
    label: "Outros",
  },
];

export const adjustmentADE: SelectItem[] = [
  {
    value: "CDE",
    label: "Cobrança de aluguel de equipamento",
  },
  {
    value: "OTHER",
    label: "Outros",
  },
];

export const adjustmentAJT: SelectItem[] = [
  {
    value: "CDE",
    label: "Erro de cobrança",
  },
  {
    value: "OTHER",
    label: "Outros",
  },
];

export const adjustmentRecurrence: SelectItem[] = [
  {
    value: "MONTHLY",
    label: "Mensal",
  },
  {
    value: "YEARLY",
    label: "Anual",
  },
  {
    value: "WEEKLY",
    label: "Semanal",
  },
];
