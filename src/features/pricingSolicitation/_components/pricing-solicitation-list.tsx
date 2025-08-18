"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PricingSolicitationStatus } from "@/lib/lookuptables/lookuptables";
import { createSortHandler, formatDate } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { PricingSolicitationList } from "../server/pricing-solicitation";

export default function PricingSolicitationList({
  solicitations,
}: {
  solicitations: PricingSolicitationList;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(
    searchParams,
    router,
    "/portal/pricingSolicitation"
  );

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="w-full rounded-md border">
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableTableHead
                columnId="cnae"
                name="CNAE"
                sortable={true}
                onSort={handleSort}
                searchParams={searchParams}
              />
              <SortableTableHead
                columnId="dtinsert"
                name="Data"
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {solicitations.pricingSolicitations.map((solicitation) => (
              <TableRow key={solicitation.id}>
                <TableCell>
                  <a
                    className="underline"
                    href={`/portal/pricingSolicitation/${solicitation.id}`}
                  >
                    {solicitation.cnae}
                  </a>
                </TableCell>
                <TableCell>
                  {solicitation.dtinsert
                    ? formatDate(new Date(solicitation.dtinsert))
                    : "N/A"}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      PricingSolicitationStatus.find(
                        (status) => status.value === solicitation.status
                      )?.color
                    } text-white px-2 py-1 rounded-md`}
                  >
                    {
                      PricingSolicitationStatus.find(
                        (status) => status.value === solicitation.status
                      )?.label
                    }
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
