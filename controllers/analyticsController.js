import Analytics from "../models/analytics.js";
import Url from "../models/url.js";
import moment from "moment";

export async function getAnalytics(req, res) {
  try {
    const alias = req.params.alias;
    const urls = await Url.find({ shortUrl: alias });
    if (!urls.length) {
      return res.status(400).json({ message: "URL not found" });
    }

    const analyticsRecords = await Analytics.find({ alias });
    if (!analyticsRecords.length) {
      return res.status(400).json({ error: "No analytics data found for this URL" });
    }

    // Calculate total clicks
    const totalClicks = analyticsRecords.length;

    // Get unique users (based on unique IPs)
    const uniqueUsers = new Set(analyticsRecords.map((record) => record.ip)).size;

    // Group clicks by date (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) =>
      moment().subtract(i, "days").format("YYYY-MM-DD")
    ).reverse();

    const clicksByDate = last7Days.map((date) => ({
      date,
      clickCount: analyticsRecords.filter((record) =>
        moment(record.timestamp).isSame(date, "day")
      ).length,
    }));

    // Group data by OS type
    const osData = {};
    analyticsRecords.forEach(({ osType, ip }) => {
      if (!osData[osType]) osData[osType] = { uniqueUsers:new Set(), totalClicks: 0};
      osData[osType].uniqueUsers.add(ip);
      osData[osType].totalClicks++;
    });

    const osType = Object.keys(osData).map((os) => ({
      osName: os,
      uniqueClicks: osData[os].totalClicks,
      uniqueUsers: osData[os].uniqueUsers.size,
    }));

    // Group data by device type
    const deviceData = {};
    analyticsRecords.forEach(({ deviceType, ip }) => {
      if (!deviceData[deviceType]) deviceData[deviceType] = { uniqueUsers:new Set(), totalClicks: 0};
      deviceData[deviceType].uniqueUsers.add(ip);
      deviceData[deviceType].totalClicks++;
    });

    const deviceType = Object.keys(deviceData).map((device) => ({
      deviceName: device,
      uniqueClicks: deviceData[device].totalClicks,
      uniqueUsers: deviceData[device].uniqueUsers.size,
    }));
    
    return res.status(200).json({
      totalClicks,
      uniqueUsers,
      clicksByDate,
      osType,
      deviceType,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getTopicAnalytics(req, res) {
  try {
    const { topic } = req.params;

    // Find all short URLs under the given topic
    const urls = await Url.find({ topic });

    if (!urls.length) {
      return res.status(400).json({ message: "No URLs found for this topic" });
    }

    const shortUrls = urls.map((url) => url.shortUrl);

    // Fetch analytics for these URLs
    const analytics = await Analytics.find({ alias: { $in: shortUrls } });

    // Initialize response data
    let totalClicks = 0;
    let uniqueUsersSet = new Set();
    let clicksByDateMap = {};
    let urlStats = {};

    analytics.forEach(({ alias, ip, timestamp }) => {
      totalClicks += 1;
      uniqueUsersSet.add(ip); // Track unique users

      // Track clicks per date
      const date = timestamp.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      clicksByDateMap[date] = (clicksByDateMap[date] || 0) + 1;

      // Track per URL stats
      if (!urlStats[alias]) {
        urlStats[alias] = { totalClicks: 0, uniqueUsers: new Set() };
      }
      urlStats[alias].totalClicks += 1;
      urlStats[alias].uniqueUsers.add(ip);
    });

    // Convert clicksByDateMap to array format
    const clicksByDate = Object.keys(clicksByDateMap).map((date) => ({
      date,
      clickCount: clicksByDateMap[date],
    }));

    // Construct URL-specific stats
    const urlsResponse = urls.map((url) => ({
      url: url.shortUrl,
      totalClicks: urlStats[url.shortUrl]?.totalClicks || 0,
      uniqueUsers: urlStats[url.shortUrl]?.uniqueUsers.size || 0,
    }));

    // Final response
    res.status(200).json({
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate,
      urls: urlsResponse,
    });

  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getOverallAnalytics(req, res) {
  try {
    const googleId = req.user.googleId; // Get user ID from authentication
    // Find all short URLs created by the user
    const urls = await Url.find({ createdBy: googleId });

    if (!urls.length) {
      return res.status(400).json({ message: "No URLs found for this user" });
    }

    const shortUrls = urls.map((url) => url.shortUrl);

    // Fetch analytics for these URLs
    const analytics = await Analytics.find({ alias: { $in: shortUrls } });

    // Initialize response data
    let totalClicks = 0;
    let uniqueUsersSet = new Set();
    let clicksByDateMap = {};
    let osData = {};
    let deviceData = {};
    
    analytics.forEach(({ ip, timestamp, osType, deviceType }) => {
      totalClicks += 1;
      uniqueUsersSet.add(ip); // Track unique users

      // Track clicks per date
      const date = timestamp.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      clicksByDateMap[date] = (clicksByDateMap[date] || 0) + 1;

      // Track OS type analytics
      if (!osData[osType]) osData[osType] =  { uniqueUsers:new Set(), totalClicks: 0};
      osData[osType].uniqueUsers.add(ip);
      osData[osType].totalClicks++;

      // Track device type analytics
      if (!deviceData[deviceType]) deviceData[deviceType] =  { uniqueUsers:new Set(), totalClicks: 0};
      deviceData[deviceType].uniqueUsers.add(ip);
      deviceData[deviceType].totalClicks++;
    });

    // Convert clicksByDateMap to array format
    const clicksByDate = Object.keys(clicksByDateMap).map((date) => ({
      date,
      clickCount: clicksByDateMap[date],
    }));

    // Convert OS and Device analytics to array format
    const osType = Object.keys(osData).map((os) => ({
      osName: os,
      uniqueClicks: osData[os].totalClicks,
      uniqueUsers: osData[os].uniqueUsers.size,
    }));

    const deviceType = Object.keys(deviceData).map((device) => ({
      deviceName: device,
      uniqueClicks: deviceData[device].totalClicks,
      uniqueUsers: deviceData[device].uniqueUsers.size,
    }));

    // Final response
    res.status(200).json({
      totalUrls: urls.length,
      totalClicks,
      uniqueUsers: uniqueUsersSet.size,
      clicksByDate,
      osType,
      deviceType,
    });

  } catch (error) {
    console.error("Error fetching overall analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}