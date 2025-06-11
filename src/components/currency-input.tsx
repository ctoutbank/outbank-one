"use client";

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
      className={className}
      getInputRef={ref}
      {...props}
    />
  );
});

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };
