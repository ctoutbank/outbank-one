"use client";

import { FormControl, FormField } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SolicitationFeeProductTypeList } from "@/lib/lookuptables/lookuptables";
import { brandList } from "@/lib/lookuptables/lookuptables-transactions";
import { CSSProperties } from "react";

interface FeesSectionProps {
  control: any;
  isReadOnly?: boolean;
  isNewSolicitation?: boolean;
}

const getCardImage = (cardName: string): string => {
  const cardMap: { [key: string]: string } = {
    MASTERCARD: "/mastercard.svg",
    VISA: "/visa.svg",
    ELO: "/elo.svg",
    AMERICAN_EXPRESS: "/american-express.svg",
    HIPERCARD: "/hipercard.svg",
    AMEX: "/american-express.svg",
    CABAL: "/cabal.svg",
  };
  return cardMap[cardName] || "";
};

// Style to remove all focus outlines and borders
const noFocusStyle: CSSProperties = {
  outline: "none",
  boxShadow: "none",
  border: "none",
};

// Custom percentage input component
function PercentageInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  className?: string;
}) {
  // Handle the input change and append % if needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Remove any % symbol if present
    newValue = newValue.replace(/%/g, "");

    // Only allow numbers and a single decimal point
    newValue = newValue.replace(/[^\d.,]/g, "");

    // Replace dots with commas for decimal separator
    newValue = newValue.replace(/\./g, ",");

    // Ensure only one decimal separator
    const parts = newValue.split(",");
    if (parts.length > 2) {
      newValue = parts[0] + "," + parts.slice(1).join("");
    }

    onChange(newValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value ? `${value}%` : ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        style={noFocusStyle}
      />
    </div>
  );
}

// Custom currency input component
function CurrencyInput({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (e: any) => void;
  placeholder: string;
  className?: string;
}) {
  // Handle the input change and add R$ if needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Remove any R$ symbol if present
    newValue = newValue.replace(/R\$\s?/g, "");

    // Only allow numbers and a single decimal point
    newValue = newValue.replace(/[^\d.,]/g, "");

    // Replace dots with commas for decimal separator
    newValue = newValue.replace(/\./g, ",");

    // Ensure only one decimal separator
    const parts = newValue.split(",");
    if (parts.length > 2) {
      newValue = parts[0] + "," + parts.slice(1).join("");
    }

    onChange(newValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={value ? `R$ ${value}` : ""}
        onChange={handleChange}
        placeholder={placeholder}
        className={className}
        style={noFocusStyle}
      />
    </div>
  );
}

