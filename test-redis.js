const redis = require("redis");
const client = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

client.connect().then(async () => {
  console.log("✅ Redis Connected!");

  await client.set("testKey", "Hello Redis!");
  const value = await client.get("testKey");
  console.log("🔹 Redis Test Value:", value);

  client.quit();
}).catch(console.error);
