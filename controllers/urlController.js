import Url from "../models/url.js";
import { nanoid } from "nanoid";
import client from "../config/redis.js";
import requestIp from "request-ip";
import axios from "axios";
import Analytics from "../models/analytics.js";

export async function createShortUrl(req, res) {
  try { 
    const { longUrl, customAlias, topic } = req.body;
    const alias = customAlias || nanoid(6);

    let urlPattern = new RegExp("^(http|https)://", "i");
    if (!urlPattern.test(longUrl)) return res.status(400).json({ message: "Invalid URL format" });

    let existingUrl = await Url.findOne({ shortUrl: alias });
    if(existingUrl) return res.status(400).json({ message: "short url already in use" });

    const newUrl = new Url({ longUrl, shortUrl: alias, topic, createdBy: req.user.googleId });
    await newUrl.save();
    res.json({ shortUrl: alias, createdAt: newUrl.createdAt });
    
  } catch (error) {
    console.log("err", err);
    res.status(500).json({ message: "Internal server error" });
  } 
}

export async function redirectUrl(req, res) {
  try{
    const { alias } = req.params;

    const url = await Url.findOne({ shortUrl: alias });
    if (!url) return res.status(400).json({ message: "URL not found" });

    const timestamp = new Date();
    const userAgent = req.headers["user-agent"];
    const clientIp = requestIp.getClientIp(req); // Get IP address

    // Get geolocation data using a free API
    let geoData = {};
    try {
      const geoResponse = await axios.get(`http://ip-api.com/json/${clientIp}`);
      geoData = geoResponse.data;
    } catch (geoError) {
      console.error("Geo API Error:", geoError.message);
    }

    // Log analytics data
    const analyticsData = new Analytics ({
        alias,
        ip: clientIp,
        osType: getOS(userAgent),
        deviceType: getDevice(userAgent),
        timestamp: Date.now() ,
        country: geoData.country || "Unknown",
        city: geoData.city || "Unknown",
        region: geoData.regionName || "Unknown",
        userAgent
    });

    await analyticsData.save();

    const cachedUrl = await client.get(alias);    
    if (cachedUrl) return res.redirect(cachedUrl);

    await client.set(alias, url.longUrl, "EX", 3600);
    res.redirect(url.longUrl);
  }catch(err){
    console.log("err", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getOS = (userAgent) => {
    if (/Windows/i.test(userAgent)) return "Windows";
    if (/Mac/i.test(userAgent)) return "macOS";
    if (/Linux/i.test(userAgent)) return "Linux";
    if (/Android/i.test(userAgent)) return "Android";
    if (/iOS|iPhone|iPad/i.test(userAgent)) return "iOS";
    return "Other";
  };
  
  // Extract Device Type
  const getDevice = (userAgent) => {
    if (/Mobile/i.test(userAgent)) return "Mobile";
    if (/Tablet/i.test(userAgent)) return "Tablet";
    return "Desktop";
  };
  