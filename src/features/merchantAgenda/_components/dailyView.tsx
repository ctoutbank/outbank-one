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
  console.log(dailyData);
  return (
    <>
      {dailyData.merchants && (
        <>
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
                  <div className="min-w-[1040px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-semibold w-[20%] text-left text-black">
                            Modo
                          </TableHead>
                          <TableHead className="font-semibold w-[40%] text-right text-black">
                            Valor Total Bruto
                          </TableHead>
                          <TableHead className="font-semibold w-[40%] text-right text-black">
                            Valor Total Líquido
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dailyData.producttype.map((productType, index) => (
                          <tr key={index} className="w-full">
                            <td colSpan={3} className="p-0 border-0">
                              <AccordionItem
                                key={index}
                                value={index.toString()}
                                className="border-b-0"
                              >
                                <TableRow>
                                  <TableCell className="w-[20%] text-muted-foreground">
                                    {" "}
                                    <AccordionTrigger className="text-left w-1/4 py-4 hover:no-underline">
                                      {productType.name}
                                    </AccordionTrigger>
                                  </TableCell>
                                  <TableCell className="w-[40%] text-right text-muted-foreground">
                                    {" "}
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(productType.totalGross)}
                                  </TableCell>
                                  <TableCell className="w-[40%] text-right text-muted-foreground">
                                    {" "}
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(productType.totalSettlement)}
                                  </TableCell>
                                  <TableCell className="w-full flex items-center gap-4"></TableCell>
                                </TableRow>

                                <AccordionContent>
                                  <div className="pr-4">
                                    <Table>
                                      <TableBody>
                                        {productType.brand.map(
                                          (brand, brandIndex) => (
                                            <TableRow key={brandIndex}>
                                              <TableCell
                                                className="text-sm text-muted-foreground"
                                                style={{ width: "20%" }}
                                              >
                                                {brand.name}
                                              </TableCell>
                                              <TableCell
                                                className="text-sm text-right text-muted-foreground"
                                                style={{ width: "40%" }}
                                              >
                                                {new Intl.NumberFormat(
                                                  "pt-BR",
                                                  {
                                                    style: "currency",
                                                    currency: "BRL",
                                                  }
                                                ).format(brand.totalGross)}
                                              </TableCell>
                                              <TableCell
                                                className="text-sm text-right text-muted-foreground"
                                                style={{ width: "40%" }}
                                              >
                                                {new Intl.NumberFormat(
                                                  "pt-BR",
                                                  {
                                                    style: "currency",
                                                    currency: "BRL",
                                                  }
                                                ).format(brand.totalSettlement)}
                                              </TableCell>
                                            </TableRow>
                                          )
                                        )}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </td>
                          </tr>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
    </>
  );
}
