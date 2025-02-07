import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    googleId: { type: String, unique: true },
    email: { type: String, required: true }
});

export default model("User", UserSchema);
