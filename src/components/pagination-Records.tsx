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
  const params = new URLSearchParams(searchParams);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      params.set("page", page.toString());
      //add new objects in searchParams
      router.push(`/${pageName}?${params.toString()}`);
    }
  };

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
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(currentPage - 3, 0), currentPage + 3)
            .map((page) => (
              <PaginationItem className="cursor-pointer" key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

          <PaginationItem>
            <PaginationNext
              className="cursor-pointer"
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="text-sm">Total records: {totalRecords}</div>
    </>
  );
};

export default PaginationCustom;
