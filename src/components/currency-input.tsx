"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { NumericFormat } from "react-number-format";

const CurrencyInput = forwardRef<
  HTMLInputElement,
  React.ComponentPropsWithoutRef<typeof NumericFormat>
>(({ className, ...props }, ref) => {
  return (
    <NumericFormat
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      prefix="R$ "
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      getInputRef={ref}
      {...props}
    />
  );
});

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
