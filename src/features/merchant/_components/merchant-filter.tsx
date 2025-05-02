"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterMerchantsButton } from "./merchant-filter-button";
import { FilterMerchantsContent } from "./merchant-filter-content";

type MerchantFilterWrapperProps = {
  dateFromIn?: string;
  establishmentIn?: string;
  statusIn?: string;
  stateIn?: string;
  emailIn?: string;
  cnpjIn?: string;
  activeIn?: string;
  salesAgentIn?: string;
};

export function MerchantFilter(props: MerchantFilterWrapperProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: {
    dateFrom?: Date;
    establishment: string;
    status: string;
    state: string;
    email: string;
    cnpj: string;
    active: string;
    salesAgent: string;
  }) => {
    if (filters.dateFrom) {
      params.set("dateFrom", filters.dateFrom.toISOString());
    } else {
      params.delete("dateFrom");
    }
    if (filters.establishment) {
      params.set("establishment", filters.establishment);
    } else {
      params.delete("establishment");
    }
    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }
    if (filters.state) {
      params.set("state", filters.state);
    } else {
      params.delete("state");
    }
    if (filters.email) {
      params.set("email", filters.email);
    } else {
      params.delete("email");
    }
    if (filters.cnpj) {
      params.set("cnpj", filters.cnpj);
    } else {
      params.delete("cnpj");
    }
    if (filters.active) {
      params.set("active", filters.active);
    } else {
      params.delete("active");
    }
    if (filters.salesAgent) {
      params.set("salesAgent", filters.salesAgent);
    } else {
      params.delete("salesAgent");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("dateFrom");
    params.delete("establishment");
    params.delete("status");
    params.delete("state");
    params.delete("email");
    params.delete("cnpj");
    params.delete("active");
    params.delete("salesAgent");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.establishmentIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.stateIn ? 1 : 0) +
    (props.emailIn ? 1 : 0) +
    (props.cnpjIn ? 1 : 0) +
    (props.activeIn ? 1 : 0) +
    (props.salesAgentIn ? 1 : 0);

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
        establishmentIn={props.establishmentIn}
        statusIn={props.statusIn}
        stateIn={props.stateIn}
        emailIn={props.emailIn}
        cnpjIn={props.cnpjIn}
        activeIn={props.activeIn}
        salesAgentIn={props.salesAgentIn}
        onFilter={handleFilter}
      />
    </FilterMerchantsButton>
  );
}
