"use client";

import { Download } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GlobalSettlementResult } from "../server/merchantAgenda";

interface DailyViewProps {
  dailyData: GlobalSettlementResult;
}

export function DailyView({ dailyData }: DailyViewProps) {
  return (
    <Accordion type="multiple" className="space-y-4">
      {dailyData.merchants.map((dailyData) => (
        <AccordionItem
          key={dailyData.merchant}
          value={dailyData.merchant}
          className="border rounded-lg px-4"
        >
          <AccordionTrigger className="py-4 hover:no-underline">
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{dailyData.merchant}</span>
              <div className="flex items-center gap-4">
                <span className="text-primary font-medium">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(dailyData.total)}
                </span>
                <Download className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-full flex items-center">
                    <div className="text-left w-1/4">Modo</div>
                    <div className="text-right w-1/3">Valor Total Bruto</div>
                    <div className="text-right w-1/3">Valor Total Líquido</div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyData.producttype.map((productType, index) => (
                  <AccordionItem
                    key={index}
                    value={index.toString()}
                    className="border-b-0"
                  >
                    <TableRow>
                      <TableCell className="w-full flex items-center gap-4">
                        <AccordionTrigger className="text-left w-1/4 py-4 hover:no-underline">
                          {productType.name}
                        </AccordionTrigger>

                        <div className="text-right w-1/3">
                          {" "}
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(productType.totalGross)}
                        </div>
                        <div className="text-right w-1/3">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(productType.totalSettlement)}
                        </div>
                      </TableCell>
                    </TableRow>
                    <AccordionContent>
                      <div className="pl-8 pb-4">
                        <Table>
                          <TableBody>
                            {productType.brand.map((brand, brandIndex) => (
                              <TableRow key={brandIndex}>
                                <TableCell>{brand.name}</TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(brand.totalGross)}
                                </TableCell>
                                <TableCell className="text-right">
                                  {new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(brand.totalSettlement)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
