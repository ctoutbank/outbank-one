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
import type { FeeData } from "@/features/newTax/data/mock-fee-data";
import { mockFeeData } from "@/features/newTax/data/mock-fee-data";
import { Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function FeeList() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [feeData, setFeeData] = useState<FeeData[]>(mockFeeData);

  useEffect(() => {
    setIsMounted(true);

    // Verificar se há dados salvos no localStorage
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("feeData");
      if (savedData) {
        setFeeData(JSON.parse(savedData));
      }
    }
  }, []);

  const handleEdit = (feeId: string) => {
    router.push(`/portal/newTax/${feeId}`);
  };

  const handleAddNew = () => {
    router.push("/portal/newTax/0");
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

      <ScrollArea className="w-full rounded-md border">
        <div className="min-w-[1040px]">
          <Accordion type="single" collapsible>
            {feeData.map((fee) => (
              <AccordionItem key={fee.id} value={fee.id}>
                <AccordionTrigger className="px-4 py-3 hover:no-underline border-b border-gray-200">
                  <div className="flex w-full items-center">
                    <div className="flex-1 text-left">
                      <span className="font-medium">
                        {fee.code}: {fee.description}
                      </span>
                      <span className="ml-2">- {fee.type}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-muted-foreground">
                        {fee.count}
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
                  <div className="pl-6 pr-4 pb-1 pt-4">
                    <div className="rounded-lg bg-white shadow-sm border border-gray-300">
                      {fee.feeDetails.length > 0 ? (
                        fee.feeDetails.map((bandeira, index) => (
                          <div key={index} className="mb-6">
                            <div className="px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center gap-2 mb-2">
                                {bandeira.bandeiraImage && (
                                  <img
                                    src={
                                      bandeira.bandeiraImage ||
                                      "/placeholder.svg"
                                    }
                                    alt={bandeira.bandeira}
                                    width={40}
                                    height={24}
                                    className="object-contain"
                                  />
                                )}
                                <span className="font-semibold">
                                  Bandeiras: {bandeira.bandeira}
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
                                  {bandeira.modos.map((modo, modoIndex) => (
                                    <TableRow key={modoIndex}>
                                      <TableCell className="font-medium">
                                        {modo.modo}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {
                                          modo.cartaoPresente.composicao
                                            .transacao
                                        }
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {
                                          modo.cartaoPresente.composicao
                                            .antecipacao
                                        }
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {modo.cartaoPresente.taxaIntermediacao}
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {
                                          modo.cartaoNaoPresente.composicao
                                            .transacao
                                        }
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {
                                          modo.cartaoNaoPresente.composicao
                                            .antecipacao
                                        }
                                      </TableCell>
                                      <TableCell className="text-center">
                                        {
                                          modo.cartaoNaoPresente
                                            .taxaIntermediacao
                                        }
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-muted-foreground">
                          Nenhuma informação de taxa disponível para este item.
                        </div>
                      )}

                      {fee.id === "1" && (
                        <div className="px-4 py-3 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <h3 className="font-semibold mb-2">PIX</h3>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      MDR (%)
                                    </TableCell>
                                    <TableCell className="text-right">
                                      0,01 %
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo mínimo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,72
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo máximo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,72
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">
                                Cartão Presente
                              </h3>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      MDR (%)
                                    </TableCell>
                                    <TableCell className="text-right">
                                      0,01 %
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo mínimo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,72
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo máximo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,72
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                            <div>
                              <h3 className="font-semibold mb-2">
                                Cartão Não Presente
                              </h3>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      MDR (%)
                                    </TableCell>
                                    <TableCell className="text-right">
                                      0,01 %
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo mínimo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,96
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="font-medium">
                                      Custo máximo
                                    </TableCell>
                                    <TableCell className="text-right">
                                      R$ 0,96
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground">
                              Dias úteis para antecipar (d+): 1
                            </p>
                          </div>
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
    </div>
  );
}
