"use client";

import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReportsList } from "@/features/reports/server/reports";
import { createSortHandler } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ReportList({
  Reports,
}: {
  Reports: ReportsList | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(searchParams, router, "/portal/reports");

  const formatDateTime = (date: Date) => {
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="title"
                name="Título"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="reportType"
                name="Tipo de Relatório"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="formatCode"
                name="Formato"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="recurrenceCode"
                name="Recorrência"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="periodCode"
                name="Período"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="dtinsert"
                name="Data de Criação"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="emails"
                name="Email"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="shippingTime"
                name="Horário"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
            </TableRow>
          </TableHeader>
          <TableBody>
            {Reports?.reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>
                  <Link
                    className="text-primary underline"
                    href={"/portal/reports/" + report.id}
                  >
                    {report.title}
                  </Link>
                </TableCell>
                <TableCell>{report.reportTypeName || "-"}</TableCell>
                <TableCell>{report.formatName || "-"}</TableCell>
                <TableCell>{report.recurrenceName || "-"}</TableCell>
                <TableCell>{report.periodName || "-"}</TableCell>
                <TableCell>
                  {report.dtinsert ? formatDateTime(report.dtinsert) : "-"}
                </TableCell>
                <TableCell>
                  {report.emails
                    ? report.emails.split(",").map((email, index) => (
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
