"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterUserButton } from "./filter-user-button";
import { FilterUserContent } from "./filter-user-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DD } from "../server/users";


type UserFilterProps = {
  // Filter values
  merchant?: string;
  customer?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profile?: string;

  // Dropdown options
  merchantOptions?: DD[];
  customerOptions?: DD[];
  profileOptions?: DD[];

  // Optional props for customization
  newButtonUrl?: string;
  newButtonLabel?: string;
  showNewButton?: boolean;
};

export function UserFilter({
  // Filter values
  merchant,
  customer,
  email,
  firstName,
  lastName,
  profile,

  // Dropdown options
  merchantOptions = [],
  customerOptions = [],
  profileOptions = [],

  // Optional props
  newButtonUrl = "/portal/user/0",
  newButtonLabel = "Novo Usuário",
  showNewButton = true,
}: UserFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: {
    merchant: string;
    customer: string;
    email: string;
    firstName: string;
    lastName: string;
    profile: string;
  }) => {
    // Set or delete params based on filter values
    if (filters.merchant) {
      params.set("merchant", filters.merchant);
    } else {
      params.delete("merchant");
    }

    if (filters.customer) {
      params.set("customer", filters.customer);
    } else {
      params.delete("customer");
    }

    if (filters.email) {
      params.set("email", filters.email);
    } else {
      params.delete("email");
    }

    if (filters.firstName) {
      params.set("firstName", filters.firstName);
    } else {
      params.delete("firstName");
    }

    if (filters.lastName) {
      params.set("lastName", filters.lastName);
    } else {
      params.delete("lastName");
    }

    if (filters.profile) {
      params.set("profile", filters.profile);
    } else {
      params.delete("profile");
    }

    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("merchant");
    params.delete("customer");
    params.delete("email");
    params.delete("firstName");
    params.delete("lastName");
    params.delete("profile");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (merchant ? 1 : 0) +
    (customer ? 1 : 0) +
    (email ? 1 : 0) +
    (firstName ? 1 : 0) +
    (lastName ? 1 : 0) +
    (profile ? 1 : 0);

  return (
    <div className="flex items-center justify-between">
      <FilterUserButton
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
        isFiltersVisible={isFiltersVisible}
        onVisibilityChange={setIsFiltersVisible}
      >
        <FilterUserContent
          onClose={() => setIsFiltersVisible(false)}
          merchantIn={merchant}
          customerIn={customer}
          emailIn={email}
          firstNameIn={firstName}
          lastNameIn={lastName}
          profileIn={profile}
          merchantOptions={merchantOptions}
          customerOptions={customerOptions}
          profileOptions={profileOptions}
          onFilter={handleFilter}
        />
      </FilterUserButton>

      {showNewButton && (
        <Button asChild className="shrink-0">
          <Link href={newButtonUrl}>
            <Plus className="h-4 w-4 mr-2" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
