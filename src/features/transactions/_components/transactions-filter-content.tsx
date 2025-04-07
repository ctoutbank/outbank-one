"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useState } from "react";

type FilterTransactionsContentProps = {
  statusIn?: string;
  merchantIn?: string;
  dateFromIn?: string;
  dateToIn?: string;
  productTypeIn?: string;
  onFilter: (filters: {
    status: string;
    merchant: string;
    dateFrom: string;
    dateTo: string;
    productType: string;
  }) => void;
  onClose: () => void;
};

export function FilterTransactionsContent({
  statusIn,
  merchantIn,
  dateFromIn,
  dateToIn,
  productTypeIn,
  onFilter,
  onClose,
}: FilterTransactionsContentProps) {
  const [status, setStatus] = useState(statusIn || "");
  const [merchant, setMerchant] = useState(merchantIn || "");
  const [dateFrom, setDateFrom] = useState(dateFromIn || "");
  const [dateTo, setDateTo] = useState(dateToIn || "");
  const [productType, setProductType] = useState(productTypeIn || "");

  const statuses = [
    {
      value: "AUTHORIZED",
      label: "Aprovada",
      color: "bg-emerald-500 hover:bg-emerald-600",
    },
    {
      value: "PENDING",
      label: "Pendente",
      color: "bg-yellow-500 hover:bg-yellow-600",
    },
    {
      value: "REJECTED",
      label: "Rejeitada",
      color: "bg-red-500 hover:bg-red-600",
    },
    {
      value: "CANCELED",
      label: "Cancelada",
      color: "bg-gray-500 hover:bg-gray-600",
    },
  ];

  const productTypes = [
    {
      value: "DEBIT",
      label: "Débito",
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      value: "CREDIT",
      label: "Crédito",
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      value: "VOUCHER",
      label: "Voucher",
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      value: "PIX",
      label: "PIX",
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      value: "PREPAID_CREDIT",
      label: "Crédito Pré-pago",
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      value: "PREPAID_DEBIT",
      label: "Débito Pré-pago",
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ];

  return (
    <div className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1100px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium ml-2">Status</h3>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <Badge
                key={s.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer w-24 h-7 select-none text-sm",
                  status === s.value ? s.color : "bg-secondary",
                  status === s.value
                    ? "text-white"
                    : "text-secondary-foreground"
                )}
                onClick={() => setStatus(status === s.value ? "" : s.value)}
              >
                {s.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tipo de Produto</h3>
          <div className="flex flex-wrap gap-2">
            {productTypes.map((pt) => (
              <Badge
                key={pt.value}
                variant="secondary"
                className={cn(
                  "cursor-pointer select-none text-sm",
                  productType === pt.value ? pt.color : "bg-secondary",
                  productType === pt.value
                    ? "text-white"
                    : "text-secondary-foreground"
                )}
                onClick={() =>
                  setProductType(productType === pt.value ? "" : pt.value)
                }
              >
                {pt.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Nome do estabelecimento"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Inicial</h3>
          <Input
            type="datetime-local"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>

        <div className="space-y-2 md:col-start-2">
          <h3 className="text-sm font-medium">Data Final</h3>
          <Input
            type="datetime-local"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={() => {
            onFilter({ status, merchant, dateFrom, dateTo, productType });
            onClose();
          }}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
