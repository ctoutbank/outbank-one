"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Info } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type AnticipationListProps = {};

export default function AnticipationList() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    const currentSortField = params.get("sortField") ?? "";
    const currentSortOrder = params.get("sortOrder") ?? "asc";

    if (field === currentSortField) {
      params.set("sortOrder", currentSortOrder === "asc" ? "desc" : "asc");
    } else {
      params.set("sortField", field);
      params.set("sortOrder", "asc");
    }

    router.push(`/anticipations?${params.toString()}`);
  };

  // Mock data - replace with actual data
  const anticipations = [
    {
      id: 1,
      requestDate: "23/12/2024",
      type: "Cartão Presente",
      establishment: "POSTO JOIA",
      establishmentCode: "572.085.330-00",
      amount: "R$ 8.419,15",
      status: "Aprovado",
      action: "Liquidado",
    },
    // Add more items as needed
  ];

  return (
    <div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button
                  onClick={() => handleSort("requestDate")}
                  className="flex items-center gap-1"
                >
                  Data de Solicitação
                  <span>↑↓</span>
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("type")}
                  className="flex items-center gap-1"
                >
                  Tipo
                  <span>↑↓</span>
                </button>
              </TableHead>
              <TableHead>Estabelecimento</TableHead>
              <TableHead>
                <button
                  onClick={() => handleSort("amount")}
                  className="flex items-center gap-1"
                >
                  Total a Antecipar
                  <span>↑↓</span>
                </button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {anticipations.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.requestDate}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>
                  <div>
                    <span className="font-medium">{item.establishment}</span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {item.establishmentCode}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  {item.amount}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Informações adicionais sobre o valor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <Badge variant="success" className="bg-emerald-500">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground">{item.action}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
