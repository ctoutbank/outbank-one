import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface CardValueProps {
  title: string;
  description: string;
  value: number;
  valueType?: "currency" | "number";
  percentage: number;
}

export default function CardValue({
  title,
  description,
  value,
  valueType = "number",
  percentage,
}: CardValueProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-light">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <h1 className="text-2xl  ">
          {valueType === "currency"
            ? Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(value)
            : value.toLocaleString()}
        </h1>
        <Badge
          variant="outline"
          className={`${
            percentage > 0 ? "bg-green-500/20" : "bg-red-500/20"
          } font-light mt-1`}
        >
          {percentage > 0 ? (
            <TrendingUp className="h-4 w-4 mr-2" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-2" />
          )}
          {percentage}%
        </Badge>
      </CardContent>
    </Card>
  );
}
