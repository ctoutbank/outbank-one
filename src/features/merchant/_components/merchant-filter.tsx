"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { FilterMerchantsButton } from "./merchant-filter-button"
import { FilterMerchantsContent } from "./merchant-filter-content"
import { useState } from "react"

type MerchantFilterWrapperProps = {
  dateFromIn?: string
  dateToIn?: string
  establishmentIn?: string
  statusIn?: string
  stateIn?: string
}

export function MerchantFilter(props: MerchantFilterWrapperProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() || "")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleFilter = (filters: {
    dateFrom?: Date
    dateTo?: Date
    establishment: string
    status: string
    state: string
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
    if (filters.establishment) {
      params.set("establishment", filters.establishment)
    } else {
      params.delete("establishment")
    }
    if (filters.status) {
      params.set("status", filters.status)
    } else {
      params.delete("status")
    }
    if (filters.state) {
      params.set("state", filters.state)
    } else {
      params.delete("state")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    params.delete("dateFrom")
    params.delete("dateTo")
    params.delete("establishment")
    params.delete("status")
    params.delete("state")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.establishmentIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.stateIn ? 1 : 0)

  return (
    <FilterMerchantsButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <FilterMerchantsContent
        onClose={() => setIsFiltersVisible(false)}
        dateFromIn={props.dateFromIn ? new Date(props.dateFromIn) : undefined}
        dateToIn={props.dateToIn ? new Date(props.dateToIn) : undefined}
        establishmentIn={props.establishmentIn}
        statusIn={props.statusIn}
        stateIn={props.stateIn}
        onFilter={handleFilter}
      />
    </FilterMerchantsButton>
  )
}