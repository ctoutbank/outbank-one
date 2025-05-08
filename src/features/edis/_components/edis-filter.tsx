"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FilterEdisButton } from "./edis-filter-button";
import { FilterEdisContent } from "./edis-filter-content";
import {useEffect, useRef, useState} from "react";

type EdisFilterWrapperProps = {
  typeIn?: string;
  statusIn?: string;
  dateIn?: string;
};

export function EdisFilter(props: EdisFilterWrapperProps) {
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
    type: string;
    status: string;
    date: string;
  }) => {
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
    if (filters.date) {
      params.set("date", filters.date);
    } else {
      params.delete("date");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("type");
    params.delete("status");
    params.delete("date");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.typeIn ? 1 : 0) + (props.statusIn ? 1 : 0) + (props.dateIn ? 1 : 0);

  return (
      <div ref={filterRef}>
    <FilterEdisButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <FilterEdisContent
        onClose={() => setIsFiltersVisible(false)}
        typeIn={props.typeIn}
        statusIn={props.statusIn}
        dateIn={props.dateIn}
        onFilter={handleFilter}
      />
    </FilterEdisButton>
      </div>
  );
}
