"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface TaxesFormProps {
  onSubmit: (data: any) => void;
}

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  return `${day}/${month}/${year}`;
}

function maskCNAE(value: string): string {
  // Remove all non-digits
  let digits = value.replace(/\D/g, "");
  // Limit to 7 digits
  digits = digits.slice(0, 7);
  // Apply mask: 1111-1/11
  if (digits.length > 4) {
    digits = digits.slice(0, 4) + "-" + digits.slice(4);
  }
  if (digits.length > 6) {
    digits = digits.slice(0, 6) + "/" + digits.slice(6);
  }
  return digits;
}

export function TaxesForm({ onSubmit }: TaxesFormProps) {
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
  });

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
    // Save to localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("taxes-list");
      console.log("Current stored data:", stored);
      let list = stored ? JSON.parse(stored) : [];
      const newEntry = {
        ...form,
        cnae: form.cnae,
        date: formatDate(new Date()),
      };
      console.log("New entry:", newEntry);
      // Filter out undefined or invalid entries
      list = list.filter((item: any) => item && item.cnae && item.date);
      const newList = [newEntry, ...list];
      console.log("Saving new list:", newList);
      localStorage.setItem("taxes-list", JSON.stringify(newList));

      // Dispatch custom event to notify other components
      console.log("Dispatching tax-added event");
      const event = new CustomEvent("tax-added", { detail: newList });
      window.dispatchEvent(event);
    }
    onSubmit(form);
  }

  return (
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
          <Input id="mcc" name="mcc" value={form.mcc} onChange={handleChange} />
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
          <Input id="tpv" name="tpv" value={form.tpv} onChange={handleChange} />
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
          Enviar
        </Button>
      </div>
    </form>
  );
}
