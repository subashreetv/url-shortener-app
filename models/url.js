import { Schema, model } from "mongoose";

const UrlSchema = new Schema({
    longUrl: { type: String, required: true },
    shortUrl: { type: String, required: true },
    topic: { type: String, required: true },
    createdBy: { type: String, ref: "User" },
    createdAt: { type: Date, default: Date.now }
});

export default model("Url", UrlSchema);
