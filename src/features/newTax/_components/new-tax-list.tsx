"use client";

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
  FeeData,
  feeBrandProductType,
} from "@/features/newTax/server/fee-db";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface FeeListProps {
  fees: FeeData[];
}

export default function FeeList({ fees }: FeeListProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

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

  const handleEdit = (feeId: string) => {
    router.push(`/portal/pricing/${feeId}`);
  };

  const handleAddNew = () => {
    router.push("/portal/pricing/0");
  };

  if (!isMounted) {
    return null;
  }

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
                        <span className="font-medium">
                          {fee.id}: {fee.name}
                        </span>
                        <span className="ml-2">- {fee.anticipationType}</span>
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
                    <NewTaxPixSession data={fee} />
                    <div className="mt-1">
                      <div className="rounded-lg bg-white shadow-sm border border-gray-300">
                        {fee.feeBrand.length > 0 ? (
                          fee.feeBrand.map((brand: FeeBrand, index: number) => (
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

                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead className="w-[15%] font-medium text-black">
                                        Modo
                                      </TableHead>
                                      <TableHead
                                        colSpan={3}
                                        className="text-center font-medium text-black"
                                      >
                                        Cartão Presente
                                      </TableHead>
                                      <TableHead
                                        colSpan={3}
                                        className="text-center font-medium text-black"
                                      >
                                        Cartão Não Presente
                                      </TableHead>
                                    </TableRow>
                                    <TableRow>
                                      <TableHead className="w-[15%]"></TableHead>
                                      <TableHead
                                        colSpan={2}
                                        className="text-center font-medium text-black"
                                      >
                                        Composição da Taxa de Intermediação
                                      </TableHead>
                                      <TableHead className="text-center font-medium text-black">
                                        Taxa de Intermediação (%)
                                      </TableHead>
                                      <TableHead
                                        colSpan={2}
                                        className="text-center font-medium text-black"
                                      >
                                        Composição da Taxa de Intermediação
                                      </TableHead>
                                      <TableHead className="text-center font-medium text-black">
                                        Taxa de Intermediação (%)
                                      </TableHead>
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
                                            {product.cardTransactionFee}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {product.cardTransactionMdr}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {product.cardTransactionMdr}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {product.nonCardTransactionFee}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {product.nonCardTransactionMdr}
                                          </TableCell>
                                          <TableCell className="text-center">
                                            {product.nonCardTransactionMdr}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </div>
                            </div>
                          ))
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
