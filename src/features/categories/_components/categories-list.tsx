"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from 'next/navigation';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CategoryList } from "../server/category";

interface CategorylistProps {
  Categories: CategoryList;
  sortField: string;
  sortOrder: "asc" | "desc";
}

export default function Categorylist({ Categories, sortField, sortOrder }: CategorylistProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    
    if (field === sortField) {
      
      params.set('sortOrder', sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      
      params.set('sortField', field);
      params.set('sortOrder', 'asc');
    }

    router.push(`/portal/categories?${params.toString()}`);
  };

  return (
    <div>
   
    
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <button 
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1"
                >
                  Nome
                  {sortField === 'name' && (
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </TableHead>
              <TableHead>
               
                  Mcc
                  
              </TableHead>
              <TableHead>
                
                  Cnae
                  
              </TableHead>
              <TableHead>
               Ativo
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
