"use client";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

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
            <TableHead>Estabelecimento</TableHead>
            <TableHead>Terminal</TableHead>
            <TableHead>NSU / ID</TableHead>
            <TableHead>Data da Venda</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Bandeira</TableHead>
            <TableHead>Parcela</TableHead>
            <TableHead>Valor Bruto da Parcela</TableHead>
            <TableHead>Taxa (%)</TableHead>
            <TableHead>Taxa (R$) </TableHead>
            <TableHead>Valor Líquido da Parcela</TableHead>
            <TableHead>Data Prevista de Liquidação </TableHead>
            <TableHead>Valor Total de Liquidação </TableHead>
            <TableHead>Data de Liquidação</TableHead>
            <TableHead>Data Efetiva do Pagamento</TableHead>
            <TableHead>Número do Pagamento</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchantAgendaList?.merchantAgenda.map((merchantAgenda, index) => (
            <TableRow key={index}>
              <TableCell>{merchantAgenda.merchant}</TableCell>
              <TableCell className="text-center">{"-"}</TableCell>
              <TableCell>{merchantAgenda.rnn}</TableCell>
              <TableCell>
                {formatDate(merchantAgenda.saleDate.toString())}
              </TableCell>
              <TableCell>{merchantAgenda.type}</TableCell>
              <TableCell>{merchantAgenda.brand}</TableCell>
              <TableCell>
                {merchantAgenda.installmentNumber +
                  "/" +
                  merchantAgenda.installments}{" "}
              </TableCell>
              <TableCell>
                {formatCurrency(merchantAgenda.grossAmount)}
              </TableCell>
              <TableCell>{merchantAgenda.feePercentage.toFixed(2)}%</TableCell>
              <TableCell>{formatCurrency(merchantAgenda.feeAmount)}</TableCell>
              <TableCell>{formatCurrency(merchantAgenda.netAmount)}</TableCell>
              <TableCell>
                {formatDate(merchantAgenda.expectedSettlementDate.toString())}
              </TableCell>
              <TableCell>
                {formatCurrency(merchantAgenda.settledAmount)}
              </TableCell>
              <TableCell>
                {formatDate(merchantAgenda.settlementDate.toString())}
              </TableCell>
              <TableCell>
                {formatDate(merchantAgenda.effectivePaymentDate.toString())}
              </TableCell>
              <TableCell>{merchantAgenda.paymentNumber}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
