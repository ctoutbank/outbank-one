"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

interface FinancialAdjustmentsFilterProps {
  searchIn?: string;
  typeIn?: string;
  reasonIn?: string;
  activeIn?: string;
}

export function FinancialAdjustmentsFilter({
  searchIn,
  typeIn,
  reasonIn,
  activeIn,
}: FinancialAdjustmentsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchIn || "");
  const [type, setType] = useState(typeIn || "");
  const [reason, setReason] = useState(reasonIn || "");
  const [active, setActive] = useState(activeIn || "");

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams?.toString() || "");

    // Reset page when applying filters
    params.delete("page");

    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }

    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }

    if (reason) {
      params.set("reason", reason);
    } else {
      params.delete("reason");
    }

    if (active) {
      params.set("active", active);
    } else {
      params.delete("active");
    }

    router.push(`/portal/financialAdjustment?${params.toString()}`);
  }, [search, type, reason, active, router, searchParams]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setType("");
    setReason("");
    setActive("");
    router.push("/portal/financialAdjustment");
  }, [router]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-muted/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Buscar</label>
          <Input
            placeholder="Título ou descrição..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Tipo</label>
            {type && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setType("")}
                className="h-6 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CREDIT">Crédito</SelectItem>
              <SelectItem value="DEBIT">Débito</SelectItem>
              <SelectItem value="ADJUSTMENT">Ajuste</SelectItem>
              <SelectItem value="REFUND">Reembolso</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Motivo</label>
            {reason && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReason("")}
                className="h-6 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
          </div>
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o motivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CHARGEBACK">Chargeback</SelectItem>
              <SelectItem value="DISPUTE">Disputa</SelectItem>
              <SelectItem value="REFUND">Reembolso</SelectItem>
              <SelectItem value="FEE_ADJUSTMENT">Ajuste de Taxa</SelectItem>
              <SelectItem value="TECHNICAL_ERROR">Erro Técnico</SelectItem>
              <SelectItem value="OTHER">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Status</label>
            {active && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActive("")}
                className="h-6 px-2 text-xs"
              >
                Limpar
              </Button>
            )}
          </div>
          <Select value={active} onValueChange={setActive}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={applyFilters} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
        <Button
          variant="outline"
          onClick={clearFilters}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      </div>
    </div>
  );
}
