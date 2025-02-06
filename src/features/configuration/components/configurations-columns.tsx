"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { ConfigurationSchema } from "../schema/configurations-schema";

export const columns: ColumnDef<ConfigurationSchema>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "slug",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "active",
    header: "Active",
    cell: ({ row }) => <div>{row.getValue("active") ? "Yes" : "No"}</div>,
  },
  {
    accessorKey: "url",
    header: "URL",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const configuration = row.original;

      return (
        <div className="flex gap-2">
          <Link href={`/portal/configurations/${configuration.id}`}>
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </Link>
        </div>
      );
    },
  },
];
