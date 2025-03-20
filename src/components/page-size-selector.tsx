"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PageSizeSelectorProps {
  currentPageSize: number;
  pageName: string;
}

const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentPageSize,
  pageName,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageSizeChange = (value: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("pageSize", value);
    params.set("page", "1"); // Resetar para a primeira página ao mudar o tamanho
    router.push(`/${pageName}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">Itens por página:</span>
      <Select
        value={currentPageSize.toString()}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger className="w-20 h-8">
          <SelectValue placeholder="20" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="50">50</SelectItem>
          <SelectItem value="100">100</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PageSizeSelector;
