"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportsList } from "@/features/reports/server/reports";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function ReportList({ Reports }: { Reports: ReportsList }) {
  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Título
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Tipo de Relatório
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Formato
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Recorrência
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              
              <TableHead>
                Periodo
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Data de Criação
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
              <TableHead>
                Email
                <ChevronDown className="ml-2 h-4 w-4 inline" />
                
              </TableHead>
              <TableHead>
                Horário
                <ChevronDown className="ml-2 h-4 w-4 inline" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Reports.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Link
                    className="text-primary underline"
                    href={"/portal/reports/" + report.id}
                  >
                    {report.title}
                  </Link>
                </TableCell>
                <TableCell>
                  {report.reportTypeName || "-"}
                </TableCell>
                <TableCell>
                  {report.formatName || "-"}
                </TableCell>
                <TableCell>
                  {report.recurrenceName || "-"}
                  
                </TableCell>
                <TableCell>
                  {report.periodName || "-"}
                </TableCell>
                <TableCell>
                  {report.dtinsert 
                    ? formatDateTime(report.dtinsert) 
                    : "-"
                  }
                </TableCell>
                <TableCell>
                  {report.emails 
                    ? report.emails.split(',').map((email, index) => (
                        <div key={index} className="text-xs">
                          {email.trim()}
                        </div>
                      ))
                    : "-"}
                </TableCell>
                <TableCell>
                  {report.shippingTime 
                    ? report.shippingTime.substring(0, 5) 
                    : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 