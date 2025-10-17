"use client";

import { Banknote, CheckCircle } from "lucide-react";
import { formatBRL } from "@/app/utils/currency";

type Props = {
  available: number;       // valor disponível hoje
  processing: number;      // valor em processamento
  nextPayout: string;      // data do próximo repasse
};

export default function SaldoCard({
  available,
  processing,
  nextPayout,
}: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Banknote size={18} className="text-indigo-600" />
          <span>
            R$</span> Saldo Disponível
        </h3>

        {/* “Atualizar”/Refresh opcional */}
        <button
          className="rounded text-xs font-medium text-indigo-600 hover:underline"
          onClick={() => location.reload()}
        >
          Atualizar
        </button>
      </div>

      {/* Números principais */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Caixa 1  */}
        <div className="rounded-md bg-indigo-50 p-4">
          <p className="text-xs text-gray-600">Cartão presente</p>
          <p className="mt-1 text-2xl font-semibold text-indigo-700 tabular-nums">
            {formatBRL(available)}
          </p>
        </div>

        {/* Caixa 2 */}
        <div className="rounded-md bg-sky-50 p-4">
          <p className="text-xs text-gray-600">Cartão não presente</p>
          <p className="mt-1 text-2xl font-semibold text-sky-700 tabular-nums">
            {formatBRL(processing)}
          </p>
        </div>
      </div>

      {/* Rodapé */}
      <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <CheckCircle size={14} className="text-emerald-500" />
          Próximo repasse
        </span>
        <span className="font-medium">{nextPayout !== "-"
          ? new Date(nextPayout).toLocaleDateString("pt-BR")
          : "-"
          }</span>
      </div>
    </div>
  );
}
