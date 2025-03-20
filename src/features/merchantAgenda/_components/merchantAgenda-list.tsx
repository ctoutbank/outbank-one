"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MerchantAgendaList } from "../server/merchantAgenda";

interface MerchantAgendaListProps {
  merchantAgendaList: MerchantAgendaList | null;
}

export default function MerchantAgendaList({
  merchantAgendaList,
  
}: MerchantAgendaListProps) {

  

    

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  return (
    <div className="border rounded-lg">
      <Table className="w-[200%] h-[50%] overflow-x-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="text-black">Estabelecimento</TableHead>
            <TableHead className="text-black" >Terminal</TableHead>
            <TableHead className="text-black">NSU / ID</TableHead>
            <TableHead className="text-black">Data da Venda</TableHead>
            <TableHead className="text-black">Tipo</TableHead>
            <TableHead className="text-black">Bandeira</TableHead>
            <TableHead className="text-black">Parcela</TableHead>
            <TableHead className="text-black">R$ Bruto Parcela</TableHead>
            <TableHead className="text-black">Taxa (%)</TableHead>
            <TableHead className="text-black">Taxa (R$) </TableHead>
            <TableHead className="text-black">R$ Líquido Parcela</TableHead>
            <TableHead className="text-black">Data Prevista de Liquidação </TableHead>
            <TableHead className="text-black">R$ Total Liquidação </TableHead>
            <TableHead className="text-black">Data de Liquidação</TableHead>
            <TableHead className="text-black">Data Efetiva do Pagamento</TableHead>
            <TableHead className="text-black">Nº Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchantAgendaList?.merchantAgenda.map((merchantAgenda, index) => (
            <TableRow key={index}>
              <TableCell className="text-muted-foreground ">{merchantAgenda.merchant}</TableCell>
              <TableCell className="text-muted-foreground">{"-"}</TableCell>
              <TableCell className="text-muted-foreground">{merchantAgenda.rnn}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(merchantAgenda.saleDate.toString())}
              </TableCell>
              <TableCell className="text-muted-foreground">{merchantAgenda.type}</TableCell>
              <TableCell className="text-muted-foreground">{merchantAgenda.brand}</TableCell>
              <TableCell className="text-muted-foreground">
                {merchantAgenda.installmentNumber +
                  "/" +
                  merchantAgenda.installments}{" "}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatCurrency(merchantAgenda.grossAmount)}
              </TableCell>
              <TableCell className="text-muted-foreground">{merchantAgenda.feePercentage.toFixed(2)}%</TableCell>
              <TableCell className="text-muted-foreground">{formatCurrency(merchantAgenda.feeAmount)}</TableCell>
              <TableCell className="text-muted-foreground">{formatCurrency(merchantAgenda.netAmount)}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(merchantAgenda.expectedSettlementDate.toString())}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatCurrency(merchantAgenda.settledAmount)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(merchantAgenda.settlementDate.toString())}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(merchantAgenda.effectivePaymentDate.toString())}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {merchantAgenda.paymentNumber}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
