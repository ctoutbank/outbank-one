import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { Input } from "./input";

interface Framework {
  value: string;
  label: string;
}

interface ComboboxDemoProps {
  frameworks: Framework[];
  onChange: (value: string) => void;
  value: string;
}

export default function ComboboxDemo({
  frameworks,
  onChange,
  value,
}: ComboboxDemoProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState<Framework[]>([]);

  React.useEffect(() => {
    function filterList() {
      return frameworks.filter((framework) =>
        framework.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filterList());
  }, [searchTerm, frameworks]);

  return (
    <div className="flex items-center justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between mb-4"
          >
            {value != undefined && value != "" && value != "0"
              ? frameworks.find((framework) => framework.value === value)?.label
              : "Selecione..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 pointer-events-auto" onMouseDown={(e) => e.stopPropagation()}>
          <Command>
            <Input
              className="w-full"
              placeholder="Search item..."
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
            {filteredItems.length === 0 && (
              <CommandEmpty>Not found.</CommandEmpty>
            )}

            <CommandList>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <CommandItem
                    key={item.value}
                    value={item.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {item.label}
                  </CommandItem>
                ))
              ) : (
                <CommandItem disabled>No item found.</CommandItem>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
