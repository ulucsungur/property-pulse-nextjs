import { Schema, model, models } from "mongoose";
const PropertySchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Owner is required"],
        },
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        type: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        location: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        beds: {
            type: Number,
            required: [true, "Number of beds is required"],
        },
        baths: {
            type: Number,
            required: [true, "Number of beds is required"],
        },
        square_feet: {
            type: Number,
            required: [true, "Number of beds is required"],
        },
        amenities: [
            {
                type: String,
            }
        ],
        rates: {
            nightly: Number,
            weekly: Number,
            monthly: Number
        },
        seller_info: {
            name: String,
            email: String,
            phone: String,
        },
        images: [
            {
                type: String,
                required: [true, "At least one image is required"],
            }
        ],
        is_featured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Property = models.Property || model("Property", PropertySchema);

export default Property;
