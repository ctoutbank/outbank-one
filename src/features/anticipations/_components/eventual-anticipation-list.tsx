"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createSortHandler,
  formatCNPJ,
  formatCurrency,
  formatDate,
} from "@/lib/utils";
import { Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { EventualAnticipationList } from "../server/anticipation";

export default function EventualAnticipationListComponent({
  anticipations,
}: {
  anticipations: EventualAnticipationList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Função para lidar com ordenação usando utilitário
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/anticipations"
  );

  const getStatusBadgeVariant = (status: string | null) => {
    if (!status) return "secondary";

    if (status.includes("Liquidado")) {
      return "success";
    } else if (status.includes("Parcialmente Liquidadas")) {
      return "pending";
    } else if (status.includes("Parcialmente Antecipadas")) {
      return "destructive";
    } else if (status.includes("Canceladas")) {
      return "outline";
    } else if (status.includes("Previstas")) {
      return "default";
    }
    return "secondary";
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="dtinsert"
                name="Data de Solicitação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="type"
                name="Tipo"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="expectedSettlementDate"
                name="Previsão de Liquidação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="merchantName"
                name="Estabelecimento"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="totalExpectedAmount"
                name="Total Previsto a Receber"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="totalBlockedAmount"
                name="Total Bloqueado"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="totalAvailableAmount"
                name="Total Disponível"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="requestedAmount"
                name="Valor Solicitado"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="status"
                name="Status"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="actions"
                name="Ações"
                sortable={false}
                onSort={handleSort}
                searchParams={searchParams}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {anticipations.anticipations.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(item.dtinsert)}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{formatDate(item.expectedSettlementDate)}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium">
                      {item.merchantName?.toUpperCase()}
                    </span>
                    <br />
                    <span className="text-[10px] text-muted-foreground">
                      {formatCNPJ(item.merchantCnpj)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {formatCurrency(item.totalExpectedAmount)}
                </TableCell>
                <TableCell>{formatCurrency(item.totalBlockedAmount)}</TableCell>
                <TableCell>
                  {formatCurrency(item.totalAvailableAmount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {formatCurrency(item.requestedAmount)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-10 w-10 hover:bg-slate-100 transition-colors"
                          aria-label="Ver detalhes da transação"
                        >
                          <Info className="h-5 w-5 text-slate-700" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md p-0 overflow-hidden rounded-lg">
                        <DialogHeader className="bg-slate-50 p-4 border-b">
                          <DialogTitle className="text-lg font-medium">
                            Detalhe do valor solicitado
                          </DialogTitle>
                        </DialogHeader>

                        <div className="p-5">
                          <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div className="text-slate-500 font-medium">EC</div>
                            <div>{item.merchantName}</div>

                            <div className="text-slate-500 font-medium"></div>
                            <div className="text-slate-600 text-xs">
                              {formatCNPJ(item.merchantCnpj)}
                            </div>

                            <div className="text-slate-500 font-medium">
                              ISO
                            </div>
                            <div>{"Banco Prisma (Outbank)"}</div>

                            <div className="text-slate-500 font-medium">
                              MCC
                            </div>
                            <div>{item.mcc}</div>

                            <div className="text-slate-500 font-medium">
                              Ticket Médio
                            </div>
                            <div>{formatCurrency(76.82)}</div>

                            <div className="text-slate-500 font-medium">
                              Transações Antecipadas
                            </div>
                            <div>
                              {item.anticipationRiskFactorCp +
                                item.anticipationRiskFactorCnp}
                            </div>

                            <div className="text-slate-500 font-medium pl-5">
                              Cartão presente
                            </div>
                            <div>{item.anticipationRiskFactorCp}</div>

                            <div className="text-slate-500 font-medium pl-5">
                              Cartão não presente
                            </div>
                            <div>{item.anticipationRiskFactorCnp}</div>
                          </div>
                        </div>

                        <div className="p-4 flex justify-end border-t bg-slate-50">
                          <DialogClose asChild>
                            <Button
                              variant="default"
                              className="bg-slate-900 hover:bg-slate-800"
                            >
                              Fechar
                            </Button>
                          </DialogClose>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">Liquidado</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
