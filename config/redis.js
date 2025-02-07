import { createClient } from "redis";

let redis_config; 
if(process.env.ENVIRONMENT == "production"){
    redis_config = {  url: 'https://workable-toucan-11760.upstash.io',
  token: '********'} 
}else{
    redis_config = { 'redis://redis:6379'}
}
const client = createClient(redis_config);

client.on("error", (err) => console.log("Redis Error:", err));

export default client;
