"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PaginationSizeSelectorProps {
  pageName: string;
  pageSize: number;
}

const PaginationSizeSelector: React.FC<PaginationSizeSelectorProps> = ({
  pageName,
  pageSize,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageSizeChange = (size: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("pageSize", size);
    params.set("page", "1"); // Reset to first page when changing page size
    router.push(`/${pageName}?${params.toString()}`);
  };

  return (
    <div className="flex items-center">
      <span className="text-sm mr-2">Itens por página:</span>
      <Select
        value={pageSize.toString()}
        onValueChange={handlePageSizeChange}
      >
        <SelectTrigger className="h-8 w-16">
          <SelectValue placeholder={pageSize.toString()} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="40">40</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PaginationSizeSelector; 