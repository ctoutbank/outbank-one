"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ReportsFilterButton } from "./reports-filter-button"
import { ReportsFilterContent } from "./reports-filter-content"
import {useEffect, useRef, useState} from "react"

type ReportsFilterProps = {
  searchIn?: string
  typeIn?: string
  formatIn?: string
  recurrenceIn?: string
  periodIn?: string
  emailIn?: string
  creationDateIn?: string
}

export function ReportsFilter(props: ReportsFilterProps) {
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
    search: string
    type: string
    format: string
    recurrence: string
    period: string
    email: string
    creationDate?: Date
  }) => {
    if (filters.search) {
      params.set("search", filters.search)
    } else {
      params.delete("search")
    }
    if (filters.type) {
      params.set("type", filters.type)
    } else {
      params.delete("type")
    }
    if (filters.format) {
      params.set("format", filters.format)
    } else {
      params.delete("format")
    }
    if (filters.recurrence) {
      params.set("recurrence", filters.recurrence)
    } else {
      params.delete("recurrence")
    }
    if (filters.period) {
      params.set("period", filters.period)
    } else {
      params.delete("period")
    }
    if (filters.email) {
      params.set("email", filters.email)
    } else {
      params.delete("email")
    }
    if (filters.creationDate) {
      params.set("creationDate", filters.creationDate.toISOString())
    } else {
      params.delete("creationDate")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  
  const handleClearFilters = () => {
    params.delete("search")
    params.delete("type")
    params.delete("format")
    params.delete("recurrence")
    params.delete("period")
    params.delete("email")
    params.delete("creationDate")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.searchIn ? 1 : 0) +
    (props.typeIn ? 1 : 0) +
    (props.formatIn ? 1 : 0) +
    (props.recurrenceIn ? 1 : 0) +
    (props.periodIn ? 1 : 0) +
    (props.emailIn ? 1 : 0) +
    (props.creationDateIn ? 1 : 0)

  return (
      <div ref={filterRef}>
    <ReportsFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <ReportsFilterContent
        searchIn={props.searchIn}
        typeIn={props.typeIn}
        formatIn={props.formatIn}
        recurrenceIn={props.recurrenceIn}
        periodIn={props.periodIn}
        emailIn={props.emailIn}
        creationDateIn={props.creationDateIn ? new Date(props.creationDateIn) : undefined}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </ReportsFilterButton>
      </div>
  )
}