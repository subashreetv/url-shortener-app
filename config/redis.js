import { createClient } from "redis";

let redis_config; 
if(process.env.ENVIRONMENT == "production"){
    redis_config = {  url: process.env.REDIS_URL,
  token: process.env.REDIS_PASS} 
}else{
    redis_config = { url: 'redis://redis:6379'}
}
const client = createClient(redis_config);

client.on("error", (err) => console.log("Redis Error:", err));

export default client;
