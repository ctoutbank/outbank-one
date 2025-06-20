"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

type MerchantSuggestion = {
  id: number | bigint;
  name: string | null;
  corporateName: string | null;
  slug: string | null;
  idDocument: string | null;
};

interface MerchantSearchInputProps {
  suggestions: MerchantSuggestion[];
}

export function MerchantSearchInput({ suggestions }: MerchantSearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialValue = searchParams?.get("establishment") || "";
  const [value, setValue] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filtrar sugestões no lado do cliente
  const filteredSuggestions = useMemo(() => {
    if (!value || value.trim().length < 1) {
      return [];
    }

    const searchTerm = value.toLowerCase();
    return suggestions
      .filter((suggestion) => {
        const name = suggestion.name?.toLowerCase() || "";
        const corporateName = suggestion.corporateName?.toLowerCase() || "";
        return name.includes(searchTerm) || corporateName.includes(searchTerm);
      })
      .slice(0, 10);
  }, [value, suggestions]);

  const executeSearch = () => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    if (value) {
      params.set("establishment", value);
    } else {
      params.delete("establishment");
    }
    router.push(`/portal/merchants?${params.toString()}`);
    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setShowSuggestions(newValue.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: MerchantSuggestion) => {
    const merchantName = suggestion.name || "";
    setValue(merchantName);
    setShowSuggestions(false);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("establishment", merchantName);
    router.push(`/portal/merchants?${params.toString()}`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
        handleSuggestionClick(filteredSuggestions[selectedIndex]);
      } else {
        executeSearch();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > -1 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  // Hide suggestions when clicking outside - ÚNICO useEffect necessário
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        suggestionsRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center gap-2">
      <div className="relative w-72">
        <Input
          ref={inputRef}
          placeholder="Pesquisar"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredSuggestions.length > 0 && value.trim().length > 0) {
              setShowSuggestions(true);
            }
          }}
          className="w-full"
        />

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg"
          >
            <div className="max-h-36 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id.toString()}
                  className={cn(
                    "p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0",
                    selectedIndex === index && "bg-blue-50"
                  )}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    {suggestion.name || "Nome não disponível"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.corporateName || "Razão social não disponível"}{" "}
                    • {suggestion.idDocument || "Documento não disponível"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button onClick={executeSearch} variant="outline" size="icon">
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
