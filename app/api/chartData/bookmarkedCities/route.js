import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import mongoose from "mongoose";

export const GET = async () => {
    try {
        await connectToDatabase();

        const session = await getServerSession(authOptions);
        const email = session?.user?.email;
        if (!email) {
            return NextResponse.json({ error: "Oturum bulunamadı" }, { status: 401 });
        }

        const user = await User.findOne({ email }).lean();
        const bookmarks = Array.isArray(user?.bookmarks) ? user.bookmarks : [];

        if (bookmarks.length === 0) {
            return NextResponse.json({ labels: [], datasets: [] });
        }

        // String ID'leri ObjectId'e çevir
        const bookmarkIds = bookmarks.map(id =>
            typeof id === "string" ? new mongoose.Types.ObjectId(id) : id
        );

        const data = await Property.aggregate([
            { $match: { _id: { $in: bookmarkIds } } },
            {
                $group: {
                    _id: { $trim: { input: "$location.city" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const chartData = {
            labels: data.map(item => item._id),
            datasets: [
                {
                    label: "Bookmark Alan İlanlar",
                    data: data.map(item => item.count),
                    borderColor: "rgba(255, 99, 132, 1)",
                    backgroundColor: "rgba(255, 99, 132, 0.3)",
                    fill: true
                }
            ]
        };

        return NextResponse.json(chartData);
    } catch (error) {
        console.error("Bookmarked cities chart hata:", error);
        return NextResponse.json({ labels: [], datasets: [] }, { status: 500 });
    }
};
