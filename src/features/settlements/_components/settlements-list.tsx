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
import { FormatCurrency, FormatDate } from "@/lib/utils";
import { MerchantSettlementList } from "../server/settlements";
import VoucherDownload from "./exportfile";

export default function MerchantSettlementsList({
  merchantSettlementList,
}: {
  merchantSettlementList: MerchantSettlementList;
}) {
  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500  hover:bg-yellow-600";
      case "PROCESSING":
        return "bg-yellow-500 hover:bg-yellow-400";
      case "REQUESTED":
        return "bg-yellow-300 text-black hover:bg-yellow-400";
      case "FAILED":
        return "bg-red-500  hover:bg-red-600";
      case "SETTLED":
        return "bg-green-500  hover:bg-green-600";
      case "PAID":
        return "bg-green-500  hover:bg-green-600";
      case "PRE_APPROVED":
        return "bg-blue-400  hover:bg-blue-500";
      case "APPROVED":
        return "bg-blue-700  hover:bg-blue-800";
      default:
        return "bg-gray-400 hover:bg-gray-500";
    }
  }

  return (
    <div className="w-full">
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
              <AccordionItem value={"1"} className="border-0">
                <AccordionTrigger className="hover:no-underline w-full [&[data-state=open]>div>table>tbody>tr]:bg-gray-100/50">
                  <TableRow className="hover:bg-gray-100/50 w-full">
                    <TableCell className="font-medium w-[250px]">
                      {settlement.merchant}
                    </TableCell>
                    <TableCell className="w-[250px]">
                      {FormatCurrency(Number(settlement.batchamount))}
                    </TableCell>
                    <TableCell className="w-[250px]">
                      {FormatCurrency(
                        Number(settlement.totalanticipationamount)
                      )}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      {FormatCurrency(
                        Number(settlement.pendingfinancialadjustmentamount)
                      )}
                    </TableCell>
                    <TableCell className="w-[250px]">
                      {FormatCurrency(
                        Number(settlement.pendingrestitutionamount)
                      )}
                    </TableCell>
                    <TableCell className="w-[150px]">
                      {FormatCurrency(Number(settlement.totalsettlementamount))}
                    </TableCell>
                    <TableCell className="ml-10 w-[100px]">
                      <Badge
                        className={
                          getStatusColor(settlement.status) + " text-white"
                        }
                      >
                        {settlement.status}
                      </Badge>
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
                            {order.receivableUnit + " " + order.productType}
                          </TableCell>
                          <TableCell>{}</TableCell>
                          <TableCell>{order.agency}</TableCell>
                          <TableCell>{order.accountNumber}</TableCell>
                          <TableCell>{order.accountType}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2">
                              <div className="w-1/2 text-left">
                                {FormatCurrency(order.amount)}{" "}
                              </div>

                              <VoucherDownload
                                vouncherDownloadProps={{
                                  date: new Date(order.effectivePaymentDate),
                                  value: order.amount,
                                  description:
                                    order.receivableUnit +
                                    " " +
                                    order.productType,
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
                            {FormatDate(new Date(order.effectivePaymentDate))}
                          </TableCell>
                          <TableCell>{order.settlementUniqueNumber}</TableCell>
                          <TableCell className="text-center">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
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
    </div>
  );
}
