"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createSortHandler,
  formatCurrency,
  formatDate,
  getStatusColor,
  translateCardType,
  translateStatus,
} from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MerchantSettlementList } from "../server/settlements";
import VoucherDownload from "./exportfile";

const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
  };
  return cardMap[cardName] || "";
};

export default function MerchantSettlementsList({
  merchantSettlementList,
}: {
  merchantSettlementList: MerchantSettlementList;
}) {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/settlements"
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ScrollArea className="w-full rounded-md border">
      <div className="min-w-[1040px]">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="merchant"
                name="Estabelecimento"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[20%] min-w-[180px] text-black"
              />
              <SortableTableHead
                columnId="batchamount"
                name="Valor Líquido Recebíveis"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[15%] min-w-[140px] text-center text-black"
              />
              <SortableTableHead
                columnId="totalanticipationamount"
                name="Valor Líquido Antecipação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[15%] min-w-[140px] text-center text-black"
              />
              <SortableTableHead
                columnId="pendingfinancialadjustmentamount"
                name="Valor de Ajuste"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[12%] min-w-[120px] text-center text-black"
              />
              <SortableTableHead
                columnId="pendingrestitutionamount"
                name="Valor Pendente"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[15%] min-w-[140px] text-center text-black"
              />
              <SortableTableHead
                columnId="totalsettlementamount"
                name="Valor Total de Liquidação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[15%] min-w-[140px] text-center text-black"
              />
              <SortableTableHead
                columnId="status"
                name="Status"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-semibold w-[8%] min-w-[100px] text-center text-black"
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {merchantSettlementList.merchant_settlements.map((settlement) => (
              <tr key={settlement.id} className="w-full">
                <td colSpan={7} className="p-0 border-0">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={settlement.id.toString()}
                      className="border-0"
                    >
                      <AccordionTrigger className="hover:no-underline w-full py-1 border-b border-gray-200">
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="w-[20%] min-w-[180px] text-muted-foreground">
                                {settlement.merchant.toUpperCase()}
                              </TableCell>
                              <TableCell className="w-[15%] min-w-[140px] text-center text-muted-foreground">
                                {formatCurrency(Number(settlement.batchamount))}
                              </TableCell>
                              <TableCell className="w-[15%] min-w-[140px] text-center text-muted-foreground">
                                {formatCurrency(
                                  Number(settlement.totalanticipationamount)
                                )}
                              </TableCell>
                              <TableCell className="w-[12%] min-w-[120px] text-center text-muted-foreground">
                                {formatCurrency(
                                  Number(
                                    "-" +
                                      settlement.pendingfinancialadjustmentamount
                                  )
                                )}
                              </TableCell>
                              <TableCell className="w-[15%] min-w-[140px] text-center text-muted-foreground">
                                {formatCurrency(
                                  Number(settlement.pendingrestitutionamount)
                                )}
                              </TableCell>
                              <TableCell className="w-[15%] min-w-[140px] text-center text-muted-foreground">
                                {formatCurrency(
                                  Number(settlement.totalsettlementamount)
                                )}
                              </TableCell>
                              <TableCell className="w-[8%] min-w-[100px] text-right text-muted-foreground">
                                <Badge
                                  className={
                                    getStatusColor(settlement.status) +
                                    " text-white"
                                  }
                                >
                                  {translateStatus(settlement.status)}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </AccordionTrigger>

                      <AccordionContent className="border-t bg-sidebar border-b-2 border-gray-200">
                        <div className="pl-6 pr-4 pb-1 pt-4">
                          <div className="rounded-lg bg-white shadow-sm border border-gray-300">
                            <div className="px-4 py-3">
                              <Table>
                                <TableHeader>
                                  <TableRow className="hover:bg-transparent">
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "15%" }}
                                    >
                                      Unidade de Recebível
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "10%" }}
                                    >
                                      Banco
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "10%" }}
                                    >
                                      Agência
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "12%" }}
                                    >
                                      Número da Conta
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "10%" }}
                                    >
                                      Tipo de Conta
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "13%" }}
                                    >
                                      Valor
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "15%" }}
                                    >
                                      Data Efetiva do Pagamento
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{ width: "10%" }}
                                    >
                                      Número do Pagamento
                                    </TableHead>
                                    <TableHead
                                      className="font-medium hover:bg-transparent text-sm text-black"
                                      style={{
                                        width: "5%",
                                        textAlign: "center",
                                      }}
                                    >
                                      Status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {settlement.orders?.map((order, index) => (
                                    <TableRow
                                      key={index}
                                      className="hover:bg-transparent"
                                    >
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "15%" }}
                                      >
                                        <div className="flex items-center gap-2">
                                          {getCardImage(
                                            order.receivableUnit
                                          ) && (
                                            <img
                                              src={getCardImage(
                                                order.receivableUnit
                                              )}
                                              alt={order.receivableUnit}
                                              width={40}
                                              height={24}
                                              className="object-contain"
                                            />
                                          )}
                                          <span>
                                            {translateCardType(
                                              order.producttype
                                            )}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "10%" }}
                                      >
                                        {order.bank}
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "10%" }}
                                      >
                                        {order.agency}
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "12%" }}
                                      >
                                        {order.accountnumber}
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "10%" }}
                                      >
                                        {order.accounttype}
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "13%" }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <div className="w-1/2 text-left">
                                            {formatCurrency(order.amount)}{" "}
                                          </div>
                                          <VoucherDownload
                                            vouncherDownloadProps={{
                                              date: new Date(
                                                order.effectivepaymentdate
                                              ),
                                              value: order.amount,
                                              description:
                                                order.receivableUnit +
                                                " " +
                                                translateCardType(
                                                  order.producttype
                                                ),
                                              singleSettlementNumber:
                                                order.settlementuniquenumber,
                                              corporateName:
                                                order.corporatename,
                                              cnpj: order.documentid,
                                              bank: "",
                                              bankBranchNumber: order.agency,
                                              accountNumber:
                                                order.accountnumber,
                                            }}
                                          />
                                        </div>
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "15%" }}
                                      >
                                        {formatDate(
                                          new Date(order.effectivepaymentdate)
                                        )}
                                      </TableCell>
                                      <TableCell
                                        className="text-sm text-muted-foreground"
                                        style={{ width: "10%" }}
                                      >
                                        {order.settlementuniquenumber}
                                      </TableCell>
                                      <TableCell
                                        style={{
                                          width: "5%",
                                          textAlign: "center",
                                        }}
                                      >
                                        <Badge
                                          className={getStatusColor(
                                            order.status
                                          )}
                                        >
                                          {translateStatus(order.status)}
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </td>
              </tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScrollArea>
  );
}
