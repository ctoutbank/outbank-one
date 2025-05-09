"use client";

import { TerminalsFilterContent } from "@/features/terminals/_components/terminals-filter-content";
import { useRouter, useSearchParams } from "next/navigation";
import {useEffect, useRef, useState} from "react";
import { TerminalsFilterButton } from "./terminals-filter-button";

type TerminalsFilterProps = {
  dateFromIn?: string;
  dateToIn?: string;
  numeroLogicoIn?: string;
  numeroSerialIn?: string;
  estabelecimentoIn?: string;
  modeloIn?: string;
  statusIn?: string;
  provedorIn?: string;
};

export function TerminalsFilter(props: TerminalsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString() || "");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  // Log para debug quando o estado muda
  console.log("Estado dos filtros:", isFiltersVisible);



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


  const handleFilter = (filters: {
    dateFrom?: Date;
    dateTo?: Date;
    numeroLogico: string;
    numeroSerial: string;
    estabelecimento: string;
    modelo: string;
    status: string;
    provedor: string;
  }) => {
    console.log(filters.dateFrom, filters.dateTo)
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
    if (filters.numeroLogico) {
      params.set("numeroLogico", filters.numeroLogico);
    } else {
      params.delete("numeroLogico");
    }
    if (filters.numeroSerial) {
      params.set("numeroSerial", filters.numeroSerial);
    } else {
      params.delete("numeroSerial");
    }
    if (filters.estabelecimento) {
      params.set("estabelecimento", filters.estabelecimento);
    } else {
      params.delete("estabelecimento");
    }
    if (filters.modelo) {
      params.set("modelo", filters.modelo);
    } else {
      params.delete("modelo");
    }
    if (filters.status) {
      params.set("status", filters.status);
    } else {
      params.delete("status");
    }
    if (filters.provedor) {
      params.set("provedor", filters.provedor);
    } else {
      params.delete("provedor");
    }
    console.log(params.toString())
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleClearFilters = () => {
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("numeroLogico");
    params.delete("numeroSerial");
    params.delete("estabelecimento");
    params.delete("modelo");
    params.delete("status");
    params.delete("provedor");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const activeFiltersCount =
    (props.dateFromIn ? 1 : 0) +
    (props.dateToIn ? 1 : 0) +
    (props.numeroLogicoIn ? 1 : 0) +
    (props.numeroSerialIn ? 1 : 0) +
    (props.estabelecimentoIn ? 1 : 0) +
    (props.modeloIn ? 1 : 0) +
    (props.statusIn ? 1 : 0) +
    (props.provedorIn ? 1 : 0);

  return (
      <div ref={filterRef}>
    <TerminalsFilterButton
      activeFiltersCount={activeFiltersCount}
      onClearFilters={handleClearFilters}
      isFiltersVisible={isFiltersVisible}
      onVisibilityChange={setIsFiltersVisible}
    >
      <TerminalsFilterContent
        dateFromIn={props.dateFromIn ? new Date(props.dateFromIn) : undefined}
        dateToIn={props.dateToIn ? new Date(props.dateToIn) : undefined}
        numeroLogicoIn={props.numeroLogicoIn}
        numeroSerialIn={props.numeroSerialIn}
        estabelecimentoIn={props.estabelecimentoIn}
        modeloIn={props.modeloIn}
        statusIn={props.statusIn}
        provedorIn={props.provedorIn}
        onFilter={handleFilter}
        onClose={() => setIsFiltersVisible(false)}
      />
    </TerminalsFilterButton>
      </div>
  );
}
