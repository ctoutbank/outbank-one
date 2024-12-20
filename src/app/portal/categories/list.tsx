"use client";
import Link from "next/link";
import { CategoryList } from "@/server/db/category";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreVertical } from "lucide-react";


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
                  <TableHead></TableHead>
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
                    {categories.active ? "INATIVO" : "ATIVO"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link
                    href="/portal/caterogies/[id]"
                    as={`/portal/categories/${categories.id}`}
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
