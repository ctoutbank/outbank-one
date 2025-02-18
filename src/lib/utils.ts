import { clsx, type ClassValue } from "clsx";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";
import crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Period = {
  viewMode: string;
  period: DateRange;
  previousPeriod?: DateRange;
};

export function gateDateByViewMode(viewMode: string): Period {
  const currentMonth = new Date().getMonth();

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to midnight
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Yesterday
  const lastWeek = new Date(today);
  lastWeek.setDate(today.getDate() - 86400000 * 6); // Last week
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
  const firstDayOfYear = new Date(today.getFullYear(), 0, 1); // First day of the year

  switch (viewMode) {
    case "today":
      return {
        viewMode: "today",
        period: {
          from: new Date(today.setHours(0, 0, 0, 0)),
          to: new Date(today.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(yesterday.setHours(0, 0, 0, 0)),
          to: new Date(yesterday.setHours(23, 59, 0, 0)),
        },
      };
    case "week":
      return {
        viewMode: "week",
        period: {
          from: new Date(today.getTime() - 6 * 86400000), // 7 days ago
          to: new Date(today.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(today.getTime() - 12 * 86400000), // 14 days ago
          to: new Date(today.getTime() - 6 * 86400000), // 7 days ago
        },
      };
    case "month":
      return {
        viewMode: "month",
        period: {
          from: new Date(firstDayOfMonth.setHours(0, 0, 0, 0)),
          to: new Date(today.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
          to: new Date(firstDayOfMonth.setHours(23, 59, 0, 0) - 86400000),
        },
      };
    case "year":
      return {
        viewMode: "year",
        period: {
          from: new Date(firstDayOfYear.setHours(0, 0, 0, 0)),
          to: new Date(today.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(today.getFullYear() - 1, 0, 1),
          to: new Date(firstDayOfYear.setHours(23, 59, 0, 0) - 86400000),
        },
      };
    case "yesterday":
      return {
        viewMode: "yesterday",
        period: {
          from: new Date(yesterday.setHours(0, 0, 0, 0)),
          to: new Date(yesterday.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(yesterday.setHours(0, 0, 0, 0) - 86400000),
          to: new Date(yesterday.setHours(23, 59, 0, 0) - 86400000),
        },
      };
    default:
      return {
        viewMode: "today",
        period: {
          from: new Date(today.setHours(0, 0, 0, 0)),
          to: new Date(today.setHours(23, 59, 0, 0)),
        },
        previousPeriod: {
          from: new Date(yesterday.setHours(0, 0, 0, 0)),
          to: new Date(yesterday.setHours(23, 59, 0, 0)),
        },
      };
  }
}

export function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;
}

export function formatDateToAPIFilter(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

export function formatDateTime(date: Date): string {
  const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  return `${days[date.getDay()]} ${day}/${month}/${year} - ${hours
    .toString()
    .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

export function formatDateComplete(date: Date): string {
  const days = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const daySuffix = day === 1 || day === 21 || day === 31 ? "º" : "";

  return `${dayOfWeek}, ${month} ${day}${daySuffix} ${year}`;
}

export function formatCurrency(number: number): string {
  return `R$ ${number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
}

export function generateSlug(): string {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}

export function translateStatus(status: string): string {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "PROCESSING":
      return "Processando";
    case "REQUESTED":
      return "Pedido";
    case "FAILED":
      return "Falhou";
    case "SETTLED":
      return "Liquidado";
    case "PAID":
      return "Pago";
    case "PRE_APPROVED":
      return "Pré Aprovado";
    case "APPROVED":
      return "Aprovado";
    default:
      return "";
  }
}

export function getStatusColor(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500  hover:bg-yellow-600";
    case "PROCESSING":
      return "bg-yellow-500 hover:bg-yellow-400";
    case "REQUESTED":
      return "bg-yellow-300 hover:bg-yellow-400";
    case "FAILED":
      return "bg-[#C74545]  hover:bg-[#953434]";
    case "SETTLED":
      return "bg-[#00B28E]  hover:bg-[#006b55]";
    case "PAID":
      return "bg-[#00B28E]  hover:bg-[#006b55]";
    case "PRE_APPROVED":
      return "bg-blue-400  hover:bg-blue-500";
    case "APPROVED":
      return "bg-blue-700  hover:bg-blue-800";
    default:
      return "bg-gray-400 hover:bg-gray-500";
  }
}

export function formatCurrencyWithoutSymbol(number: number): string {
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

export function formatDateMonthPT(date: Date): string {
  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} de ${month} de ${year}`;
}

export function toUpperCaseFirst(text: string): string {
  return text
    .toLowerCase()
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export function translateCardType(cardType: string): string {
  switch (cardType.toUpperCase()) {
    case "CREDIT":
      return "Crédito";
    case "DEBIT":
      return "Débito";
    case "PREPAID - DEBIT":
      return "Débito - Pré-pago";
    case "PIX":
      return "Pix";
    default:
      return "";
  }
}


export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
