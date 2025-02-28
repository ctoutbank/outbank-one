"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterPaymentLinkButton } from "./filter-button";
import { FilterPaymentLinkContent } from "./filter-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

type PaymentLinkFilterProps = {
  identifier?: string;
  status?: string;
  merchant?: string;
};

export function PaymentLinkFilter(props: PaymentLinkFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: {
    identifier: string;
    status: string;
    merchant: string;
  }) => {
    if (filters.identifier) {
      params.set("identifier", filters.identifier);
    } else {
      params.delete("identifier");
    }
    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }
    if (filters.merchant) {
      params.set("merchant", filters.merchant);
    } else {
      params.delete("merchant");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("identifier");
    params.delete("status");
    params.delete("merchant");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.identifier ? 1 : 0) +
    (props.status ? 1 : 0) +
    (props.merchant ? 1 : 0);

  return (
    <div className="flex items-center justify-between">
      <FilterPaymentLinkButton
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
        isFiltersVisible={isFiltersVisible}
        onVisibilityChange={setIsFiltersVisible}
      >
        <FilterPaymentLinkContent
          onClose={() => setIsFiltersVisible(false)}
          identifierIn={props.identifier}
          statusIn={props.status}
          merchantIn={props.merchant}
          onFilter={handleFilter}
        />
      </FilterPaymentLinkButton>
      <Button asChild className="shrink-0">
        <Link href="/portal/paymentLink/0">
          <Plus className="h-4 w-4" />
          Novo Link de Pagamento
        </Link>
      </Button>
    </div>
  );
}
