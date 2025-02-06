"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SalesAgentsList } from "@/features/salesAgents/server/salesAgent";

import { ChevronDown } from "lucide-react";
import Link from "next/link";




export default function SalesAgentlist({ SalesAgents }: { SalesAgents: SalesAgentsList }) {

    return (
        <div>
       
    
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    Nome 
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>
                    Email
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>
                   Registro
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                 
                  <TableHead>
                    Ativo
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
            {SalesAgents.salesAgents.map((agent) => (
              <TableRow key={agent.id}>
                <TableCell>
                <Link
                className="text-primary underline"
                href={"/portal/salesAgents/" + agent.id}
              >
                {agent.firstName} {agent.lastName}
              </Link>
                </TableCell>
                <TableCell>
                  {agent.email}
                
                </TableCell>
                <TableCell>
                  {agent.documentId}
                
                </TableCell>
               
                <TableCell>
                  {" "}
                  <Badge variant={agent.active ? "success" : "destructive"}>
                    {agent.active ? "INATIVO" : "ATIVO"}
                  </Badge>
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
