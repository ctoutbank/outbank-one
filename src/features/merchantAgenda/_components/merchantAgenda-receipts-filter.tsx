"use client";

import { MerchantAgendaReceiptsFilterButton } from "@/features/merchantAgenda/_components/merchantAgenda-receipts-filter-button";
import { MerchantAgendaReceiptsFilterContent } from "@/features/merchantAgenda/_components/merchantAgenda-receipts-filter-content";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type MerchantAgendaReceiptsFilterProps = {
  merchant?: string;
  date?: string;
  view: "month" | "day";
};

export function MerchantAgendaReceiptsFilter(
  props: MerchantAgendaReceiptsFilterProps
) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: { merchant: string; date: string }) => {
    if (filters.merchant) {
      params.set("search", filters.merchant);
    } else {
      params.delete("search");
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
    params.delete("search");
    params.delete("date");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount = (props.merchant ? 1 : 0) + (props.date ? 1 : 0);

  return (
    <MerchantAgendaReceiptsFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <MerchantAgendaReceiptsFilterContent
        merchant={props.merchant}
        date={props.date}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
        view={props.view}
      />
    </MerchantAgendaReceiptsFilterButton>
  );
}
