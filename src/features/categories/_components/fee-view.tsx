"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FeeDetail } from "@/features/categories/server/category";
import { SolicitationFeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { User } from "lucide-react";
import { useForm } from "react-hook-form";

interface FeeViewProps {
  feeDetail: FeeDetail;
}

interface ProductType {
  name?: string;
  cardTransactionFee?: string | number | null;
  nonCardTransactionFee?: string | number | null;
  fee?: string | number;
  feeAdmin?: string | number;
  feeDock?: string | number;
  transactionFeeStart?: string | number;
  transactionFeeEnd?: string | number;
  noCardFee?: string | number;
  noCardFeeAdmin?: string | number;
  noCardFeeDock?: string | number;
  noCardTransactionAnticipationMdr?: string | number;
  transactionAnticipationMdr?: string | number;
}

interface Brand {
  name: string;
  productTypes?: ProductType[];
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

// Função para normalizar uma string
function normalizeString(str: string | undefined | null): string {
  return (str ?? "").toUpperCase().trim().replace(/\s+/g, "");
}

export function FeeView({ feeDetail }: FeeViewProps) {
  const form = useForm();

  // Map brands for display
  const brandsMap = new Map<string, Brand>();
  feeDetail.brands?.forEach((brand: any) => {
    const normalizedBrandName = normalizeString(brand.brand);
    brandsMap.set(normalizedBrandName, {
      ...brand,
      name: normalizedBrandName,
      productTypes: brand.productTypes?.map((pt: any) => ({
        ...pt,
        name: normalizeString(pt.name),
        cardTransactionFee: pt.cardTransactionFee ?? "-",
        nonCardTransactionFee: pt.nonCardTransactionFee ?? "-",
      })),
    });
  });

  const feesData = brandList.map((brand) => {
    const normalizedBrandName = normalizeString(brand.value);
    const foundBrand = brandsMap.get(normalizedBrandName);
    // POS types
    const posTypes = SolicitationFeeProductTypeList.map((type) => {
      const normalizedTypeName = normalizeString(type.value);
      const foundType = foundBrand?.productTypes?.find(
        (pt: any) => normalizeString(pt.name) === normalizedTypeName
      );
      return {
        value: type.value,
        label: type.label,
        cardTransactionFee: foundType?.cardTransactionFee ?? "-",
      };
    });
    // Online types
    const onlineTypes = SolicitationFeeProductTypeList.map((type) => {
      const normalizedTypeName = normalizeString(type.value);
      const foundType = foundBrand?.productTypes?.find(
        (pt: any) => normalizeString(pt.name) === normalizedTypeName
      );
      return {
        value: type.value,
        label: type.label,
        nonCardTransactionFee: foundType?.nonCardTransactionFee ?? "-",
      };
    });
    return {
      brand: {
        value: brand.value,
        label: brand.label,
      },
      posTypes,
      onlineTypes,
    };
  });

  // FeeDetail fields
  const {
    eventualAnticipationFee,

    nonCardEventualAnticipationFee,
    cardPixMdr,
    cardPixCeilingFee,
    cardPixMinimumCostFee,
    nonCardPixMdr,
    nonCardPixCeilingFee,
    nonCardPixMinimumCostFee,
  } = feeDetail;
  console.log("feeDetail", feeDetail);
  return (
    <div className="w-full min-h-screen box-border relative overflow-x-hidden">
      <Form {...form}>
        <div className="space-y-8 w-full max-w-full box-border overflow-x-hidden">
          {/* Card: Taxas Transações POS */}
          <Card className="shadow-sm w-full max-w-full overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Taxas Transações POS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-full overflow-x-hidden">
              <div className="overflow-y-hidden overflow-x-auto">
                <Table className="text-xs min-w-[1000px] w-full ">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        key="brand"
                        className="sticky left-0 z-20 bg-white w-20"
                        style={{ width: "2%", minWidth: "30px" }}
                      >
                        Bandeiras
                      </TableHead>
                      {SolicitationFeeProductTypeList.map((type, index) => (
                        <TableHead
                          key={`${type.value}-cardTransactionFee-${index}`}
                          className="text-center"
                          style={{ width: "3%", minWidth: "30px" }}
                        >
                          {type.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feesData.map((item) => (
                      <TableRow key={item.brand.value}>
                        <TableCell
                          className="font-medium sticky left-0 z-20 bg-white"
                          style={{ minWidth: "30px" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            {getCardImage(item.brand.value) && (
                              <img
                                src={getCardImage(item.brand.value)}
                                alt={item.brand.label}
                                width={40}
                                height={24}
                                className="object-contain w-8 h-5 sm:w-10 sm:h-6 flex-shrink-0"
                              />
                            )}
                            <span className="truncate">{item.brand.label}</span>
                          </div>
                        </TableCell>
                        {item.posTypes.map((productType, typeIndex) => (
                          <TableCell
                            key={`${item.brand.value}-${productType.value}-cardTransactionFee-${typeIndex}`}
                            className="p-1 text-center"
                          >
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-blue-100 text-xs sm:text-sm">
                              {productType.cardTransactionFee !== undefined &&
                              productType.cardTransactionFee !== null &&
                              productType.cardTransactionFee !== "-"
                                ? `${productType.cardTransactionFee}%`
                                : "-"}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardContent>
              <h4 className="font-medium mb-2 text-sm">PIX POS</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 w-full max-w-full">
                <div>
                  <h4 className="font-medium mb-1 text-sm">MDR Cartão</h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {cardPixMdr ? `${cardPixMdr}%` : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Custo Mínimo Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {cardPixMinimumCostFee
                        ? `R$ ${cardPixMinimumCostFee}`
                        : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Custo Máximo Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {cardPixCeilingFee ? `R$ ${cardPixCeilingFee}` : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Antecipação Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {eventualAnticipationFee
                        ? `${eventualAnticipationFee}%`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Taxas Transações Online */}
          <Card className="shadow-sm w-full max-w-full overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Taxas Transações Online
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-w-full overflow-x-hidden">
              <div className="overflow-y-hidden overflow-x-auto">
                <Table className="text-xs min-w-[1000px] w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="sticky left-0 z-20 bg-white w-20"
                        style={{ width: "2%", minWidth: "30px" }}
                      >
                        Bandeiras
                      </TableHead>
                      {SolicitationFeeProductTypeList.map((type, index) => (
                        <TableHead
                          key={`${type.value}-nonCardTransactionFee-${index}`}
                          className="text-center"
                          style={{ width: "3%", minWidth: "30px" }}
                        >
                          {type.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feesData.map((item) => (
                      <TableRow key={item.brand.value}>
                        <TableCell
                          className="font-medium sticky left-0 z-20 bg-white"
                          style={{ minWidth: "30px" }}
                        >
                          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                            {getCardImage(item.brand.value) && (
                              <img
                                src={getCardImage(item.brand.value)}
                                alt={item.brand.label}
                                width={40}
                                height={24}
                                className="object-contain w-8 h-5 sm:w-10 sm:h-6 flex-shrink-0"
                              />
                            )}
                            <span className="truncate">{item.brand.label}</span>
                          </div>
                        </TableCell>
                        {item.onlineTypes.map((productType, typeIndex) => (
                          <TableCell
                            key={`${item.brand.value}-${productType.value}-nonCardTransactionFee-${typeIndex}`}
                            className="p-1 text-center"
                          >
                            <div className="rounded-full py-1 px-2 inline-block min-w-[50px] max-w-[70px] text-center bg-blue-100 text-xs sm:text-sm">
                              {productType.nonCardTransactionFee !==
                                undefined &&
                              productType.nonCardTransactionFee !== null &&
                              productType.nonCardTransactionFee !== "-"
                                ? `${productType.nonCardTransactionFee}%`
                                : "-"}
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardContent>
              <h4 className="font-medium mb-2 text-sm">PIX Online</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-1 w-full max-w-full mt-4">
                <div>
                  <h4 className="font-medium mb-1 text-sm">MDR Sem Cartão</h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {nonCardPixMdr ? `${nonCardPixMdr}%` : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Custo Mínimo Sem Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {nonCardPixMinimumCostFee
                        ? `R$ ${nonCardPixMinimumCostFee}`
                        : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Custo Máximo Sem Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {nonCardPixCeilingFee
                        ? `R$ ${nonCardPixCeilingFee}`
                        : "-"}
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-1 text-sm">
                    Antecipação Sem Cartão
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <div className="rounded-full h-7 min-w-14 max-w-18 flex justify-center items-center text-xs bg-blue-100 px-1">
                      {nonCardEventualAnticipationFee
                        ? `${nonCardEventualAnticipationFee}%`
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Form>
    </div>
  );
}
