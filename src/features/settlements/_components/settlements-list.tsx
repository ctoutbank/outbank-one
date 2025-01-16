"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data structure matching the image
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
          amount: 3626.40,
          effectivePaymentDate: "2025-01-16",
          paymentNumber: "202501150000561154288",
          status: "PAID"
        },
        {
          receivableUnit: "VISA Credit",
          bank: "Bco cooperativo sicredi s.a.",
          agency: "0710",
          accountNumber: "35455",
          accountType: "Checking",
          amount: 3812.39,
          effectivePaymentDate: "2025-01-16",
          paymentNumber: "202501150000561154289",
          status: "PAID"
        },
        {
          receivableUnit: "ELO Credit",
          bank: "Bco cooperativo sicredi s.a.",
          agency: "0710",
          accountNumber: "35455",
          accountType: "Checking",
          amount: 138.73,
          effectivePaymentDate: "2025-01-16",
          paymentNumber: "202501150000561154290",
          status: "PAID"
        }
      ]
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
      transactions: []
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
      transactions: []
    }
  ]
}

export default function SettlementsList() {
  function getStatusColor(status: string): string {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white hover:bg-yellow-600"
      case "PROCESSING":
        return "bg-yellow-300 text-black hover:bg-yellow-400"
      case "FAILED":
        return "bg-red-500 text-white hover:bg-red-600"
      case "SETTLED":
        return "bg-green-500 text-white hover:bg-green-600"
      case "PAID":
        return "bg-green-500 text-white hover:bg-green-600"
      case "PRE_APPROVED":
        return "bg-blue-400 text-white hover:bg-blue-500"
      case "APPROVED":
        return "bg-blue-700 text-white hover:bg-blue-800"
      default:
        return "bg-gray-400 text-white hover:bg-gray-500"
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {mockSettlements.merchant_settlements.map((settlement) => (
        <AccordionItem key={settlement.id} value={settlement.id}>
          <AccordionTrigger className="hover:no-underline">
            <div className="w-full">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {settlement.merchant}
                    </TableCell>
                    <TableCell>
                      R$ {settlement.batchAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      R$ {settlement.totalAnticipationAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      R$ {settlement.pendingFinancialAdjustmentAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      R$ {settlement.pendingRestitutionAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      R$ {settlement.totalSettlementAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(settlement.status)}>
                        {settlement.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Receivable Unit</TableHead>
                  <TableHead>Bank</TableHead>
                  <TableHead>Agency</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Account Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Effective Payment Date</TableHead>
                  <TableHead>Payment Number</TableHead>
                  <TableHead>Status</TableHead>
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
                    <TableCell>R$ {transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>{transaction.effectivePaymentDate}</TableCell>
                    <TableCell>{transaction.paymentNumber}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

