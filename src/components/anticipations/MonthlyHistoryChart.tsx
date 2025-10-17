"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        Tooltip,
        Legend,
        } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const Bar = dynamic(
    () => import('react-chartjs-2').then((mod) => mod.Bar),
    {ssr: false}
);

type Props = { totals: number[]};

export default function MonthlyHistoryChart({totals } : Props   ){
    const data = useMemo(() => ({
        labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        datasets: [
            {
                label: "Valor Antecipado",
                data: totals.map((v) => v / 100),
                backgroundColor: "#4F46E5",
                borderRadius: 6,
            }
        ]
    }),
    [totals]
    );
    const options = useMemo(
        () => ({
            plugins: {legend: { display: false}},
            scales: {y: {grid: {display: false}, ticks: {display: false}}},
        }),
        []
    );

    return (
        <div className="card p-6">
            <h3 className='mb-4 text-base font-semibold text-gray-800'>Histórico Mensal</h3>
            <Bar data={data} options={options} height={220}/>
        </div>
    )
}