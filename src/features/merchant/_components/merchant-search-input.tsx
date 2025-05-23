"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useState } from "react";

export function MerchantSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams?.get("establishment") || "";
  const [value, setValue] = useState(initialValue);

  const executeSearch = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set("establishment", value);
    } else {
      params.delete("establishment");
    }
    router.push(`/portal/merchants?${params.toString()}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Pesquisar"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-72"
      />
      <Button onClick={executeSearch} variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
