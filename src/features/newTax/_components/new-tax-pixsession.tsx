"use client";

import { CurrencyInput } from "@/components/currency-input";
import { PercentageInput } from "@/components/percentage-input";

import { FeeData } from "@/features/newTax/server/fee-db";
import { forwardRef, useImperativeHandle, useState } from "react";

interface NewTaxPixSessionProps {
  data: FeeData;
  tableType?: string;
}

export const NewTaxPixSession = forwardRef<
  {
    getFormData: () => {
      pixConfig: {
        mdrPresent: string;
        mdrNotPresent: string;
        minCostPresent: string;
        minCostNotPresent: string;
        maxCostPresent: string;
        maxCostNotPresent: string;
        anticipationRatePresent: string;
        anticipationRateNotPresent: string;
      };
    };
  },
  NewTaxPixSessionProps
>(function NewTaxPixSession({ data, tableType }, ref) {
  const [pixConfig, setPixConfig] = useState({
    mdrPresent: data?.cardPixMdr?.replace(" %", "").replace(",", ".") || "",
    mdrNotPresent:
      data?.nonCardPixMdr?.replace(" %", "").replace(",", ".") || "",
    minCostPresent: data?.cardPixMinimumCostFee?.replace(",", ".") || "",
    minCostNotPresent: data?.nonCardPixMinimumCostFee?.replace(",", ".") || "",
    maxCostPresent: data?.cardPixCeilingFee?.replace(",", ".") || "",
    maxCostNotPresent: data?.nonCardPixCeilingFee?.replace(",", ".") || "",
    anticipationRatePresent: data?.eventualAnticipationFee || "",
    anticipationRateNotPresent: data?.eventualAnticipationFee || "",
  });

  // Expor o método getFormData via ref para o componente pai
  useImperativeHandle(ref, () => ({
    getFormData: () => ({
      pixConfig,
    }),
  }));

  function handlePixInputChange(field: keyof typeof pixConfig, value: string) {
    setPixConfig((prev) => ({ ...prev, [field]: value }));
  }

  if (!data) {
    return <div className="text-sm text-gray-500">Dados não disponíveis</div>;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 border rounded-xl shadow-sm overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r first:rounded-tl-xl last:rounded-tr-xl">
                Configuração
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
                Cartão Presente
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider last:rounded-tr-xl">
                Cartão Não Presente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                Custo Mínimo
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r">
                <div className="flex items-center justify-center">
                  <CurrencyInput
                    value={pixConfig.minCostPresent || ""}
                    onValueChange={(values) =>
                      handlePixInputChange("minCostPresent", values.value)
                    }
                    placeholder="R$"
                    className="w-24 text-right bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                <div className="flex items-center justify-center">
                  <CurrencyInput
                    value={pixConfig.minCostNotPresent || ""}
                    onValueChange={(values) =>
                      handlePixInputChange("minCostNotPresent", values.value)
                    }
                    placeholder="R$ "
                    className="w-24 text-right bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                Custo Máximo
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r">
                <div className="flex items-center justify-center">
                  <CurrencyInput
                    value={pixConfig.maxCostPresent || ""}
                    onValueChange={(values) =>
                      handlePixInputChange("maxCostPresent", values.value)
                    }
                    placeholder="R$ "
                    className="w-24 text-right bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r">
                <div className="flex items-center justify-center">
                  <CurrencyInput
                    value={pixConfig.maxCostNotPresent || ""}
                    onValueChange={(values) =>
                      handlePixInputChange("maxCostNotPresent", values.value)
                    }
                    placeholder="R$ "
                    className="w-24 text-right bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                MDR
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r">
                <div className="flex items-center justify-center">
                  <PercentageInput
                    value={pixConfig.mdrPresent || ""}
                    onChange={(value) =>
                      handlePixInputChange("mdrPresent", value)
                    }
                    placeholder="%"
                    className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                <div className="flex items-center justify-center">
                  <PercentageInput
                    value={pixConfig.mdrNotPresent || ""}
                    onChange={(value) =>
                      handlePixInputChange("mdrNotPresent", value)
                    }
                    placeholder="%"
                    className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                  />
                </div>
              </td>
            </tr>
            {tableType === "EVENTUAL" && (
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                  Taxa de Antecipação
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700 border-r">
                  <div className="flex items-center justify-center">
                    <PercentageInput
                      value={pixConfig.anticipationRatePresent || ""}
                      onChange={(value) =>
                        handlePixInputChange("anticipationRatePresent", value)
                      }
                      placeholder="% a.m."
                      className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                  <div className="flex items-center justify-center">
                    <PercentageInput
                      value={pixConfig.anticipationRateNotPresent || ""}
                      onChange={(value) =>
                        handlePixInputChange(
                          "anticipationRateNotPresent",
                          value
                        )
                      }
                      placeholder="% a.m."
                      className="w-20 text-center bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition"
                    />
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
});
