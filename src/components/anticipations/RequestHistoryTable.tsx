"use client";

import React from "react";
import { formatBRL } from "@/app/utils/currency";
import { useRouter } from "next/navigation";

type Props = {
  rows: any[];
  page: number;
  pageSize: number;
  totalCount: number;
};

export default function RequestHistoryTable({
  rows,
  page,
  pageSize,
  totalCount,
}: Props) {
  const router = useRouter();
  const totalPages = Math.ceil(totalCount / pageSize);

  const goToPage = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          Histórico de Solicitações
        </h3>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
          {totalCount} total
        </span>
      </div>

      <div className="space-y-2">
        {rows.map((r, idx) => (
          <div
            key={r.id || `row-${idx}`}
            className="grid grid-cols-5 gap-2 rounded-md px-3 py-2 text-sm hover:bg-gray-50"
          >
            <span className="col-span-2 text-gray-500">
              {formatDateSafe(r)}
            </span>
            <span className="font-medium">{r.merchantName ?? r.merchant ?? r.customer ?? r.Date ?? '-'}</span>
            <span className="text-right tabular-nums">
              {formatBRL(r.amount)}
            </span>
            <span className={`text-center text-xs font-semibold ${statusColor(r.status)}`}>
              {statusLabel(r.status)}
            </span>
          </div>
        ))}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-600">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1 rounded border disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
}

function statusColor(s: string) {
  switch (s) {
    case "Liquidado":
      return "text-emerald-600";
    case "pending":
    case "processing":
      return "text-yellow-600";
    case "rejected":
      return "text-red-600";
    default:
      return s;
  }
}

function statusLabel(s: string) {
  switch (s) {
    case "liquidado":
      return "Liquidado";
    case "pending":
    case "processing":
      return "Pendente";
    case "rejected":
      return "Negado";
    default:
      return s;
  }
}

function formatDateSafe(r: any) {
  // Prefer explicit fields first
  const preferred = ["createdAt", "created_at", "created", "requestedAt", "requested_at", "requested", "dtinsert", "date"];

  function tryParseDate(v: any): Date | null {
    if (!v && v !== 0) return null;
    // Firebase Timestamp like object: { seconds, nanoseconds } or has toDate()
    if (typeof v === "object") {
      if (typeof v.toDate === "function") {
        try {
          const d = v.toDate();
          if (!isNaN(d.getTime())) return d;
        } catch {}
      }
      if (typeof v.seconds === "number") {
        // seconds -> ms
        const ms = v.seconds > 1e12 ? v.seconds : v.seconds * 1000;
        const d = new Date(ms);
        if (!isNaN(d.getTime())) return d;
      }
      // If it's a plain object with a date-like string property, try its string representation
      const str = String(v);
      const dFromStr = new Date(str);
      if (!isNaN(dFromStr.getTime())) return dFromStr;
      return null;
    }

    if (typeof v === "number") {
      // distinguish seconds (10 digits) vs ms (13+ digits)
      const ms = v > 1e12 ? v : v * 1000;
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d;
      return null;
    }

    if (typeof v === "string") {
      const d = new Date(v);
      if (!isNaN(d.getTime())) return d;
      // try parse ISO-like with space replaced
      const d2 = new Date(v.replace(" ", "T"));
      if (!isNaN(d2.getTime())) return d2;
      return null;
    }

    return null;
  }

  // Try preferred keys first
  for (const key of preferred) {
    const val = r?.[key];
    const d = tryParseDate(val);
    if (d) return d.toLocaleDateString("pt-BR");
  }

  // As a fallback, scan object keys for anything with created/request/date in the name
  for (const k of Object.keys(r || {})) {
    if (/created|request|date/i.test(k)) {
      const d = tryParseDate(r[k]);
      if (d) return d.toLocaleDateString("pt-BR");
    }
  }

  return "-";
}
