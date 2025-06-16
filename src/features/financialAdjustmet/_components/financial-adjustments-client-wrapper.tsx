"use client";

import { FinancialAdjustmentsFilter } from "./financial-adjustments-filter";

interface FinancialAdjustmentsClientWrapperProps {
  searchIn?: string;
  typeIn?: string;
  reasonIn?: string;
  activeIn?: string;
  creationDateIn?: string;
}

export function FinancialAdjustmentsClientWrapper({
  searchIn,
  typeIn,
  reasonIn,
  activeIn,
  creationDateIn,
}: FinancialAdjustmentsClientWrapperProps) {
  // Converter a string de data para um objeto Date se existir
  const creationDate = creationDateIn ? new Date(creationDateIn) : undefined;

  return (
    <FinancialAdjustmentsFilter
      searchIn={searchIn}
      typeIn={typeIn}
      reasonIn={reasonIn}
      activeIn={activeIn}
      creationDateIn={creationDate}
    />
  );
}
