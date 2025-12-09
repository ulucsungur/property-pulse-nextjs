import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const data = await Property.aggregate([
            { $group: { _id: "$location.city", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const chartData = {
            labels: data.map(item => item._id),
            datasets: [
                {
                    label: "İlan Sayısı",
                    data: data.map(item => item.count),
                    backgroundColor: "rgba(54, 162, 235, 0.6)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 1,
                },
            ],
        };

        return NextResponse.json(chartData);
    } catch (error) {
        return NextResponse.json(chartData || { labels: [], datasets: [] });
    }
};
