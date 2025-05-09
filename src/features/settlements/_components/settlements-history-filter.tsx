"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SettlementsHistoryFilterButton } from "./settlements-history-filter-button"
import { SettlementsHistoryFilterContent } from "./settlements-history-filter-content"
import {useEffect, useRef, useState} from "react"

type SettlementsHistoryFilterProps = {
  statusIn?: string
  dateFromIn?: Date
  dateToIn?: Date
}

export function SettlementsHistoryFilter(props: SettlementsHistoryFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() || "")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)



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
    status: string
    dateFrom?: Date
    dateTo?: Date
  }) => {
    if (filters.status) {
      const normalizedStatus = filters.status === "error" ? "failed" : filters.status
      params.set("status", normalizedStatus)
    } else {
      params.delete("status")
    }

    if (filters.dateFrom) {
      params.set("dateFrom", filters.dateFrom.toISOString())
    } else {
      params.delete("dateFrom")
    }

    if (filters.dateTo) {
      params.set("dateTo", filters.dateTo.toISOString())
    } else {
      params.delete("dateTo")
    }

    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    params.delete("status")
    params.delete("dateFrom")
    params.delete("dateTo")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.statusIn ? 1 : 0) +
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0)

  return (
      <div ref={filterRef}>
    <SettlementsHistoryFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <SettlementsHistoryFilterContent
        statusIn={props.statusIn}
        dateFromIn={props.dateFromIn}
        dateToIn={props.dateToIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </SettlementsHistoryFilterButton>
      </div>
  )
}