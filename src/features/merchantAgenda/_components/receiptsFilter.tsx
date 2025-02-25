"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CalendarIcon, SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

type ListFilterProps = {
  search?: string;
  date?: string;
  pageName?: string;
  linkText?: string | null;
  linkHref?: string | null;
  CalendarView: boolean;
};

export default function ListFilter(props: ListFilterProps) {
  const [search, setSearch] = React.useState<string>(props.search || "");
  const [date, setDate] = React.useState<string>(props.date || "");
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const handleFilter = () => {
    params.set("search", search);
    params.set("date", date);
    router.push(`/portal/receipts?${params.toString()}`);
  };

  function handleClearFilter() {
    setSearch("");
    setDate("");
    params.delete("search");
    params.delete("date");
    router.push(`/portal/receipts?${params.toString()}`);
  }

  return (
    <div className="basis-1/2 my-6">
      <div
        id="row1"
        className="relative flex flex-col sm:flex-row gap-4 mt-4 justify-between"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Busque por um estabelecimento"
              className="w-full rounded-lg bg-background pl-8 md:w-[250px] lg:w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {props.CalendarView == false && (
            <div className="relative">
              <CalendarIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                className="w-full rounded-lg bg-background pl-8 md:w-[200px]"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]} // Limita até a data atual
              />
            </div>
          )}
          <Button onClick={handleFilter}>Pesquisa</Button>
          <Button variant="secondary" onClick={handleClearFilter}>
            Limpar
          </Button>
        </div>
      </div>
    </div>
  );
}
