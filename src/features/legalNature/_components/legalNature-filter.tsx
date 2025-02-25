"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { LegalNatureFilterButton } from "./legalNature-filter-button"
import { LegalNatureFilterContent } from "./legalNature-filter-content"
import { useState } from "react"

type LegalNatureFilterProps = {
  nameIn?: string
  codeIn?: string
  activeIn?: string
}

export function LegalNatureFilter(props: LegalNatureFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams?.toString() || "")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  const handleFilter = (filters: {
    name: string
    code: string
    active: string
  }) => {
    if (filters.name) {
      params.set("name", filters.name)
    } else {
      params.delete("name")
    }
    if (filters.code) {
      params.set("code", filters.code)
    } else {
      params.delete("code")
    }
    if (filters.active) {
      params.set("active", filters.active)
    } else {
      params.delete("active")
    }
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const handleClearFilters = () => {
    params.delete("name")
    params.delete("code")
    params.delete("active")
    params.set("page", "1")
    router.push(`?${params.toString()}`)
  }

  const activeFiltersCount =
    (props.nameIn ? 1 : 0) +
    (props.codeIn ? 1 : 0) +
    (props.activeIn ? 1 : 0)

  return (
    <LegalNatureFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <LegalNatureFilterContent
        nameIn={props.nameIn}
        codeIn={props.codeIn}
        activeIn={props.activeIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </LegalNatureFilterButton>
  )
}