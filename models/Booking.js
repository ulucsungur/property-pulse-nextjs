import mongoose, { Schema } from "mongoose";

const BookingSchema = new Schema(
    {
        property: {
            type: Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        check_in: {
            type: Date,
            required: true,
        },
        check_out: {
            type: Date,
            required: true,
        },
        total_days: {
            type: Number,
            required: true,
        },
        total_price: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"], // Beklemede, Onaylandı, İptal
            default: "pending",
        },
    },
    { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

export default Booking;
