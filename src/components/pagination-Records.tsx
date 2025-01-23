"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationProps {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  pageName: string;
}

const PaginationCustom: React.FC<PaginationProps> = ({
  totalRecords,
  currentPage,
  pageSize,
  pageName,
}) => {
  const router = useRouter();
  const totalPages = Math.ceil(totalRecords / pageSize);
  const searchParams = useSearchParams();
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set("page", page.toString());
      router.push(`/${pageName}?${params.toString()}`);
    }
  };

  if (totalPages <= 0) return null;

 

  return (
    <>
      <Pagination className="mt-4">
        <PaginationContent>
          {currentPage > 1 && (
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
          )}
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const start = Math.max(1, currentPage - 3);
            const pageNum = start + i;
            return pageNum <= totalPages ? pageNum : null;
          })
          .filter(Boolean)
          .map((page) => (
            <PaginationItem className="cursor-pointer" key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page as number)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          {currentPage < totalPages && (
            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
      <div className="text-sm">Total records: {totalRecords}</div>
    </>
  );
};

export default PaginationCustom;
