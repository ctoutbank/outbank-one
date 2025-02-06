import { Column } from "@tanstack/react-table";
import { ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  title: string;
}

const SortableHeader = <TData,>({ column, title }: SortableHeaderProps<TData>) => {
  const isSorted = column.getIsSorted();

  return (
    <button
      onClick={() => column.toggleSorting()}
      className="flex items-center gap-2 font-medium"
    >
      {title}
      {isSorted === "asc" ? (
        <ArrowUp className="h-4 w-4" />
      ) : isSorted === "desc" ? (
        <ArrowDown className="h-4 w-4" />
      ) : (
        <ArrowUpDown className="h-4 w-4" />
      )}
    </button>
  );
};

export default SortableHeader;