// BrandTables component for displaying brand fees
function BrandTables({
  control,
  isReadOnly = false,
  isNewSolicitation = false,
}: {
  control: any;
  isReadOnly?: boolean;
  isNewSolicitation?: boolean;
}) {
  // Define payment types as columns
  const paymentTypes = SolicitationFeeProductTypeList;

  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="sticky left-0 z-10 bg-white text-sm">
              Bandeiras
            </TableHead>
            {paymentTypes.map((type, index) => (
              <>
                <TableHead
                  key={`${type.value}-fee-${index}`}
                  className="text-center min-w-[100px] text-sm"
                >
                  {type.label}{" "}
                </TableHead>
                {!isNewSolicitation && (
                  <TableHead
                    key={`${type.value}-feeAdmin-${index}`}
                    className="text-center min-w-[100px] text-sm"
                  >
                    {type.label}{" "}
                  </TableHead>
                )}
              </>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {brandList.map((brand, brandIndex) => (
            <TableRow key={brand.value}>
              <TableCell className="font-medium sticky left-0 z-10 bg-white">
                <div className="flex items-center gap-2">
                  {getCardImage(brand.value) && (
                    <img
                      src={getCardImage(brand.value)}
                      alt={brand.label}
                      width={40}
                      height={24}
                      className="object-contain"
                    />
                  )}
                  {brand.label}
                </div>
              </TableCell>
              {paymentTypes.map((type, typeIndex) => (
                <>
                  <TableCell
                    key={`${brand.value}-${type.value}-fee-${typeIndex}`}
                    className="p-1 text-center"
                  >
                    {isReadOnly ? (
                      <div className="rounded-full py-1 px-3 inline-block w-[70px] text-center bg-gray-100">
                        <span>
                          {control._formValues.brands?.[brandIndex]
                            ?.productTypes?.[typeIndex]?.fee
                            ? `${control._formValues.brands[brandIndex].productTypes[typeIndex].fee}%`
                            : "-"}
                        </span>
                      </div>
                    ) : (
                      <FormField
                        control={control}
                        name={`brands.${brandIndex}.productTypes.${typeIndex}.fee`}
                        render={({ field }) => (
                          <FormControl>
                            <div className="rounded-full py-1 px-3 inline-block w-[70px] text-center bg-gray-100">
                              <PercentageInput
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="0%"
                                className="border-0 p-0 h-auto text-center w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                              />
                            </div>
                          </FormControl>
                        )}
                      />
                    )}
                  </TableCell>
                  {!isNewSolicitation && (
                    <TableCell
                      key={`${brand.value}-${type.value}-feeAdmin-${typeIndex}`}
                      className="p-1 text-center"
                    >
                      {isReadOnly ? (
                        <div className="rounded-full py-1 px-3 inline-block w-[70px] text-center bg-yellow-100">
                          <span>
                            {control._formValues.brands?.[brandIndex]
                              ?.productTypes?.[typeIndex]?.feeAdmin
                              ? `${control._formValues.brands[brandIndex].productTypes[typeIndex].feeAdmin}%`
                              : "-"}
                          </span>
                        </div>
                      ) : (
                        <FormField
                          control={control}
                          name={`brands.${brandIndex}.productTypes.${typeIndex}.feeAdmin`}
                          render={({ field }) => (
                            <FormControl>
                              <div className="rounded-full py-1 px-3 inline-block w-[70px] text-center bg-yellow-100">
                                <PercentageInput
                                  value={field.value}
                                  onChange={field.onChange}
                                  placeholder="0%"
                                  className="border-0 p-0 h-auto text-center w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                                />
                              </div>
                            </FormControl>
                          )}
                        />
                      )}
                    </TableCell>
                  )}
                </>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PIX Fees Section */}
      <div className="mt-12 mb-6">
        <h3 className="text-lg font-medium mb-4">PIX</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h4 className="font-medium mb-2">MDR</h4>
            <div className="flex gap-2">
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {isReadOnly ? (
                  <span>
                    {control._formValues.pixMdr
                      ? `${control._formValues.pixMdr}%`
                      : "-"}
                  </span>
                ) : (
                  <FormField
                    control={control}
                    name="pixMdr"
                    render={({ field }) => (
                      <FormControl>
                        <PercentageInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0,01%"
                          className="border-0 p-0 h-auto w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                        />
                      </FormControl>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Custo Mínimo</h4>
            <div className="flex gap-2">
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {isReadOnly ? (
                  <span>
                    {control._formValues.pixMinCost
                      ? `R$ ${control._formValues.pixMinCost}`
                      : "-"}
                  </span>
                ) : (
                  <FormField
                    control={control}
                    name="pixMinCost"
                    render={({ field }) => (
                      <FormControl>
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="R$ 0,09"
                          className="border-0 p-0 h-auto w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                        />
                      </FormControl>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Custo Máximo</h4>
            <div className="flex gap-2">
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {isReadOnly ? (
                  <span>
                    {control._formValues.pixMaxCost
                      ? `R$ ${control._formValues.pixMaxCost}`
                      : "-"}
                  </span>
                ) : (
                  <FormField
                    control={control}
                    name="pixMaxCost"
                    render={({ field }) => (
                      <FormControl>
                        <CurrencyInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="R$ 0,09"
                          className="border-0 p-0 h-auto w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                        />
                      </FormControl>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Antecipação</h4>
            <div className="flex gap-2">
              <div className="rounded-full py-2 px-4 bg-gray-100 inline-block">
                {isReadOnly ? (
                  <span>
                    {control._formValues.pixAnticipation
                      ? `${control._formValues.pixAnticipation}%`
                      : "-"}
                  </span>
                ) : (
                  <FormField
                    control={control}
                    name="pixAnticipation"
                    render={({ field }) => (
                      <FormControl>
                        <PercentageInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="1,67%"
                          className="border-0 p-0 h-auto w-full bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-0"
                        />
                      </FormControl>
                    )}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeesSection({
  control,
  isReadOnly = false,
  isNewSolicitation = false,
}: FeesSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">Taxas</h3>

      {/* Legend for input colors - only show when not a new solicitation */}
      {!isNewSolicitation && (
        <div className="flex flex-col gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-100"></div>
            <span className="text-sm text-gray-600">Solicitado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-100"></div>
            <span className="text-sm text-gray-600">
              Oferecido pelo Outbank
            </span>
          </div>
        </div>
      )}

      <BrandTables
        control={control}
        isReadOnly={isReadOnly}
        isNewSolicitation={isNewSolicitation}
      />
    </div>
  );
}
