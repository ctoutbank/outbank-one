"use client";

import { Zap, Settings } from "lucide-react";
import { formatBRL } from "@/app/utils/currency";

type Props = {
  limit: number;            // limite diário configurado
  daysToSettle: number;     // dias até crédito na conta
  enabled: boolean;         // se a regra está ativa
};

export default function AutoAnticipationCard({
  limit,
  daysToSettle,
  enabled,
}: Props) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
          <Zap size={18} className="text-orange-500" />
          Antecipação Automática
        </h3>

        <button className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:underline">
          <Settings size={14} /> Configurar
        </button>
      </div>

      {/* Miolo */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-600">Limite Diário</p>
          <p className="mt-1 text-lg font-semibold text-gray-800 tabular-nums">
            {formatBRL(limit)}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-600">Prazo de Crédito</p>
          <p className="mt-1 text-lg font-semibold text-gray-800">
            {daysToSettle} dia{daysToSettle > 1 && "s"}
          </p>
        </div>
      </div>

      {/* Badge de status */}
      <div
        className={`mt-4 rounded-md px-3 py-2 text-xs font-medium ${
          enabled
            ? "bg-emerald-50 text-emerald-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {enabled ? "Regra ativa — as solicitações ocorrem todos os dias úteis"
                 : "Regra desativada"}
      </div>
    </div>
  );
}
