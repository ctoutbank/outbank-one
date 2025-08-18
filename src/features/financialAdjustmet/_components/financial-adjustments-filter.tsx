"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { FinancialAdjustmentsButtonFilter } from "./financial-adjustments-button-filter";
import { FinancialAdjustmentsFilterContent } from "./financial-adjustments-filter-content";

interface FinancialAdjustmentsFilterProps {
  searchIn?: string;
  typeIn?: string;
  reasonIn?: string;
  activeIn?: string;
  creationDateIn?: Date;
}

export function FinancialAdjustmentsFilter({
                                             searchIn,
                                             typeIn,
                                             reasonIn,
                                             activeIn,
                                             creationDateIn,
                                           }: FinancialAdjustmentsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Calcula o número de filtros ativos
  const getActiveFiltersCount = useCallback(() => {
    let count = 0;
    if (searchIn) count++;
    if (typeIn) count++;
    if (reasonIn) count++;
    if (activeIn) count++;
    if (creationDateIn) count++;
    return count;
  }, [searchIn, typeIn, reasonIn, activeIn, creationDateIn]);

  const handleFilter = useCallback(
      (filters: {
        search: string;
        type: string;
        reason: string;
        active: string;
        creationDate?: Date;
      }) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        // Reset page when applying filters
        params.delete("page");

        if (filters.search) {
          params.set("search", filters.search);
        } else {
          params.delete("search");
        }

        if (filters.type) {
          params.set("type", filters.type);
        } else {
          params.delete("type");
        }

        if (filters.reason) {
          params.set("reason", filters.reason);
        } else {
          params.delete("reason");
        }

        if (filters.active) {
          params.set("active", filters.active);
        } else {
          params.delete("active");
        }

        if (filters.creationDate) {
          params.set("creationDate", filters.creationDate.toISOString());
        } else {
          params.delete("creationDate");
        }

        router.push(`/portal/financialAdjustment?${params.toString()}`);
      },
      [router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push("/portal/financialAdjustment");
  }, [router]);

  return (
      <FinancialAdjustmentsButtonFilter
          activeFiltersCount={getActiveFiltersCount()}
          onClearFilters={clearFilters}
          isFiltersVisible={isFiltersVisible}
          onVisibilityChange={setIsFiltersVisible}
      >
        <FinancialAdjustmentsFilterContent
            searchIn={searchIn}
            typeIn={typeIn}
            reasonIn={reasonIn}
            activeIn={activeIn}
            creationDateIn={creationDateIn}
            onFilter={handleFilter}
            onClose={() => setIsFiltersVisible(false)}
        />
      </FinancialAdjustmentsButtonFilter>
  );
}
