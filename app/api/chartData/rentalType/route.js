import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        await connectToDatabase();

        const data = await Property.aggregate([
            { $match: { type: { $exists: true, $ne: null } } },
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];
        const chartData = {
            labels: data.map(item => item._id),
            datasets: [
                {
                    label: "Kiralama Türü Dağılımı",
                    data: data.map(item => item.count),
                    backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                },
            ],
        };

        return NextResponse.json(chartData);
    } catch (error) {
        return NextResponse.json(chartData || { labels: [], datasets: [] });
    }
};
