"use client";

import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RadarChart({ data }) {
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.5, // ✅ diğer grafiklerle eşit oran
        plugins: {
            legend: { display: true }
        },
        scales: {
            r: {
                beginAtZero: true,
                ticks: { stepSize: 1 },
                pointLabels: { font: { size: 14 } }
            }
        }
    };

    return <Radar data={data} options={options} />;
}
