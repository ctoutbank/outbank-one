import { Card, CardContent } from "@/components/ui/card";
import { SolicitationFeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import type { PricingSolicitationSchema } from "../schema/schema";

interface PricingSolicitationReadOnlyViewProps {
  data: PricingSolicitationSchema;
}

const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName] || "";
};

export function PricingSolicitationReadOnlyView({
  data,
}: PricingSolicitationReadOnlyViewProps) {
  // Organize fees by brand and product type
  const feesData = brandList.map((brandItem) => {
    const brand = data.brands?.find((b) => b.name === brandItem.value) || {
      name: brandItem.value,
      productTypes: [],
    };

    const productTypeMap = new Map();
    brand.productTypes?.forEach((pt) => {
      // Normalize product type name by removing extra spaces
      const normalizedName = pt.name?.trim() ?? "";
      if (normalizedName) {
        productTypeMap.set(normalizedName, pt);
      }
    });

    return {
      brand: brandItem,
      productTypes: SolicitationFeeProductTypeList.map((ptItem) => {
        const normalizedValue = ptItem.value.trim();
        const productType = productTypeMap.get(normalizedValue);

        return (
          productType || {
            name: normalizedValue,
            fee: "-",
            feeAdmin: "-",
            noCardFee: "-",
            noCardFeeAdmin: "-",
          }
        );
      }),
    };
  });

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="space-y-2">
                <h4 className="font-medium">CNAE</h4>
                <div className="p-2 border rounded-md bg-gray-50">
                  {data.cnae || "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <h4 className="font-medium">MCC</h4>
                <div className="p-2 border rounded-md bg-gray-50">
                  {data.mcc || "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <h4 className="font-medium">Quantidade de CNPJs</h4>
                <div className="p-2 border rounded-md bg-gray-50">
                  {data.cnpjsQuantity || "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <h4 className="font-medium">Ticket Médio</h4>
                <div className="p-2 border rounded-md bg-gray-50">
                  {data.ticketAverage || "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="space-y-2">
                <h4 className="font-medium">TPV Mensal</h4>
                <div className="p-2 border rounded-md bg-gray-50">
                  {data.tpvMonthly || "-"}
                </div>
              </div>
            </div>
            <div>
              <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
                <div className="h-4 w-4 rounded border flex items-center justify-center">
                  {data.cnaeInUse && (
                    <span className="h-2 w-2 bg-black rounded-sm" />
                  )}
                </div>
                <div className="space-y-1 leading-none">
                  <h4 className="font-medium">CNAE em uso?</h4>
                </div>
              </div>
            </div>
          </div>

          {data.cnaeInUse && data.description && (
            <div className="mb-6">
              <div className="space-y-2">
                <h4 className="font-medium">Descrição</h4>
                <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
                  {data.description}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-lg font-medium">Taxas Transações na POS</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left bg-gray-50">
                      Bandeira
                    </th>
                    {SolicitationFeeProductTypeList.map((type) => (
                      <th
                        key={type.value}
                        className="border p-2 text-center bg-gray-50"
                      >
                        {type.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feesData.map((item) => (
                    <tr key={item.brand.value}>
                      <td className="border p-2">
                        <div className="flex items-center gap-2">
                          {getCardImage(item.brand.value) && (
                            <img
                              src={getCardImage(item.brand.value)}
                              alt={item.brand.label}
                              width={40}
                              height={24}
                              className="object-contain"
                            />
                          )}
                          {item.brand.label}
                        </div>
                      </td>
                      {item.productTypes.map((pt, index) => (
                        <td key={index} className="border p-2 text-center">
                          <span className="bg-blue-100 rounded-full py-1 px-3 inline-block">
                            {pt.fee || "-"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-medium mt-8">
              Taxas Transações Online
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border p-2 text-left bg-gray-50">
                      Bandeira
                    </th>
                    {SolicitationFeeProductTypeList.map((type) => (
                      <th
                        key={type.value}
                        className="border p-2 text-center bg-gray-50"
                      >
                        {type.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feesData.map((item) => (
                    <tr key={`online-${item.brand.value}`}>
                      <td className="border p-2">
                        <div className="flex items-center gap-2">
                          {getCardImage(item.brand.value) && (
                            <img
                              src={getCardImage(item.brand.value)}
                              alt={item.brand.label}
                              width={40}
                              height={24}
                              className="object-contain"
                            />
                          )}
                          {item.brand.label}
                        </div>
                      </td>
                      {item.productTypes.map((pt, index) => (
                        <td key={index} className="border p-2 text-center">
                          <span className="bg-amber-100 rounded-full py-1 px-3 inline-block">
                            {pt.noCardFee || "-"}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">PIX</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">MDR</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.cardPixMdr ? `${data.cardPixMdr}%` : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Custo Mínimo</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.cardPixMinimumCostFee
                        ? `R$ ${data.cardPixMinimumCostFee}`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Custo Máximo</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.cardPixCeilingFee
                        ? `R$ ${data.cardPixCeilingFee}`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Antecipação</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.eventualAnticipationFee
                        ? `${data.eventualAnticipationFee}%`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">PIX sem Cartão</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium">MDR</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.nonCardPixMdr ? `${data.nonCardPixMdr}%` : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Custo Mínimo</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.nonCardPixMinimumCostFee
                        ? `R$ ${data.nonCardPixMinimumCostFee}`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Custo Máximo</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.nonCardPixCeilingFee
                        ? `R$ ${data.nonCardPixCeilingFee}`
                        : "-"}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium">Antecipação</h4>
                    <div className="bg-gray-100 rounded-md p-2 mt-1">
                      {data.eventualAnticipationFee
                        ? `${data.eventualAnticipationFee}%`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
