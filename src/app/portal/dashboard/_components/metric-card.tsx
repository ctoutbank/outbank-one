"use client";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import React from "react";

interface MetricCardProps {
  title: string;
  value: string;
  growth: string;
  icon: any;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

export function MetricCard({
  title,
  value,
  growth,
  icon: Icon,
  color = "blue"
}: MetricCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon size={20} />
        </div>
        <div className="text-sm text-green-600 font-medium">
          +{growth}%
        </div>
      </div>
      <div className="mt-4">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{title}</div>
      </div>
    </div>
  );
}
