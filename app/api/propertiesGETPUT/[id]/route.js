import connectToDatabase from "@/config/database";
import Property from "@/models/Property";



export const GET = async (request, { params }) => {
    try {
        await connectToDatabase();
        const property = await Property.findById(params.id);
        if (!property) {
            return new Response(JSON.stringify({ message: "Property not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(property, {
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
