"use client";

import { useState } from "react";

type Props = {
  merchantSlug: string;
  eventualAnticipations: any;
};

export default function SimulatorCard({ merchantSlug, eventualAnticipations }: Props) {
  const [capital, setCapital] = useState("receivable");
  const [amount, setAmount] = useState("");

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica de simulação
    console.log({ capital, amount, merchantSlug });
  };

  return (
    <div className="card p-6 sticky top-24">
      <h3 className="text-base font-semibold text-gray-800 mb-4">Simulador</h3>

      <form onSubmit={handleSimulate} className="space-y-4">
        <div>
          <label className="label">Tipo de Capital</label>
          <select
            className="input"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          >
            <option value="receivable">Antecipação de Recebíveis</option>
            <option value="loan">Novo Empréstimo</option>
          </select>
        </div>

        <div>
          <label className="label">Valor Desejado</label>
          <input
            type="number"
            className="input"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary w-full">
          Simular
        </button>
      </form>

      <div className="mt-6 text-xs text-gray-400 space-y-1">
        <p>Merchant: {merchantSlug || "Todos"}</p>
        <p>Eventuais: {eventualAnticipations?.totalCount || 0}</p>
      </div>
    </div>
  );
}
