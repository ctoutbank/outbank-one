"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createSortHandler } from "@/lib/utils";
import { Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserList } from "../server/users";

interface UsersListProps {
  users: UserList;
  permissions?: string[];
}

export default function UsersList({ users, permissions }: UsersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = createSortHandler(searchParams, router, "/portal/users");

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="border rounded-lg mt-2">
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              columnId="email"
              name="E-mail"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
              className="font-medium"
            />
            <SortableTableHead
              columnId="firstName"
              name="Primeiro Nome"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
              className="font-medium"
            />
            <SortableTableHead
              columnId="lastName"
              name="Último Nome"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
              className="font-medium"
            />
            <SortableTableHead
              columnId="profileName"
              name="Perfil"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
              className="font-medium"
            />
            <SortableTableHead
              columnId="status"
              name="Status"
              sortable={true}
              onSort={handleSort}
              searchParams={searchParams}
              className="font-medium text-center"
            />
            {permissions?.includes("Gerenciador") && (
              <SortableTableHead
                columnId="options"
                name="Opções"
                sortable={false}
                onSort={handleSort}
                searchParams={searchParams}
                className="font-medium text-center"
              />
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.userObject?.map((user) => (
            <TableRow
              key={user.email}
              className="hover:bg-muted/30 transition-colors"
            >
              <TableCell className="py-3">
                {permissions?.includes("Gerenciador") ? (
                  <a
                    href={`/portal/users/${user.idClerk}`}
                    className="text-primary hover:underline"
                  >
                    {user.email}
                  </a>
                ) : (
                  <span>{user.email}</span>
                )}
              </TableCell>
              <TableCell className="py-3">{user.firstName}</TableCell>
              <TableCell className="py-3">{user.lastName}</TableCell>
              <TableCell className="py-3">
                <div className="flex flex-col">
                  <span className="font-medium">{user.profileName}</span>
                  {user.profileName && (
                    <span className="text-xs text-muted-foreground">
                      {user.profileDescription}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-3 text-center">
                <Badge
                  variant={user.status === true ? "success" : "destructive"}
                  className={`${
                    user.status === true ? "bg-emerald-500" : "bg-red-500"
                  }`}
                >
                  {user.status === true ? "Ativo" : "Desativado"}
                </Badge>
              </TableCell>
              {permissions?.includes("Gerenciador") && (
                <TableCell className="py-3">
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full hover:bg-muted"
                      title="Excluir"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
