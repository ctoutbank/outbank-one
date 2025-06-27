"use client";

import ExcelExport from "@/components/excelExport";
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
import { formatDate, formatDateTime } from "@/lib/utils";
import { Fill, Font } from "exceljs";
import {
  ExcelDailyData,
  GlobalSettlementResult,
} from "../server/merchantAgenda";

interface DailyViewProps {
  dailyData: GlobalSettlementResult;
  exportExcelDailyData: ExcelDailyData[];
}

export function DailyView({ dailyData, exportExcelDailyData }: DailyViewProps) {
  console.log(exportExcelDailyData);
  const globalStyles = {
    header: {
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "808080" },
      } as Fill,
      font: { color: { argb: "FFFFFF" }, bold: true } as Font,
    },
    row: {
      font: { color: { argb: "000000" } } as Font,
    },
  };

  const getExcelExport = (slugMerchant: string) => {
    const filteredData = exportExcelDailyData.filter(
      (excel) => excel.slugMerchant == slugMerchant
    );

    return (
      <ExcelExport
        data={filteredData.map((excel) => ({
          Estabelecimento: excel.merchant,
          "CNPJ/CPF": excel.cnpj,
          "NSU/ID": excel.nsu,
          "Data da Venda": formatDateTime(new Date(excel.saleDate), false),
          Tipo: excel.type,
          Bandeira: excel.brand,
          Parcela: excel.installmentNumber,
          "Número de Parcelas": excel.installments,
          "Valor Bruto da Parcela": excel.installmentValue,
          "Taxa (%)": excel.transactionMdr,
          "Taxa (R$)": excel.transactionMdrFee,
          "Valor Fixo": excel.transactionFee,
          "Valor Líquido da Parcela": excel.settlementAmount,
          "Data Prevista de Liquidação": formatDate(
            new Date(excel.expectedDate)
          ),
          "Valor Liquidado na Data": excel.receivableAmount,
          "Data de Liquidação": excel.settlementDate
            ? formatDate(new Date(excel.settlementDate))
            : "",
        }))}
        sheetName="Conciliação de recebíveis"
        fileName={`CONCILIAÇÃO_DE_RECEBIMENTOS_${
          new Date().toISOString().split("T")[0]
        }.xlsx`}
        globalStyles={globalStyles}
        onlyIcon={true}
        hasDateFilter={true}
      />
    );
  };

  return (
    <>
      {dailyData.merchants && dailyData.merchants.length > 0 && (
        <>
          <Accordion type="multiple" className="space-y-4">
            {dailyData.merchants?.map((merchant) => (
              <AccordionItem
                key={merchant.merchant}
                value={merchant.merchant}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="py-4 hover:no-underline">
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">
                      {merchant.merchant.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-4">
                      <span
                        className={`font-medium ${
                          ["SETTLED", "FULLY_ANTICIPATED"].includes(
                            merchant.status
                          )
                            ? "text-[#177a3c]"
                            : merchant.status === "PROVISIONED"
                            ? "text-[#bf8419]"
                            : "text-[#177a3c]"
                        }`}
                      >
                        {new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(merchant.total)}
                      </span>
                      {getExcelExport(merchant.slug_merchant)}
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
                        {merchant.product_types?.map((productType, index) => (
                          <tr key={index} className="w-full">
                            <td colSpan={3} className="p-0 border-0">
                              <AccordionItem
                                key={index}
                                value={index.toString()}
                                className="border-b-0"
                              >
                                <TableRow>
                                  <TableCell
                                    className="text-muted-foreground"
                                    style={{ width: "312px" }}
                                  >
                                    <AccordionTrigger className="text-left w-1/4 py-4 hover:no-underline">
                                      {productType.name}
                                    </AccordionTrigger>
                                  </TableCell>
                                  <TableCell
                                    className="text-right text-muted-foreground"
                                    style={{ width: "40%" }}
                                  >
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(productType.totalGross)}
                                  </TableCell>
                                  <TableCell
                                    className="text-right text-muted-foreground"
                                    style={{ width: "40%" }}
                                  >
                                    {new Intl.NumberFormat("pt-BR", {
                                      style: "currency",
                                      currency: "BRL",
                                    }).format(productType.totalSettlement)}
                                  </TableCell>
                                </TableRow>
                                <AccordionContent>
                                  <div className="pr-4">
                                    <Table>
                                      <TableBody>
                                        {productType.brand?.map(
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
