"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { MerchantDD } from "../server/anticipation";
import { AnticipationsListFilterButton } from "./anticipations-filter-button";
import { EventualAnticipationsListFilterContent } from "@/features/anticipations/_components/eventual-anticipations-filter-content";

type EventualAnticipationsListFilterProps = {
  dateFromIn?: Date;
  dateToIn?: Date;
  expectedSettlementDateFromIn?: Date;
  expectedSettlementDateToIn?: Date;
  merchantSlugIn?: string;
  typeIn?: string;
  statusIn?: string;
  merchantDD?: MerchantDD[];
};

export function EventualAnticipationsListFilter(
  props: EventualAnticipationsListFilterProps
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    expectedSettlementDateFrom?: Date;
    expectedSettlementDateTo?: Date;
    merchantSlug?: string;
    type?: string;
    status: string;
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

    if (filters.expectedSettlementDateFrom) {
      params.set(
        "expectedSettlementDateFrom",
        filters.expectedSettlementDateFrom.toISOString()
      );
    } else {
      params.delete("expectedSettlementDateFrom");
    }

    if (filters.expectedSettlementDateTo) {
      params.set(
        "expectedSettlementDateTo",
        filters.expectedSettlementDateTo.toISOString()
      );
    } else {
      params.delete("expectedSettlementDateTo");
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
    params.delete("expectedSettlementDateFrom");
    params.delete("expectedSettlementDateTo");
    params.delete("merchantSlug");
    params.delete("type");
    params.delete("status");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.expectedSettlementDateFromIn ? 1 : 0) +
    (props.expectedSettlementDateToIn ? 1 : 0) +
    (props.merchantSlugIn ? 1 : 0) +
    (props.typeIn ? 1 : 0) +
    (props.statusIn ? 1 : 0);

  return (
    <AnticipationsListFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <EventualAnticipationsListFilterContent
        dateFromIn={props.dateFromIn}
        dateToIn={props.dateToIn}
        expectedSettlementDateFromIn={props.expectedSettlementDateFromIn}
        expectedSettlementDateToIn={props.expectedSettlementDateToIn}
        merchantSlugIn={props.merchantSlugIn}
        typeIn={props.typeIn}
        statusIn={props.statusIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
        merchantDD={props.merchantDD}
      />
    </AnticipationsListFilterButton>
  );
}
