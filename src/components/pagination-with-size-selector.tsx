"use client";

import React from "react";
import PaginationRecords from "./pagination-Records";
import PaginationSizeSelector from "./pagination-size-selector";

interface PaginationWithSizeSelectorProps {
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  pageName: string;
}

const PaginationWithSizeSelector: React.FC<PaginationWithSizeSelectorProps> = ({
  totalRecords,
  currentPage,
  pageSize,
  pageName,
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
      <PaginationSizeSelector pageName={pageName} pageSize={pageSize} />
      <PaginationRecords
        totalRecords={totalRecords}
        currentPage={currentPage}
        pageSize={pageSize}
        pageName={pageName}
      />
    </div>
  );
};

export default PaginationWithSizeSelector; 