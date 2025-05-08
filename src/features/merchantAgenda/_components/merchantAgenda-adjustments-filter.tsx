"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { AdjustmentsListFilterButton } from "./merchantAgenda-adjustments-filter-button";
import { AdjustmentsListFilterContent } from "./merchantAgenda-adjustments-filter-content";

type AdjustmentsListFilterProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  establishmentIn?: string;
};

export function AdjustmentsListFilter(props: AdjustmentsListFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);


  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFiltersVisible(false);
      }
    }

    if (isFiltersVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersVisible]);

  const handleFilter = (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    establishment?: string;
  }) => {
    if (filters.dateFrom) {
      params.set("dateFrom", filters.dateFrom.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (filters.dateTo) {
      params.set("dateTo", filters.dateTo.toISOString());
    } else {
      params.delete("dateTo");
    }

    if (filters.establishment) {
      params.set("establishment", filters.establishment);
    } else {
      params.delete("establishment");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("establishment");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.establishmentIn ? 1 : 0);

  return (
      <div ref={filterRef}>
    <AdjustmentsListFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <AdjustmentsListFilterContent
        dateFromIn={props.dateFromIn}
        dateToIn={props.dateToIn}
        establishmentIn={props.establishmentIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </AdjustmentsListFilterButton>
      </div>
  );
}
