import { Schema, model } from "mongoose";

const analyticSchema = new Schema({
    alias: { type: String, required: true },
    ip: { type: String, required: true },
    osType: { type: String, required: true },
    deviceType: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    country: { type: String, default: "Unknown" },
    city: { type: String, default: "Unknown" },
    region: { type: String, default: "Unknown" },
    userAgent:  { type: String, required: true }
});

export default model("Analytics", analyticSchema);
