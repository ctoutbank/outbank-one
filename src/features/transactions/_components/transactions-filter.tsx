"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterTransactionsButton } from "./transactions-filter-button";
import { FilterTransactionsContent } from "./transactions-filter-content";
import { useState } from "react";

type TransactionsFilterWrapperProps = {
  statusIn?: string;
  merchantIn?: string;
  dateFromIn?: string;
  dateToIn?: string;
  productTypeIn?: string;
};

export function TransactionsFilter(props: TransactionsFilterWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: {
    status: string;
    merchant: string;
    dateFrom: string;
    dateTo: string;
    productType: string;
  }) => {
    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }
    if (filters.merchant) {
      params.set("merchant", filters.merchant);
    } else {
      params.delete("merchant");
    }
    if (filters.dateFrom) {
      params.set("dateFrom", filters.dateFrom);
    } else {
      params.delete("dateFrom");
    }
    if (filters.dateTo) {
      params.set("dateTo", filters.dateTo);
    } else {
      params.delete("dateTo");
    }
    if (filters.productType) {
      params.set("productType", filters.productType);
    } else {
      params.delete("productType");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("status");
    params.delete("merchant");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("productType");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.statusIn ? 1 : 0) +
    (props.merchantIn ? 1 : 0) +
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.productTypeIn ? 1 : 0);

  return (
    <FilterTransactionsButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <FilterTransactionsContent
        onClose={() => setIsFiltersVisible(false)}
        statusIn={props.statusIn}
        merchantIn={props.merchantIn}
        dateFromIn={props.dateFromIn}
        dateToIn={props.dateToIn}
        productTypeIn={props.productTypeIn}
        onFilter={handleFilter}
      />
    </FilterTransactionsButton>
  );
}
