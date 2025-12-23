import connectDB from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const start = parseInt(searchParams.get("_start")) || 0;
        const end = parseInt(searchParams.get("_end")) || 10;

        const total = await User.countDocuments();
        const users = await User.find({})
            .sort({ createdAt: -1 })
            .skip(start)
            .limit(end - start);

        const response = NextResponse.json(users);
        // Refine için gerekli header'lar
        response.headers.set("x-total-count", total.toString());
        response.headers.set("Access-Control-Expose-Headers", "x-total-count");

        return response;
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
