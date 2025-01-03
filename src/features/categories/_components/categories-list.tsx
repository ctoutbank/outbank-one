"use client";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreVertical } from "lucide-react";
import { CategoryList } from "../server/category";


export default function Categorylist({ Categories }: { Categories: CategoryList }) {
    
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
                 Mcc
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  <TableHead>
                  Cnae
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  
                  
                  <TableHead>
                    Ativo
                    <ChevronDown className="ml-2 h-4 w-4 inline" />
                  </TableHead>
                  
                </TableRow>
              </TableHeader>
              <TableBody>
            {Categories.categories.map((categories) => (
              <TableRow key={categories.id}>
                <TableCell>
                <Link
                    className="text-primary underline"
                    href="/portal/caterogies/[id]"
                    as={`/portal/categories/${categories.id}`}
                  >
                  {categories.name}      
                  </Link>            
                </TableCell>
                <TableCell>
                  {categories.mcc}
                
                </TableCell>
                <TableCell>
                  {categories.cnae}
                
                </TableCell>
               
                <TableCell>
                  {" "}
                  <Badge variant={categories.active ? "success" : "destructive"}>
                    {categories.active ? "ATIVO" : "INATIVO"}
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
