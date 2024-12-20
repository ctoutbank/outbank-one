"use client"; 

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown, MoreVertical } from "lucide-react";
import Link from "next/link";
import { LegalNatureList } from "@/server/db/legalNature";


export default function LegalNaturelist({ LegalNatures }: { LegalNatures: LegalNatureList }) {
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
                    Codigo
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                 
                  <TableHead>
                    Ativo
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
            {LegalNatures.legalNatures.map((legalNature) => (
              <TableRow key={legalNature.id}>
                <TableCell>
                <Link
                className="text-primary underline"
                    href="/portal/LegalNatures/[id]"
                    as={`/portal/legalNatures/${legalNature.id}`}
                  >
                  {legalNature.name} 
                 </Link>
                </TableCell>
                <TableCell>
                  {legalNature.code}
                
                </TableCell>
               
                <TableCell>
                  {" "}
                  <Badge variant={legalNature.active ? "success" : "destructive"}>
                    {legalNature.active ? "ATIVO" : "INATIVO"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href="/portal/LegalNatures/[id]"
                    as={`/portal/legalNatures/${legalNature.id}`}
                  >
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
