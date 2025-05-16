"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TaxRow {
  cnae: string;
  date: string;
  mcc?: string;
  quantidade?: string;
  cnpjs?: string;
  ticket?: string;
  tpv?: string;
  debito?: string;
  credito?: string;
  antecipacoes?: string;
  file?: File | null;
  [key: string]: any;
}

function getInitialData(): TaxRow[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("taxes-list");
    console.log("Stored data:", stored);
    if (stored) return JSON.parse(stored);
  }
  return [];
}

export function TaxesList() {
  const [data, setData] = useState<TaxRow[]>([]);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const initialData = getInitialData();
    console.log("Initial data:", initialData);
    setData(initialData);

    function sync() {
      const stored = localStorage.getItem("taxes-list");
      console.log("Syncing data:", stored);
      if (stored) {
        const parsedData = JSON.parse(stored);
        console.log("Setting new data:", parsedData);
        setData(parsedData);
      }
    }

    // Listen for storage events from other tabs
    window.addEventListener("storage", sync);

    // Listen for custom event when a new tax is added
    window.addEventListener("tax-added", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("tax-added", sync);
    };
  }, []);

  if (!mounted) return null;

  function handleRowClick(cnae: string) {
    router.push(`/portal/taxes/${encodeURIComponent(cnae)}`);
  }

  return (
    <div className="w-full rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Solicitação</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: TaxRow, i: number) => (
            <TableRow
              key={row.cnae + i}
              className="cursor-pointer"
              onClick={() => handleRowClick(row.cnae)}
            >
              <TableCell>
                <span className="text-xs text-gray-500 mr-1">Cnae :</span>{" "}
                {row.cnae}
              </TableCell>
              <TableCell>{row.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
