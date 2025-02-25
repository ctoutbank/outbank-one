import type React from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Badge } from "../ui/badge"
import { Card, CardContent } from "../ui/card"
import { Separator } from "../ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

interface CardValueProps {
  title: string
  description: string
  value: number
  previousValue?: number
  valueType?: "currency" | "number"
  percentage: string
  icon?: React.ReactNode
}

export default function CardValue({
  title,
  description,
  value,
  previousValue,
  valueType = "number",
  percentage,
  icon,
}: CardValueProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {icon && <div className="text-zinc-500">{icon}</div>}
            <span className="text-sm font-medium text-zinc-600">{title}</span>
          </div>
          <span className="text-2xl font-semibold text-zinc-900">
            {valueType === "currency"
              ? Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(value)
              : value.toLocaleString()}
          </span>
        </div>
        <Separator className="mb-3" />
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant="outline"
                className={`${
                  Number.parseFloat(percentage) > 0 ? "bg-emerald-500/20" : "bg-red-500/20"
                } font-medium px-2 py-1 h-auto`}
              >
                {Number.parseFloat(percentage) > 0 ? (
                  <TrendingUp className="h-4 w-4 mr-2" />
                ) : (
                  <TrendingDown className="h-4 w-4 mr-2" />
                )}
                {percentage}%
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Previous:{" "}
                {valueType === "currency"
                  ? Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(previousValue ?? 0)
                  : (previousValue ?? 0).toLocaleString()}
              </p>
            </TooltipContent>
          </Tooltip>
          {description && <span className="text-xs text-zinc-600">{description}</span>}
        </div>
      </CardContent>
    </Card>
  )
}

