"use client";

import { Input } from "@/components/ui/input";
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
      <table className="w-full divide-y divide-gray-200 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
              Configuração
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider border-r">
              Cartão Presente
            </th>
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
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
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`R$ ${pixConfig.minCostPresent}`}
                  onChange={(e) =>
                    handlePixInputChange("minCostPresent", e.target.value)
                  }
                />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
              <div className="flex items-center justify-center">
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`R$ ${pixConfig.minCostNotPresent}`}
                  onChange={(e) =>
                    handlePixInputChange("minCostNotPresent", e.target.value)
                  }
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
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`R$  ${pixConfig.maxCostPresent}`}
                  onChange={(e) =>
                    handlePixInputChange("maxCostPresent", e.target.value)
                  }
                />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
              <div className="flex items-center justify-center">
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`R$ ${pixConfig.maxCostNotPresent}`}
                  onChange={(e) =>
                    handlePixInputChange("maxCostNotPresent", e.target.value)
                  }
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
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`${pixConfig.mdrPresent}%`}
                  onChange={(e) =>
                    handlePixInputChange("mdrPresent", e.target.value)
                  }
                />
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
              <div className="flex items-center justify-center">
                <Input
                  type="text"
                  className="w-20 text-right"
                  value={`${pixConfig.mdrNotPresent}%`}
                  onChange={(e) =>
                    handlePixInputChange("mdrNotPresent", e.target.value)
                  }
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
                  <Input
                    type="text"
                    className="w-20 text-right"
                    value={pixConfig.anticipationRatePresent}
                    onChange={(e) =>
                      handlePixInputChange(
                        "anticipationRatePresent",
                        e.target.value
                      )
                    }
                  />
                  <span className="ml-1">% a.m.</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-700">
                <div className="flex items-center justify-center">
                  <Input
                    type="text"
                    className="w-20 text-right"
                    value={pixConfig.anticipationRateNotPresent}
                    onChange={(e) =>
                      handlePixInputChange(
                        "anticipationRateNotPresent",
                        e.target.value
                      )
                    }
                  />
                  <span className="ml-1">% a.m.</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});
