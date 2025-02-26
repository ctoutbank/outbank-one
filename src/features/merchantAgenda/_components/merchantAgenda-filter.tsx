"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { MerchantAgendaFilterButton } from "./merchantAgenda-filter-button"
import { MerchantAgendaFilterContent } from "./merchantAgenda-filter-content"
import { useState } from "react"

type MerchantAgendaFilterProps = {
  dateFromIn?: string
  dateToIn?: string
  establishmentIn?: string
  statusIn?: string
  cardBrandIn?: string
  settlementDateFromIn?: string
  settlementDateToIn?: string
  expectedSettlementDateFromIn?: string
  expectedSettlementDateToIn?: string
}

export function MerchantAgendaFilter(props: MerchantAgendaFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() || "")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleFilter = (filters: {
    dateFrom?: Date
    dateTo?: Date
    establishment: string
    status: string
    cardBrand: string
    settlementDateFrom?: Date
    settlementDateTo?: Date
    expectedSettlementDateFrom?: Date
    expectedSettlementDateTo?: Date
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
    if (filters.cardBrand && filters.cardBrand !== "all") {
      params.set("cardBrand", filters.cardBrand)
    } else {
      params.delete("cardBrand")
    }
    if (filters.settlementDateFrom) {
      params.set("settlementDateFrom", filters.settlementDateFrom.toISOString())
    } else {
      params.delete("settlementDateFrom")
    }
    if (filters.settlementDateTo) {
      params.set("settlementDateTo", filters.settlementDateTo.toISOString())
    } else {
      params.delete("settlementDateTo")
    }
    if (filters.expectedSettlementDateFrom) {
      params.set("expectedSettlementDateFrom", filters.expectedSettlementDateFrom.toISOString())
    } else {
      params.delete("expectedSettlementDateFrom")
    }
    if (filters.expectedSettlementDateTo) {
      params.set("expectedSettlementDateTo", filters.expectedSettlementDateTo.toISOString())
    } else {
      params.delete("expectedSettlementDateTo")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    params.delete("dateFrom")
    params.delete("dateTo")
    params.delete("establishment")
    params.delete("status")
    params.delete("cardBrand")
    params.delete("settlementDateFrom")
    params.delete("settlementDateTo")
    params.delete("expectedSettlementDateFrom")
    params.delete("expectedSettlementDateTo")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.establishmentIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.cardBrandIn ? 1 : 0) +
    (props.settlementDateFromIn ? 1 : 0) +
    (props.settlementDateToIn ? 1 : 0) +
    (props.expectedSettlementDateFromIn ? 1 : 0) +
    (props.expectedSettlementDateToIn ? 1 : 0)

  return (
    <MerchantAgendaFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <MerchantAgendaFilterContent
        dateFromIn={props.dateFromIn ? new Date(props.dateFromIn) : undefined}
        dateToIn={props.dateToIn ? new Date(props.dateToIn) : undefined}
        establishmentIn={props.establishmentIn}
        statusIn={props.statusIn}
        cardBrandIn={props.cardBrandIn}
        settlementDateFromIn={props.settlementDateFromIn ? new Date(props.settlementDateFromIn) : undefined}
        settlementDateToIn={props.settlementDateToIn ? new Date(props.settlementDateToIn) : undefined}
        expectedSettlementDateFromIn={props.expectedSettlementDateFromIn ? new Date(props.expectedSettlementDateFromIn) : undefined}
        expectedSettlementDateToIn={props.expectedSettlementDateToIn ? new Date(props.expectedSettlementDateToIn) : undefined}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </MerchantAgendaFilterButton>
  )
}