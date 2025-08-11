"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useRef, useState } from "react";

interface LineChartProps {
  monthlyData: { month: string; value: number }[];
}

export default function LineChart({ monthlyData }: LineChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 200 });

  useEffect(() => {
    function updateDimensions() {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        let height = 200;
        if (width < 400) height = 150;
        if (width < 350) height = 120;
        setDimensions({ width: Math.max(width, 200), height });
      }
    }
    updateDimensions();
    const observer = new (window as any).ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const maxValue = Math.max(...monthlyData.map((item) => item.value));
  const minValue = Math.min(...monthlyData.map((item) => item.value));
  const { width: chartWidth, height: chartHeight } = dimensions;

  // Função para calcular posição Y do ponto
  const getYPosition = (value: number) => {
    const range = maxValue - minValue || 1;
    const normalizedValue = (value - minValue) / range;
    return chartHeight - normalizedValue * (chartHeight - 40) - 20;
  };

  // Função para calcular posição X do ponto
  const getXPosition = (index: number) => {
    const padding = chartWidth < 350 ? 30 : 40;
    return (
      (index / (monthlyData.length - 1)) * (chartWidth - padding * 2) + padding
    );
  };

  // Gerar pontos para a linha
  const points = monthlyData.map((item, index) => ({
    x: getXPosition(index),
    y: getYPosition(item.value),
    value: item.value,
  }));

  // Gerar path da linha
  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? "M" : "L";
    return `${path} ${command} ${point.x} ${point.y}`;
  }, "");

  const padding = chartWidth < 350 ? 30 : 40;
  const pointRadius = chartWidth < 350 ? 3 : 4;

  return (
    <div ref={containerRef} className="relative w-full">
      <svg
        width="100%"
        height={chartHeight + 60}
        viewBox={`0 0 ${chartWidth} ${chartHeight + 60}`}
        className="overflow-visible mx-auto"
        preserveAspectRatio="none"
      >
        {/* Grid lines horizontais */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const y = chartHeight - ratio * (chartHeight - 40) - 20;
          return (
            <line
              key={index}
              x1={padding}
              y1={y}
              x2={chartWidth - padding}
              y2={y}
              stroke="#f0f0f0"
              strokeWidth={1}
            />
          );
        })}

        {/* Linha principal */}
        <path
          d={pathData}
          fill="none"
          stroke="#f97316"
          strokeWidth={chartWidth < 350 ? 1.5 : 2}
          className="transition-all duration-1000 ease-out"
        />

        {/* Pontos */}
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={pointRadius}
            fill="#f97316"
            stroke="white"
            strokeWidth={2}
            className={`transition-all duration-300 ease-out pointer-events-none`}
          />
        ))}

        {/* Áreas de hover invisíveis para facilitar interação */}
        {points.map((point, index) => (
          <circle
            key={`hover-${index}`}
            cx={point.x}
            cy={point.y}
            r={chartWidth < 350 ? 12 : 15}
            fill="transparent"
            className="cursor-pointer pointer-events-none"
          />
        ))}

        {/* Labels dos meses */}
        {monthlyData.map((item, index) => (
          <text
            key={index}
            x={getXPosition(index)}
            y={chartHeight + 20}
            textAnchor="middle"
            className={`${chartWidth < 350 ? "text-[8px]" : "text-[10px]"} fill-gray-500`}
          >
            {item.month}
          </text>
        ))}
      </svg>
      {/* Tooltips HTML sobrepostos */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: chartWidth,
          height: chartHeight + 60,
          pointerEvents: "none",
        }}
      >
        {points.map((point, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div
                style={{
                  position: "absolute",
                  left: point.x - (chartWidth < 350 ? 12 : 15),
                  top: point.y - (chartWidth < 350 ? 12 : 15),
                  width: chartWidth < 350 ? 24 : 30,
                  height: chartWidth < 350 ? 24 : 30,
                  cursor: "pointer",
                  pointerEvents: "auto",
                  background: "transparent",
                }}
              />
            </TooltipTrigger>
            <TooltipContent side="top" align="center">
              {monthlyData[index].month}: {point.value}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
