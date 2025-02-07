import { createClient } from "redis";

let redis_config; 
if(process.env.ENVIRONMENT == "production"){
    redis_config = {  url: `rediss://default:${process.env.REDIS_PASS}@workable-toucan-11760.upstash.io:6379`} 
}else{
    redis_config = { url: 'redis://redis:6379'}
}
const client = createClient(redis_config);

client.on("error", (err) => console.log("Redis Error:", err));

export default client;
