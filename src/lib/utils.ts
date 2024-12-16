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







export function generateSlug(): string {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
}