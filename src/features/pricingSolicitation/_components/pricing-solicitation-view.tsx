"use client";

import { FormLabel } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PricingSolicitationForm, ProductType } from "@/features/pricingSolicitation/server/pricing-solicitation";
import { SolicitationFeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";


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

export function PricingSolicitationView({
  pricingSolicitation,
}: {
  pricingSolicitation: PricingSolicitationForm;
}) {
  if (!pricingSolicitation) {
    return <div>Nenhuma solicitação encontrada</div>;
  }

  // Map brands from solicitation to display format
  const brandsMap = new Map();
  pricingSolicitation.brands?.forEach((brand) => {
    brandsMap.set(brand.name, brand);
  });

  // Organize fees by brand and product type
  const feesData = brandList.map((brandItem) => {
    const brand = brandsMap.get(brandItem.value) || {
      name: brandItem.value,
      productTypes: [],
    };

    const productTypeMap = new Map();
    brand.productTypes.forEach((pt: ProductType) => {
      productTypeMap.set(pt.name, pt);
    });

    return {
      brand: brandItem,
      productTypes: SolicitationFeeProductTypeList.map((ptItem) => {
        return (
          productTypeMap.get(ptItem.value) || {
            name: ptItem.value,
            fee: "-",
          }
        );
      }),
    };
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="space-y-2">
            <FormLabel>CNAE</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50">
              {pricingSolicitation.cnae || "-"}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2">
            <FormLabel>MCC</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50">
              {pricingSolicitation.mcc || "-"}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2">
            <FormLabel>Quantidade de CNPJs</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50">
              {pricingSolicitation.cnpjQuantity || "-"}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2">
            <FormLabel>Ticket Médio</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50">
              {pricingSolicitation.averageTicket || "-"}
            </div>
          </div>
        </div>
        <div>
          <div className="space-y-2">
            <FormLabel>TPV Mensal</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50">
              {pricingSolicitation.monthlyPosFee || "-"}
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
            <div className="h-4 w-4 rounded border flex items-center justify-center">
              {pricingSolicitation.cnaeInUse && (
                <span className="h-2 w-2 bg-black rounded-sm" />
              )}
            </div>
            <div className="space-y-1 leading-none">
              <FormLabel>CNAE em uso?</FormLabel>
            </div>
          </div>
        </div>
      </div>

      {pricingSolicitation.cnaeInUse && pricingSolicitation.description && (
        <div className="mb-6">
          <div className="space-y-2">
            <FormLabel>Descrição</FormLabel>
            <div className="p-2 border rounded-md bg-gray-50 min-h-[100px]">
              {pricingSolicitation.description}
            </div>
          </div>
        </div>
      )}

      {/* Brand Table */}
      <div className="w-full overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 z-10 bg-white">
                Bandeiras
              </TableHead>
              {SolicitationFeeProductTypeList.map((type, index) => (
                <TableHead
                  key={`${type.value}-${index}`}
                  className="text-center min-w-[100px]"
                >
                  {type.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {feesData.map((item) => (
              <TableRow key={item.brand.value}>
                <TableCell className="font-medium sticky left-0 z-10 bg-white">
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
                </TableCell>
                {item.productTypes.map((productType, typeIndex) => (
                  <TableCell
                    key={`${item.brand.value}-${productType.name}-${typeIndex}`}
                    className="p-1 text-center"
                  >
                    <div
                      className={`rounded-full py-1 px-3 inline-block w-[70px] text-center ${
                        typeIndex % 2 === 0 ? "bg-blue-100" : "bg-amber-100"
                      }`}
                    >
                      {productType.fee || "-"}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* PIX Fees Section - if available */}
        <div className="mt-12 mb-6">
          <h3 className="text-lg font-medium mb-4">PIX</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium mb-2">MDR</h4>
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {"-"}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Custo Mínimo</h4>
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {"-"}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Custo Máximo</h4>
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {"-"}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Antecipação</h4>
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {"-"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="mt-8">
        <div className="p-4 rounded-md bg-amber-50">
          <p className="text-amber-800 font-medium">
            Status:{" "}
            {pricingSolicitation.status === "PENDING"
              ? "Em análise"
              : pricingSolicitation.status === "SEND_DOCUMENTS"
              ? "Aguardando documentos"
              : pricingSolicitation.status}
          </p>
          <p className="text-amber-700 text-sm mt-1">
            {pricingSolicitation.status === "PENDING"
              ? "Esta solicitação está em análise e não pode ser editada."
              : pricingSolicitation.status === "SEND_DOCUMENTS"
              ? "Complete o envio dos documentos e clique em 'Enviar formulário' para finalizar a solicitação."
              : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
