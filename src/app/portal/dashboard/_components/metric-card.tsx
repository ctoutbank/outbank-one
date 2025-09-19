"use client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  growthPercentage?: number;
  icon: React.ReactNode;
  color?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  growthPercentage,
  icon,
  color = "blue"
}: MetricCardProps) {
  const formatGrowthPercentage = (percentage: number) => {
    const isPositive = percentage >= 0;
    const formattedPercentage = Math.abs(percentage).toFixed(1);
    
    return {
      value: `${isPositive ? '+' : '-'}${formattedPercentage}%`,
      isPositive,
      color: isPositive ? 'text-green-600' : 'text-red-600',
      bgColor: isPositive ? 'bg-green-50' : 'bg-red-50',
      icon: isPositive ? TrendingUp : TrendingDown
    };
  };

  const growth = growthPercentage !== undefined ? formatGrowthPercentage(growthPercentage) : null;

  return (
    <Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-3">
          {/* Header with icon */}
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-${color}-50`}>
              {icon}
            </div>
            {growth && (
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${growth.bgColor}`}>
                <growth.icon className={`h-3 w-3 ${growth.color}`} />
                <span className={`text-xs font-medium ${growth.color}`}>
                  {growth.value}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="text-sm font-medium text-gray-600">
            {title}
          </div>

          {/* Value */}
          <div className="text-2xl font-bold text-gray-900">
            {value}
          </div>

          {/* Subtitle */}
          <div className="text-xs text-gray-500">
            {subtitle}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
