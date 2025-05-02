"use client";

import React from "react";
import { Plus, SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type ListFilterProps = {
  search?: string;
  pageName?: string;
  linkText?: string | null;
    linkHref?: string | null;
  
};

export default function ListFilter(props: ListFilterProps) 
{
  const [search, setSearch] = React.useState<string>(props.search || "");
    const [linkText] = React.useState<string | null>(props.linkText || null);
    const [linkHref] = React.useState<string | null>(props.linkHref || null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams || "");

  const handleFilter = () => {
    params.set("search", search);
    params.set("page", "1");
    //add new objects in searchParams
    router.push(`/${props.pageName}?${params.toString()}`);
  };

  function handleClearFilter() {
    setSearch("");
    params.delete("search");
    params.set("page", "1");
    router.push(`/${props.pageName}?${params.toString()}`);
  }

  return (
    <div className="basis-1/2 my-4">
  <div id="row1" className="relative flex gap-4 mt-4 justify-between">
    <div className="flex gap-4">
      <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Pesquisa..."
        className="w-full rounded-lg bg-background pl-8 md:w-[30px] lg:w-[500px] max-w-[850px]"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleFilter}>Pesquisa</Button>
      <Button variant={"secondary"} onClick={handleClearFilter}>
       Limpar
      </Button>
    </div>
    <div id="row2" className="flex gap-4 justify-end">
      {linkHref && (
        <Link href={linkHref}>
          <Button>
            <Plus className="h-4 w-4" />
            {linkText}
          </Button>
        </Link>
      )}
    </div>
  </div>
</div>
  );
}
