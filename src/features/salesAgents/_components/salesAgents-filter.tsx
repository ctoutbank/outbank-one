"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { SalesAgentsFilterButton } from "./salesAgents-filter-button"
import { SalesAgentsFilterContent } from "./salesAgents-filter-content"
import { useState } from "react"

type SalesAgentsFilterProps = {
  dateFromIn?: string
  dateToIn?: string
  nameIn?: string
  statusIn?: string
  emailIn?: string
}

export function SalesAgentsFilter(props: SalesAgentsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() || "")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)


  const handleFilter = (filters: {
    dateFrom?: Date
    dateTo?: Date
    name: string
    status: string
    email: string
  }) => {
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
    if (filters.name) {
      params.set("name", filters.name)
    } else {
      params.delete("name")
    }
    if (filters.status) {
      params.set("status", filters.status)
    } else {
      params.delete("status")
    }
    if (filters.email) {
      params.set("email", filters.email)
    } else {
      params.delete("email")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }
  

  const handleClearFilters = () => {
    params.delete("dateFrom")
    params.delete("dateTo")
    params.delete("name")
    params.delete("status")
    params.delete("email")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.nameIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.emailIn ? 1 : 0)

  return (
    <SalesAgentsFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <SalesAgentsFilterContent
        dateFromIn={props.dateFromIn ? new Date(props.dateFromIn) : undefined}
        dateToIn={props.dateToIn ? new Date(props.dateToIn) : undefined}
        nameIn={props.nameIn}
        statusIn={props.statusIn}
        emailIn={props.emailIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </SalesAgentsFilterButton>
)
}
