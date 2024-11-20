import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface CardValueProps {
  title: string;
  description: string;
  value: number;
  previousValue?: number;
  valueType?: "currency" | "number";
  percentage: string;
}

export default function CardValue({
  title,
  description,
  value,
  previousValue,
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
        <Tooltip>
          <TooltipTrigger>
            <Badge
              variant="outline"
              className={`${
                parseFloat(percentage) > 0 ? "bg-green-500/20" : "bg-red-500/20"
              } font-light mt-1`}
            >
              {parseFloat(percentage) > 0 ? (
                <TrendingUp className="h-4 w-4 mr-2" />
              ) : (
                <TrendingDown className="h-4 w-4 mr-2" />
              )}
              {percentage}%
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {valueType === "currency"
                ? Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(previousValue ?? 0)
                : (previousValue ?? 0).toLocaleString()}
            </p>
          </TooltipContent>
        </Tooltip>
      </CardContent>
    </Card>
  );
}
