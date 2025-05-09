"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AnticipationsListFilterButton } from "./merchantAgenda-anticipations-filter-button";
import { AnticipationsListFilterContent } from "./merchantAgenda-aticipations-filter-content";

type AnticipationsListFilterProps = {
  settlementDateFromIn?: Date;
  settlementDateToIn?: Date;
  saleDateFromIn?: Date;
  saleDateToIn?: Date;
  establishmentIn?: string;
  nsuIn?: string;
  statusIn?: string;
  orderIdIn?: string;
};

export function AnticipationsListFilter(props: AnticipationsListFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);


  const handleFilter = (filters: {
    settlementDateFrom?: Date;
    settlementDateTo?: Date;
    saleDateFrom?: Date;
    saleDateTo?: Date;
    establishment?: string;
    nsu?: string;
    status: string;
    orderId?: string;
  }) => {
    if (filters.settlementDateFrom) {
      params.set(
        "settlementDateFrom",
        filters.settlementDateFrom.toISOString()
      );
    } else {
      params.delete("settlementDateFrom");
    }

    if (filters.settlementDateTo) {
      params.set("settlementDateTo", filters.settlementDateTo.toISOString());
    } else {
      params.delete("settlementDateTo");
    }

    if (filters.saleDateFrom) {
      params.set("saleDateFrom", filters.saleDateFrom.toISOString());
    } else {
      params.delete("saleDateFrom");
    }

    if (filters.saleDateTo) {
      params.set("saleDateTo", filters.saleDateTo.toISOString());
    } else {
      params.delete("saleDateTo");
    }

    if (filters.establishment) {
      params.set("establishment", filters.establishment);
    } else {
      params.delete("establishment");
    }

    if (filters.nsu) {
      params.set("nsu", filters.nsu);
    } else {
      params.delete("nsu");
    }

    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }

    if (filters.orderId) {
      params.set("orderId", filters.orderId);
    } else {
      params.delete("orderId");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("settlementDateFrom");
    params.delete("settlementDateTo");
    params.delete("saleDateFrom");
    params.delete("saleDateTo");
    params.delete("establishment");
    params.delete("nsu");
    params.delete("status");
    params.delete("orderId");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.settlementDateFromIn ? 1 : 0) +
    (props.settlementDateToIn ? 1 : 0) +
    (props.saleDateFromIn ? 1 : 0) +
    (props.saleDateToIn ? 1 : 0) +
    (props.establishmentIn ? 1 : 0) +
    (props.nsuIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.orderIdIn ? 1 : 0);

  return (
    <AnticipationsListFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <AnticipationsListFilterContent
        settlementDateFromIn={props.settlementDateFromIn}
        settlementDateToIn={props.settlementDateToIn}
        saleDateFromIn={props.saleDateFromIn}
        saleDateToIn={props.saleDateToIn}
        establishmentIn={props.establishmentIn}
        nsuIn={props.nsuIn}
        statusIn={props.statusIn}
        orderIdIn={props.orderIdIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </AnticipationsListFilterButton>
  );
}
