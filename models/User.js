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
        image: {
            type: String,
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
