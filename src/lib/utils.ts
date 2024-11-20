import { clsx, type ClassValue } from "clsx";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function gateDateByViewMode(viewMode: string): DateRange {
  switch (viewMode) {
    case "today":
      return {
        from: new Date(new Date().setHours(0, 0, 0, 0)),
        to: new Date(new Date().setHours(23, 59, 0, 0)),
      };
    case "week":
      const today = new Date(new Date().setHours(0, 0, 0, 0));
      const auxToday = today;
      const lastWeek = new Date(auxToday.setDate(auxToday.getDate() - 6));
      const newToday = new Date();
      return {
        from: lastWeek,
        to: newToday,
      };
    case "month":
      const firstDayOfMonth = new Date(
        new Date().setMonth(new Date().getMonth(), 1)
      );
      firstDayOfMonth.setHours(0, 0, 0, 0);
      return {
        from: firstDayOfMonth,
        to: new Date(new Date().setHours(23, 59, 0, 0)),
      };
    case "year":
      const firstDayOfYear = new Date(
        new Date().setFullYear(new Date().getFullYear(), 0, 1)
      );
      return {
        from: firstDayOfYear,
        to: new Date(),
      };
    case "yesterday":
      const yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
      return {
        from: new Date(yesterday.setHours(0, 0, 0, 0)),
        to: new Date(yesterday.setHours(23, 59, 0, 0)),
      };
    default:
      return {
        from: new Date(new Date().setHours(0, 0, 0, 0)),
        to: new Date(new Date().setHours(23, 59, 0, 0)),
      };
  }
}
