import connectToDatabase from "@/config/database";
import Property from "@/models/Property";



export const GET = async () => {
    try {
        await connectToDatabase();
        const properties = await Property.find({});
        return new Response(properties, {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ message: "Failed to fetch properties" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }


};
