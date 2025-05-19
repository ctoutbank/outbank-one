"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface TaxEditFormProps {
  cnae: string;
  onSubmit: (data: any) => void;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

function maskCNAE(value: string): string {
  let digits = value.replace(/\D/g, "");
  digits = digits.slice(0, 7);
  if (digits.length > 4) {
    digits = digits.slice(0, 4) + "-" + digits.slice(4);
  }
  if (digits.length > 6) {
    digits = digits.slice(0, 6) + "/" + digits.slice(6);
  }
  return digits;
}

function TaxRatesTable() {
  const bandeiras = [
    { name: "Visa", icon: "/visa.svg" },
    { name: "Mastercard", icon: "/mastercard.svg" },
    { name: "Elo", icon: "/elo.svg" },
    { name: "American Express", icon: "/american-express.svg" },
    { name: "Hipercard", icon: "/hipercard.svg" },
    { name: "Cabal", icon: "/cabal.svg" },
  ];
  const columns = [
    "Pré-pago",
    "Pré-pago",
    "Pré-pago",
    "Débito",
    "Débito",
    "Débito",
    "Crédito (à vista)",
    "Crédito (à vista)",
    "Crédito (à vista)",
    "Crédito (2-6x)",
    "Crédito (2-6x)",
    "Crédito (7-12)",
    "Crédito (7-12)",
  ];
  const rates = [
    "1.99%",
    "0,01",
    "2.00%",
    "0,10",
    "2.10%",
    "1.99%",
    "1.98%",
    "1.99%",
    "1.99%",
    "1.99%",
    "1.99%",
    "1.99%",
    "1.99%",
  ];

  return (
    <div className="mt-8">
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="min-w-full text-xs text-center">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left">Bandeiras</th>
              {columns.map((col, i) => (
                <th key={i} className="px-2 py-2">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bandeiras.map((b) => (
              <tr key={b.name} className="border-t">
                <td className="flex items-center gap-2 px-2 py-2">
                  <img src={b.icon} alt={b.name} className="h-5 w-5" />
                  <span>{b.name}</span>
                </td>
                {rates.map((rate, j) => (
                  <td key={j}>
                    <span
                      className={`inline-block px-2 py-1 rounded 
                      ${
                        j % 3 === 0
                          ? "bg-blue-100 text-blue-700"
                          : j % 3 === 1
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {rate}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* PIX Section */}
      <div className="mt-6 p-4 rounded-lg border bg-white w-full">
        <div className="font-semibold mb-2">Taxas PIX</div>
        <div className="grid grid-cols-4 gap-4 text-xs">
          <div>
            <div className="text-gray-500">MDR</div>
            <div>0.01%</div>
          </div>
          <div>
            <div className="text-gray-500">Custo Mínimo</div>
            <div>R$ 0.09</div>
          </div>
          <div>
            <div className="text-gray-500">Custo Máximo</div>
            <div>R$ 0.09</div>
          </div>
          <div>
            <div className="text-gray-500">Antecipação</div>
            <div>1.67% ao mês</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TaxEditForm({ cnae, onSubmit }: TaxEditFormProps) {
  const [form, setForm] = useState({
    cnae: "",
    mcc: "",
    quantidade: "",
    cnpjs: "",
    ticket: "",
    tpv: "",
    debito: "",
    credito: "",
    antecipacoes: "",
    file: null as File | null,
    date: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("taxes-list");
      if (stored) {
        const list = JSON.parse(stored);
        const found = list.find((item: any) => item.cnae === cnae);
        if (found) setForm({ ...found });
      }
    }
  }, [cnae]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, files } = e.target;
    if (name === "cnae") {
      setForm((prev) => ({
        ...prev,
        cnae: maskCNAE(value),
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("taxes-list");
      let list = stored ? JSON.parse(stored) : [];
      list = list.map((item: any) =>
        item.cnae === cnae
          ? { ...form, date: item.date || formatDate(new Date()) }
          : item
      );
      localStorage.setItem("taxes-list", JSON.stringify(list));
    }
    onSubmit(form);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md border w-full"
      >
        <h2 className="text-lg font-semibold mb-4">Solicitação de Taxas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="cnae">CNAE *</Label>
            <Input
              id="cnae"
              name="cnae"
              value={form.cnae}
              onChange={handleChange}
              required
              maxLength={10}
              placeholder="1111-1/11"
            />
            <Label htmlFor="mcc">MCC</Label>
            <Input
              id="mcc"
              name="mcc"
              value={form.mcc}
              onChange={handleChange}
            />
            <Label htmlFor="quantidade">Quantidade de CNPJs</Label>
            <Input
              id="quantidade"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
            />
            <Label htmlFor="ticket">Ticket Médio</Label>
            <Input
              id="ticket"
              name="ticket"
              value={form.ticket}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tpv">TPV Mensal</Label>
            <Input
              id="tpv"
              name="tpv"
              value={form.tpv}
              onChange={handleChange}
            />
            <Label htmlFor="debito">Débito</Label>
            <Input
              id="debito"
              name="debito"
              value={form.debito}
              onChange={handleChange}
            />
            <Label htmlFor="credito">Crédito</Label>
            <Input
              id="credito"
              name="credito"
              value={form.credito}
              onChange={handleChange}
            />
            <Label htmlFor="antecipacoes">Antecipações</Label>
            <Input
              id="antecipacoes"
              name="antecipacoes"
              value={form.antecipacoes}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <label className="flex items-center gap-2 cursor-not-allowed">
            <Input
              type="file"
              name="file"
              className="hidden"
              onChange={handleChange}
              disabled
            />
            <Button type="button" variant="outline" size="sm" disabled>
              <span className="mr-2">&#128194;</span> Importar
            </Button>
          </label>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            Salvar
          </Button>
        </div>
      </form>
      <TaxRatesTable />
    </>
  );
}
