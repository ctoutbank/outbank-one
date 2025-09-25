"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

// Função para calcular escala dinâmica
function calculateScale(maxValue: number) {
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
  const normalized = maxValue / magnitude;

  let scaledMax;
  if (normalized <= 1) scaledMax = magnitude;
  else if (normalized <= 2) scaledMax = 2 * magnitude;
  else if (normalized <= 5) scaledMax = 5 * magnitude;
  else scaledMax = 10 * magnitude;

  return scaledMax;
}

// Função para gerar ticks do eixo X
function generateTicks(maxValue: number, tickCount = 5) {
  const ticks = [];
  const step = maxValue / (tickCount - 1);

  for (let i = 0; i < tickCount; i++) {
    ticks.push(Math.round(step * i));
  }

  return ticks;
}

interface BarChartProps {
  data: { name: string; value: number }[];
}

export default function BarChart({ data }: BarChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(400);

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    const observer = new (window as any).ResizeObserver(updateWidth);
    const currentRef = containerRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Responsividade baseada na largura do container
  let fontSize = 14;
  let barHeight = 24;
  let labelWidth = 80;
  let valueWidth = 24;
  let gap = 8;
  let spaceY = 8;
  let xAxisFont = 12;
  let xAxisMarginTop = 16;

  if (containerWidth < 600) {
    fontSize = 12;
    barHeight = 18;
    labelWidth = 56;
    valueWidth = 18;
    gap = 6;
    spaceY = 5;
    xAxisFont = 10;
    xAxisMarginTop = 10;
  }
  if (containerWidth < 400) {
    fontSize = 10;
    barHeight = 12;
    labelWidth = 32;
    valueWidth = 14;
    gap = 4;
    spaceY = 2;
    xAxisFont = 8;
    xAxisMarginTop = 6;
  }

  const dataMaxValue = Math.max(...data.map((item) => item.value));
  const chartMaxValue = calculateScale(dataMaxValue);
  const xAxisTicks = generateTicks(chartMaxValue);

  return (
    <div ref={containerRef} className="w-full">
      <div style={{ display: "flex", flexDirection: "column", gap: spaceY }}>
        {data.map((item, index) => (
          <div
            key={index}
            style={{ display: "flex", alignItems: "center", gap }}
          >
            {/* Label */}
            <div
              style={{
                width: labelWidth,
                fontSize,
                textAlign: "right",
                lineHeight: 1.1,
              }}
              className="text-gray-600 font-medium leading-tight truncate"
            >
              <span className="hidden sm:inline">{item.name}</span>
              <span className="sm:hidden">
                {item.name.length > 10
                  ? `${item.name.substring(0, 10)}...`
                  : item.name}
              </span>
            </div>

            {/* Bar container */}
            <div className="flex-1 relative min-w-0">
              {/* Bar + Tooltip */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="bg-orange-500 rounded-md transition-all duration-300 ease-out hover:bg-orange-600 cursor-pointer relative"
                    style={{
                      width: `${(item.value / chartMaxValue) * 100}%`,
                      height: barHeight,
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {item.name}: {item.value} terminais
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>

      {/* X-axis */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap,
          marginTop: xAxisMarginTop,
        }}
      >
        <div style={{ width: labelWidth }}></div>
        <div className="flex-1 relative min-w-0">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: xAxisFont,
              color: "#6b7280",
              marginTop: 2,
            }}
          >
            {xAxisTicks.map((tick, index) => (
              <span key={index}>{tick}</span>
            ))}
          </div>
          {/* Grid lines */}
          <div className="absolute top-0 w-full h-px bg-gray-200"></div>
        </div>
        <div style={{ width: valueWidth }}></div>
      </div>
    </div>
  );
}
