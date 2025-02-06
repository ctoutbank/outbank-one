"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
  translateCardType,
  translateStatus,
} from "@/lib/utils";
import { MerchantSettlementList } from "../server/settlements";
import VoucherDownload from "./exportfile";
import { useEffect, useState } from "react";

export default function MerchantSettlementsList({
  merchantSettlementList,
}: {
  merchantSettlementList: MerchantSettlementList;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Avoid rendering on the server
  }
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="flex">
            <div className="w-[250px]">Estabelecimento</div>
            <div className="w-[250px]">Valor Líquido Recebíveis</div>
            <div className="w-[250px]">Valor Líquido Antecipação</div>
            <div className="w-[150px]">Valor de Ajuste</div>
            <div className="w-[250px]">Valor Pendente</div>
            <div className="w-[170px]">Valor Total de Liquidação</div>
            <div className="ml-10 w-[100px]">Status</div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {merchantSettlementList.merchant_settlements.map((settlement) => (
          <Accordion
            key={settlement.id}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={settlement.id.toString()}
              className="border-0"
            >
              <AccordionTrigger className="hover:no-underline w-full [&[data-state=open]>div>table>tbody>tr]:bg-gray-100/50">
                <TableRow className="hover:bg-gray-100/50 w-full">
                  <TableCell className="flex">
                    <div className="font-medium w-[250px]">
                      {settlement.merchant}
                    </div>

                    <div className="w-[250px]">
                      {formatCurrency(Number(settlement.batchamount))}
                    </div>
                    <div className="w-[250px]">
                      {formatCurrency(
                        Number(settlement.totalanticipationamount)
                      )}
                    </div>
                    <div className="w-[150px]">
                      {formatCurrency(
                        Number(settlement.pendingfinancialadjustmentamount)
                      )}
                    </div>
                    <div className="w-[250px]">
                      {formatCurrency(
                        Number(settlement.pendingrestitutionamount)
                      )}
                    </div>
                    <div className="w-[150px]">
                      {formatCurrency(Number(settlement.totalsettlementamount))}
                    </div>
                    <div className="ml-10 w-[100px]">
                      <Badge
                        className={
                          getStatusColor(settlement.status) + " text-white"
                        }
                      >
                        {settlement.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              </AccordionTrigger>
              <AccordionContent className="border-t">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Unidade de Recebível</TableHead>
                      <TableHead>Banco</TableHead>
                      <TableHead>Agência</TableHead>
                      <TableHead>Número da Conta</TableHead>
                      <TableHead>Tipo de Conta</TableHead>
                      <TableCell>Valor</TableCell>
                      <TableHead>Data Efetiva do Pagamento</TableHead>
                      <TableHead>Número do Pagamento</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlement.orders?.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {order.receivableUnit + " " + translateCardType(order.productType)}
                        </TableCell>
                        <TableCell>{}</TableCell>
                        <TableCell>{order.agency}</TableCell>
                        <TableCell>{order.accountNumber}</TableCell>
                        <TableCell>{order.accountType}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2">
                            <div className="w-1/2 text-left">
                              {formatCurrency(order.amount)}{" "}
                            </div>

                            <VoucherDownload
                              vouncherDownloadProps={{
                                date: new Date(order.effectivePaymentDate),
                                value: order.amount,
                                description:
                                  order.receivableUnit +
                                  " " +
                                  translateCardType(order.productType),
                                singleSettlementNumber:
                                  order.settlementUniqueNumber,
                                corporateName: order.corporateName,
                                cnpj: order.documentId,
                                bank: "",
                                bankBranchNumber: order.agency,
                                accountNumber: order.accountNumber,
                              }}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatDate(new Date(order.effectivePaymentDate))}
                        </TableCell>
                        <TableCell>{order.settlementUniqueNumber}</TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatusColor(order.status)}>
                            {translateStatus(order.status)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </TableBody>
    </Table>
    
  );
}
