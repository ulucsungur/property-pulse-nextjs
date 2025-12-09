// app/api/chartData/monthly/route.js
import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const data = await Property.aggregate([
            { $match: { createdAt: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: { $toDate: "$createdAt" },
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        const chartData = {
            labels: data.map((item) => item._id),
            datasets: [
                {
                    label: "Aylık İlan Sayısı",
                    data: data.map((item) => item.count),
                    borderColor: "rgba(75, 192, 192, 1)",
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    fill: false, // Radar için true yapabilirsin
                },
            ],
        };

        return NextResponse.json(chartData);
    } catch (error) {
        console.error("Monthly chart hata:", error);
        return NextResponse.json(
            {
                labels: [],
                datasets: [
                    {
                        label: "Aylık İlan Sayısı",
                        data: [],
                        borderColor: "rgba(75, 192, 192, 1)",
                        backgroundColor: "rgba(75, 192, 192, 0.2)",
                        fill: false,
                    },
                ],
            },
            { status: 500 }
        );
    }
};
