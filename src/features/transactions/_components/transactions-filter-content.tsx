"use client";

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  brandList,
  cardPaymentMethod,
  processingTypeList,
  transactionProductTypeList,
  transactionStatusList,
} from "@/lib/lookuptables/lookuptables-transactions";
import { Search } from "lucide-react";
import { KeyboardEvent, useState } from "react";

type FilterTransactionsContentProps = {
  statusIn?: string;
  merchantIn?: string;
  dateFromIn?: string;
  dateToIn?: string;
  productTypeIn?: string;
  brandIn?: string;
  nsuIn?: string;
  methodIn?: string;
  salesChannelIn?: string;
  terminalIn?: string;
  valueMinIn?: string;
  valueMaxIn?: string;
  onFilter: (filters: {
    status: string;
    merchant: string;
    dateFrom: string;
    dateTo: string;
    productType: string;
    brand: string;
    nsu: string;
    method: string;
    salesChannel: string;
    terminal: string;
    valueMin: string;
    valueMax: string;
  }) => void;
  onClose: () => void;
};

export function FilterTransactionsContent({
  statusIn,
  merchantIn,
  dateFromIn,
  dateToIn,
  productTypeIn,
  brandIn,
  nsuIn,
  methodIn,
  salesChannelIn,
  terminalIn,
  valueMinIn,
  valueMaxIn,
  onFilter,
  onClose,
}: FilterTransactionsContentProps) {
  // Iniciar com arrays de valores separados por vírgulas, se existirem
  const initialStatusValues = statusIn ? statusIn.split(",") : [];
  const initialProductTypeValues = productTypeIn
    ? productTypeIn.split(",")
    : [];
  const initialBrandValues = brandIn ? brandIn.split(",") : [];
  const initialMethodValues = methodIn ? methodIn.split(",") : [];
  const initialSalesChannelValues = salesChannelIn
    ? salesChannelIn.split(",")
    : [];

  const [statusValues, setStatusValues] =
    useState<string[]>(initialStatusValues);
  const [productTypeValues, setProductTypeValues] = useState<string[]>(
    initialProductTypeValues
  );
  const [brandValues, setBrandValues] = useState<string[]>(initialBrandValues);
  const [methodValues, setMethodValues] =
    useState<string[]>(initialMethodValues);
  const [salesChannelValues, setSalesChannelValues] = useState<string[]>(
    initialSalesChannelValues
  );
  const [merchant, setMerchant] = useState(merchantIn || "");
  const [dateFrom, setDateFrom] = useState(dateFromIn || "");
  const [dateTo, setDateTo] = useState(dateToIn || "");
  const [nsu, setNsu] = useState(nsuIn || "");
  const [terminal, setTerminal] = useState(terminalIn || "");
  const [valueMin, setValueMin] = useState(valueMinIn || "");
  const [valueMax, setValueMax] = useState(valueMaxIn || "");

  const handleSubmitFilter = () => {
    // Converter os arrays de valores para strings separadas por vírgulas
    const statusString = statusValues.join(",");
    const productTypeString = productTypeValues.join(",");
    const brandString = brandValues.join(",");
    const methodString = methodValues.join(",");
    const salesChannelString = salesChannelValues.join(",");

    onFilter({
      status: statusString,
      merchant,
      dateFrom,
      dateTo,
      productType: productTypeString,
      brand: brandString,
      nsu,
      method: methodString,
      salesChannel: salesChannelString,
      terminal,
      valueMin,
      valueMax,
    });
    onClose();
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement | HTMLDivElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitFilter();
    }
  };

  return (
    <div
      className="absolute left-0 mt-2 bg-background border rounded-lg p-4 shadow-md min-w-[1400px]"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Primeira linha - Status, Bandeira, Tipo de Pagamento, Processamento */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Status</h3>
          <MultiSelect
            options={transactionStatusList}
            onValueChange={setStatusValues}
            defaultValue={initialStatusValues}
            placeholder="Selecione o status"
            className="w-full"
            variant="secondary"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Bandeira</h3>
          <MultiSelect
            options={brandList}
            onClick={(e) => e.stopPropagation()}
            onValueChange={setBrandValues}
            defaultValue={initialBrandValues}
            placeholder="Selecione a bandeira"
            className="w-full"
            variant="secondary"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tipo de Pagamento</h3>
          <MultiSelect
            options={transactionProductTypeList}
            onValueChange={setProductTypeValues}
            defaultValue={initialProductTypeValues}
            placeholder="Selecione o tipo de pagamento"
            className="w-full"
            variant="secondary"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Processamento</h3>
          <MultiSelect
            options={processingTypeList}
            onValueChange={setSalesChannelValues}
            defaultValue={initialSalesChannelValues}
            placeholder="Selecione o processamento"
            className="w-full"
            variant="secondary"
          />
        </div>

        {/* Segunda linha - Tipo de Transação, Estabelecimento, Terminal, NSU */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Tipo da Transação</h3>
          <MultiSelect
            options={cardPaymentMethod}
            onValueChange={setMethodValues}
            defaultValue={initialMethodValues}
            placeholder="Selecione o tipo"
            className="w-full"
            variant="secondary"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Estabelecimento</h3>
          <Input
            placeholder="Nome do estabelecimento"
            value={merchant}
            onChange={(e) => setMerchant(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Terminal</h3>
          <Input
            placeholder="Número do terminal"
            value={terminal}
            onChange={(e) => setTerminal(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">NSU / ID</h3>
          <Input
            placeholder="Número de Sequência Único"
            value={nsu}
            onChange={(e) => setNsu(e.target.value.replace(/\D/g, ""))}
            onKeyDown={handleKeyDown}
          />
        </div>

        {/* Terceira linha - Data Inicial, Data Final, Valor (ocupa 2 colunas) */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Inicial</h3>
          <Input
            type="datetime-local"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Data Final</h3>
          <Input
            type="datetime-local"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <h3 className="text-sm font-medium">Valor</h3>
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Mínimo"
              type="number"
              value={valueMin}
              onChange={(e) => setValueMin(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Input
              placeholder="Máximo"
              type="number"
              value={valueMax}
              onChange={(e) => setValueMax(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 mt-4 border-t">
        <Button
          onClick={handleSubmitFilter}
          className="flex items-center gap-2"
        >
          <Search className="h-4 w-4" />
          Filtrar
        </Button>
      </div>
    </div>
  );
}
