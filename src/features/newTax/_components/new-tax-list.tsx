"use client";

import { PercentageInput } from "@/components/percentage-input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NewTaxPixSession } from "@/features/newTax/_components/new-tax-pixsession";
import {
  FeeBrand,
  FeeCredit,
  FeeData,
  feeBrandProductType,
  getFeeCreditsByFeeBrandProductTypeIds,
} from "@/features/newTax/server/fee-db";
import { FeeType } from "@/lib/lookuptables/lookuptables";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FeeListProps {
  fees: FeeData[];
}

export default function FeeList({ fees }: FeeListProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [feeCreditsMap, setFeeCreditsMap] = useState<Record<number, FeeCredit>>(
    {}
  );
  console.log(fees);

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
  // Usar useEffect para o isMounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchCredits() {
      // Coletar todos os ids de feeBrandProductType das taxas do tipo COMPULSORY
      const ids: number[] = [];
      for (const fee of fees) {
        if (fee.anticipationType === "COMPULSORY") {
          for (const brand of fee.feeBrand) {
            for (const pt of brand.feeBrandProductType) {
              ids.push(pt.id);
            }
          }
        }
      }
      if (ids.length) {
        const credits = await getFeeCreditsByFeeBrandProductTypeIds(ids);
        // Mapear por idFeeBrandProductType para acesso rápido
        const map: Record<number, FeeCredit> = {};
        for (const c of credits) map[c.idFeeBrandProductType] = c;
        setFeeCreditsMap(map);
      }
    }
    fetchCredits();
  }, [fees]);

  const handleEdit = (feeId: string) => {
    router.push(`/portal/pricing/${feeId}`);
  };

  const handleAddNew = () => {
    router.push("/portal/pricing/0");
  };

  if (!isMounted) {
    return null;
  }

  const getAnticipationTypeLabel = (anticipationType: string) => {
    return FeeType.find((type) => type.value === anticipationType)?.label;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={handleAddNew}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Nova Taxa
        </Button>
      </div>

      {fees.length === 0 ? (
        <div className="text-center p-8 border rounded-md text-muted-foreground">
          Nenhuma taxa cadastrada. Clique em &quot;Adicionar Nova Taxa&quot;
          para criar.
        </div>
      ) : (
        <ScrollArea className="w-full rounded-md border">
          <div className="min-w-[1040px]">
            <Accordion type="single" collapsible>
              {fees.map((fee) => (
                <AccordionItem key={fee.id} value={fee.id}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline border-b border-gray-200">
                    <div className="flex w-full items-center">
                      <div className="flex-1 text-left">
                        <span className="font-medium">{fee.code}:</span>
                        <span className="ml-2">
                          {fee.name} -{" "}
                          {getAnticipationTypeLabel(fee.anticipationType)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {fee.feeBrand.length}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(fee.id);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="border-t bg-sidebar border-b-2 border-gray-200">
                    {fee.anticipationType === "COMPULSORY" && (
                      <div className="mb-4 p-4 grid grid-cols-2 gap-4 bg-orange-50 rounded border border-orange-200 text-sm">
                        <div>
                          <span className="font-semibold">
                            Pedido de Antecipação:
                          </span>{" "}
                          Compulsória
                        </div>
                        <div>
                          <span className="font-semibold">
                            Dias úteis para antecipar (d+):
                          </span>{" "}
                          {fee.compulsoryAnticipationConfig}
                        </div>
                      </div>
                    )}
                    <NewTaxPixSession data={fee} readOnly={true} />
                    <div className="mt-1">
                      <div className="rounded-lg bg-white shadow-sm border border-gray-300">
                        {fee.feeBrand.length > 0 ? (
                          fee.feeBrand.map((brand: FeeBrand, index: number) => {
                            const isNoAnticipation =
                              fee.anticipationType === "NOANTECIPATION";
                            const isEventualAnticipation =
                              fee.anticipationType === "EVENTUAL";
                            const isCompulsory =
                              fee.anticipationType === "COMPULSORY";
                            return (
                              <div key={index} className=" mt-2">
                                <div className="px-4 py-3 border-b border-gray-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    {getCardImage(brand.brand) && (
                                      <img
                                        src={getCardImage(brand.brand)}
                                        alt={brand.brand}
                                        width={40}
                                        height={24}
                                        className="object-contain"
                                      />
                                    )}
                                    <span className="font-semibold">
                                      Bandeiras: {brand.brand}
                                    </span>
                                  </div>

                                  {isCompulsory ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[15%] font-medium text-black">
                                            Modo
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Transação (%)
                                            <br />
                                            Cartão Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Antecipação (% a.m.)
                                            <br />
                                            Cartão Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Taxa de Intermediação
                                            <br />
                                            Cartão Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Transação (%)
                                            <br />
                                            Cartão Não Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Antecipação (% a.m.)
                                            <br />
                                            Cartão Não Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Taxa de Intermediação
                                            <br />
                                            Cartão Não Presente
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {brand.feeBrandProductType.map(
                                          (
                                            product: feeBrandProductType,
                                            productIndex: number
                                          ) => {
                                            const credit =
                                              feeCreditsMap[product.id];
                                            const cardTransactionMdr =
                                              Number(
                                                product.cardTransactionMdr
                                              ) || 0;
                                            const nonCardTransactionMdr =
                                              Number(
                                                product.nonCardTransactionMdr
                                              ) || 0;
                                            const compulsoryAnticipation =
                                              credit
                                                ? Number(
                                                    credit.compulsoryAnticipation
                                                  ) || 0
                                                : 0;
                                            const noCardCompulsoryAnticipation =
                                              credit
                                                ? Number(
                                                    credit.noCardCompulsoryAnticipation
                                                  ) || 0
                                                : 0;
                                            return (
                                              <TableRow key={productIndex}>
                                                <TableCell className="font-medium">
                                                  {product.producttype}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={cardTransactionMdr.toString()}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={compulsoryAnticipation.toString()}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={(
                                                      cardTransactionMdr +
                                                      compulsoryAnticipation
                                                    ).toFixed(2)}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={nonCardTransactionMdr.toString()}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={noCardCompulsoryAnticipation.toString()}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  <PercentageInput
                                                    value={(
                                                      nonCardTransactionMdr +
                                                      noCardCompulsoryAnticipation
                                                    ).toFixed(2)}
                                                    onChange={() => {}}
                                                    disabled={true}
                                                    className="w-16 text-center"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            );
                                          }
                                        )}
                                      </TableBody>
                                    </Table>
                                  ) : isEventualAnticipation ? (
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="w-[15%] font-medium text-black">
                                            Modo
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Transação (%) - Cartão Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Antecipação (%)
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Transação (%) - Cartão Não Presente
                                          </TableHead>
                                          <TableHead className="text-center font-medium text-black">
                                            Antecipação (%)
                                          </TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {brand.feeBrandProductType.map(
                                          (
                                            product: feeBrandProductType,
                                            productIndex: number
                                          ) => (
                                            <TableRow key={productIndex}>
                                              <TableCell className="font-medium">
                                                {product.producttype}
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <PercentageInput
                                                  value={Number(
                                                    product.cardTransactionMdr ||
                                                      0
                                                  ).toString()}
                                                  onChange={() => {}}
                                                  disabled={true}
                                                  className="w-16 text-center"
                                                />
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <PercentageInput
                                                  value={Number(
                                                    fee.eventualAnticipationFee ||
                                                      0
                                                  ).toString()}
                                                  onChange={() => {}}
                                                  disabled={true}
                                                  className="w-16 text-center"
                                                />
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <PercentageInput
                                                  value={Number(
                                                    product.nonCardTransactionMdr ||
                                                      0
                                                  ).toString()}
                                                  onChange={() => {}}
                                                  disabled={true}
                                                  className="w-16 text-center"
                                                />
                                              </TableCell>
                                              <TableCell className="text-center">
                                                <PercentageInput
                                                  value={Number(
                                                    fee.eventualAnticipationFee ||
                                                      0
                                                  ).toString()}
                                                  onChange={() => {}}
                                                  disabled={true}
                                                  className="w-16 text-center"
                                                />
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  ) : (
                                    <>
                                      <Table>
                                        <TableHeader>
                                          {isNoAnticipation ? (
                                            <TableRow>
                                              <TableHead className="w-[15%] font-medium text-black">
                                                Modo
                                              </TableHead>
                                              <TableHead className="text-center font-medium text-black">
                                                Taxa de Intermediação (%) -
                                                Cartão Presente
                                              </TableHead>
                                              <TableHead className="text-center font-medium text-black">
                                                Taxa de Intermediação (%) -
                                                Cartão Não Presente
                                              </TableHead>
                                            </TableRow>
                                          ) : (
                                            <>
                                              <TableRow>
                                                <TableHead className="w-[15%]"></TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Transação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Antecipação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black"></TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Transação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Antecipação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black"></TableHead>
                                              </TableRow>
                                              <TableRow>
                                                <TableHead className="w-[15%]"></TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Transação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Antecipação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black"></TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Transação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black">
                                                  Antecipação (%)
                                                </TableHead>
                                                <TableHead className="text-center font-medium text-black"></TableHead>
                                              </TableRow>
                                            </>
                                          )}
                                        </TableHeader>
                                        <TableBody>
                                          {isNoAnticipation ? (
                                            brand.feeBrandProductType.map(
                                              (
                                                product: feeBrandProductType,
                                                productIndex: number
                                              ) => (
                                                <TableRow key={productIndex}>
                                                  <TableCell className="font-medium">
                                                    {product.producttype}
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    <PercentageInput
                                                      value={Number(
                                                        product.cardTransactionMdr ||
                                                          0
                                                      ).toString()}
                                                      onChange={() => {}}
                                                      disabled={true}
                                                      className="w-16 text-center"
                                                    />
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    <PercentageInput
                                                      value={Number(
                                                        product.nonCardTransactionMdr ||
                                                          0
                                                      ).toString()}
                                                      onChange={() => {}}
                                                      disabled={true}
                                                      className="w-16 text-center"
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                              )
                                            )
                                          ) : (
                                            <>
                                              {brand.feeBrandProductType.map(
                                                (
                                                  product: feeBrandProductType,
                                                  productIndex: number
                                                ) => (
                                                  <TableRow key={productIndex}>
                                                    <TableCell className="font-medium">
                                                      {product.producttype}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {
                                                        product.cardTransactionFee
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {
                                                        product.cardTransactionMdr
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {product.nonCardTransactionFee +
                                                        product.cardTransactionFee}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {
                                                        product.nonCardTransactionFee
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {
                                                        product.nonCardTransactionMdr
                                                      }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                      {product.nonCardTransactionMdr +
                                                        product.cardTransactionMdr}
                                                    </TableCell>
                                                  </TableRow>
                                                )
                                              )}
                                            </>
                                          )}
                                        </TableBody>
                                      </Table>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="px-4 py-3 text-center text-muted-foreground">
                            Nenhuma taxa configurada para esta categoria
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
