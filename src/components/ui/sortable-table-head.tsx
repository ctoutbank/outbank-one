import { TableHead } from "@/components/ui/table";

// Interface para o componente de cabeçalho de tabela ordenável
export interface SortableTableHeadProps {
  columnId: string;
  name: string;
  sortable: boolean;
  onSort: (columnId: string) => void;
  getSortIcon: (columnId: string) => React.ReactNode;
}

export function SortableTableHead({
  columnId,
  name,
  sortable,
  onSort,
  getSortIcon,
}: SortableTableHeadProps) {
  const handleClick = () => {
    if (sortable) {
      onSort(columnId);
    }
  };

  return (
    <TableHead
      className={sortable ? "cursor-pointer hover:bg-gray-50" : ""}
      onClick={handleClick}
    >
      {name}
      {sortable && getSortIcon(columnId)}
    </TableHead>
  );
}
