import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: [true, 'Email already exists'],
            match: [
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        // --- YENİ EKLENEN KISIM ---
        password: {
            type: String,
            required: false, // Google/GitHub kullanıcıları için zorunlu değil
            select: false,   // Güvenlik: Kullanıcıyı çekerken şifre gelmesin
        },
        // -------------------------
        image: {
            type: String,
        },
        surname: {
            type: String,
            required: false,
        },
        phone: {
            type: String,
            required: false,
        },
        country: {
            type: String,
            required: false,
        },
        dateOfBirth: {
            type: Date,
            required: false,
        },
        role: {
            type: String,
            enum: ["customer", "agent", "admin"],
            default: "customer", // Varsayılan olarak herkes müşteridir
        },
        status: {
            type: String,
            enum: ["active", "banned"],
            default: "active",
        },
        bookmarks: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Property'
            }
        ],
    },
    { timestamps: true }
);

const User = models.User || model("User", UserSchema);

export default User;
