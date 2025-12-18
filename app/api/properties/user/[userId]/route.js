import connectToDatabase from "@/config/database";
import Property from "@/models/Property";
import { NextResponse } from "next/server";

// GET /api/properties/user/:userId
export async function GET(request, { params }) {
    try {
        await connectToDatabase();

        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const properties = await Property.find({ owner: userId }).sort({ createdAt: -1 });

        return NextResponse.json(properties, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}
