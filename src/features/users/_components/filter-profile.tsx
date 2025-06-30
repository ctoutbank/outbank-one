"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FilterProfileButton } from "./filter-profile-button";
import { FilterProfileContent } from "./filter-profile-content";

type ProfileFilterProps = {
  profileName?: string;
  newButtonUrl?: string; // Optional prop for the "New" button URL
  newButtonLabel?: string; // Optional prop for the "New" button label
  showNewButton?: boolean; // Optional prop to control "New" button visibility
};

export function ProfileFilter({
  profileName,
}: ProfileFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  const handleFilter = (filters: { profileName: string }) => {
    if (filters.profileName) {
      params.set("profileName", filters.profileName);
    } else {
      params.delete("profileName");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("profileName");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount = profileName ? 1 : 0;

  return (
    <div className="flex items-center justify-between">
      <FilterProfileButton
        activeFiltersCount={activeFiltersCount}
        onClearFilters={handleClearFilters}
        isFiltersVisible={isFiltersVisible}
        onVisibilityChange={setIsFiltersVisible}
      >
        <FilterProfileContent
          onClose={() => setIsFiltersVisible(false)}
          profileNameIn={profileName}
          onFilter={handleFilter}
        />
      </FilterProfileButton>
      
    </div>
  );
}