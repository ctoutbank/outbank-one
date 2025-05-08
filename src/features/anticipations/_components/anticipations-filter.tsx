"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MerchantDD } from "../server/anticipation";
import { AnticipationsListFilterButton } from "./anticipations-filter-button";
import { AnticipationsListFilterContent } from "./aticipations-filter-content";
type AnticipationsListFilterProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  merchantSlugIn?: string;
  typeIn?: string;
  statusIn?: string;
  merchantDD?: MerchantDD[];
};

export function AnticipationsListFilter(props: AnticipationsListFilterProps) {
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
    merchantSlug?: string;
    type?: string;
    status?: string;
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

    if (filters.merchantSlug) {
      params.set("merchantSlug", filters.merchantSlug);
    } else {
      params.delete("merchantSlug");
    }

    if (filters.type) {
      params.set("type", filters.type);
    } else {
      params.delete("type");
    }

    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("merchantSlug");
    params.delete("type");
    params.delete("status");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.merchantSlugIn && props.merchantSlugIn !== "all" ? 1 : 0) +
    (props.typeIn ? 1 : 0) +
    (props.statusIn ? 1 : 0);

  return (
      <div ref={filterRef}>
    <AnticipationsListFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <AnticipationsListFilterContent
        dateFromIn={props.dateFromIn}
        dateToIn={props.dateToIn}
        merchantSlugIn={props.merchantSlugIn}
        typeIn={props.typeIn}
        statusIn={props.statusIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
        merchantDD={props.merchantDD}
      />
    </AnticipationsListFilterButton>
      </div>
  );
}
