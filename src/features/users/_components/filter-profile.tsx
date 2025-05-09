"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {useEffect, useRef, useState} from "react";
import { FilterProfileButton } from "./filter-profile-button";
import { FilterProfileContent } from "./filter-profile-content";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

type ProfileFilterProps = {
  profileName?: string;
  newButtonUrl?: string; // Optional prop for the "New" button URL
  newButtonLabel?: string; // Optional prop for the "New" button label
  showNewButton?: boolean; // Optional prop to control "New" button visibility
};

export function ProfileFilter({
  profileName,
  newButtonUrl = "/portal/profile/0",
  newButtonLabel = "Novo Perfil",
  showNewButton = true,
}: ProfileFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);


  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFiltersVisible(false);
      }
    }

    if (isFiltersVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFiltersVisible]);

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
    <div ref={filterRef} className="flex items-center justify-between">
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