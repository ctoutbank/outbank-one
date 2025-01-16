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

const mockSettlements = {
  merchant_settlements: [
    {
      id: "1",
      merchant: "Martinho Posto E Conveniencia",
      batchAmount: 18158.84,
      totalAnticipationAmount: 0,
      pendingFinancialAdjustmentAmount: 0,
      pendingRestitutionAmount: 0,
      totalSettlementAmount: 18158.84,
      status: "SETTLED",
      transactions: [
        {
          receivableUnit: "MASTERCARD Credit",
          bank: "Bco cooperativo sicredi s.a.",
          agency: "0710",
          accountNumber: "35455",
          accountType: "Checking",
          amount: 3626.4,
          effectivePaymentDate: "2025-01-16",
          paymentNumber: "202501150000561154288",
          status: "PAID",
        },
      ],
    },
    {
      id: "2",
      merchant: "AUTO POSTO GABRIELLY LTDA",
      batchAmount: 16096.23,
      totalAnticipationAmount: 0,
      pendingFinancialAdjustmentAmount: 0,
      pendingRestitutionAmount: 0,
      totalSettlementAmount: 16096.23,
      status: "SETTLED",
      transactions: [],
    },
    {
      id: "3",
      merchant: "POSTO JOIA",
      batchAmount: 9715.61,
      totalAnticipationAmount: 0,
      pendingFinancialAdjustmentAmount: 0,
      pendingRestitutionAmount: 0,
      totalSettlementAmount: 9715.61,
      status: "SETTLED",
      transactions: [],
    },
  ],
};

export default function SettlementsList() {
  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "PROCESSING":
        return "bg-yellow-300 text-black hover:bg-yellow-400";
      case "FAILED":
        return "bg-red-500 text-white hover:bg-red-600";
      case "SETTLED":
        return "bg-green-500 text-white hover:bg-green-600";
      case "PAID":
        return "bg-green-500 text-white hover:bg-green-600";
      case "PRE_APPROVED":
        return "bg-blue-400 text-white hover:bg-blue-500";
      case "APPROVED":
        return "bg-blue-700 text-white hover:bg-blue-800";
      default:
        return "bg-gray-400 text-white hover:bg-gray-500";
    }
  }

  function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2)}`;
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="flex">
              <div className="w-[250px]">Merchant</div>
              <div className="w-[250px]">Gross Sales Amount</div>
              <div className="w-[250px]">Net Anticipations Amount</div>
              <div className="w-[150px]">Adjustment</div>
              <div className="w-[250px]">Pending Restitution Amount</div>
              <div className="w-[150px]">Settlement Amount</div>
              <div className="w-[100px]">Status</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockSettlements.merchant_settlements.map((settlement) => (
            <Accordion
              key={settlement.id}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value={settlement.id} className="border-0">
                <AccordionTrigger className="hover:no-underline w-full [&[data-state=open]>div>table>tbody>tr]:bg-gray-100/50">
                  <TableRow className="hover:bg-gray-100/50 w-full">
                    <TableCell className="font-medium w-[250px]">
                      {settlement.merchant}
                    </TableCell>
                    <TableCell className="text-right w-[250px]">
                      {formatCurrency(settlement.batchAmount)}
                    </TableCell>
                    <TableCell className="text-right w-[250px]">
                      {formatCurrency(settlement.totalAnticipationAmount)}
                    </TableCell>
                    <TableCell className="text-right w-[150px]">
                      {formatCurrency(
                        settlement.pendingFinancialAdjustmentAmount
                      )}
                    </TableCell>
                    <TableCell className="text-right w-[250px]">
                      {formatCurrency(settlement.pendingRestitutionAmount)}
                    </TableCell>
                    <TableCell className="text-right w-[150px]">
                      {formatCurrency(settlement.totalSettlementAmount)}
                    </TableCell>
                    <TableCell className="text-center w-[100px]">
                      <Badge className={getStatusColor(settlement.status)}>
                        {settlement.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </AccordionTrigger>
                <AccordionContent className="border-t">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receivable Unit</TableHead>
                        <TableHead>Bank</TableHead>
                        <TableHead>Agency</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead>Account Type</TableHead>
                        <TableCell className="text-right font-medium">
                          Amount
                        </TableCell>
                        <TableHead>Effective Payment Date</TableHead>
                        <TableHead>Payment Number</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlement.transactions.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.receivableUnit}</TableCell>
                          <TableCell>{transaction.bank}</TableCell>
                          <TableCell>{transaction.agency}</TableCell>
                          <TableCell>{transaction.accountNumber}</TableCell>
                          <TableCell>{transaction.accountType}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            {transaction.effectivePaymentDate}
                          </TableCell>
                          <TableCell>{transaction.paymentNumber}</TableCell>
                          <TableCell className="text-center">
                            <Badge
                              className={getStatusColor(transaction.status)}
                            >
                              {transaction.status}
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
