import dotenv from "dotenv";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

dotenv.config({ path: resolve(import.meta.dirname, "../.env") });

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

if (!TOKEN) {
  console.error("Missing INSTAGRAM_ACCESS_TOKEN in .env");
  process.exit(1);
}
if (!APP_SECRET) {
  console.error("Missing INSTAGRAM_APP_SECRET in .env");
  console.error('Go to Meta Developer Dashboard → Instagram → API setup with Instagram login');
  console.error('Click "Show" next to Instagram app secret and add it to .env');
  process.exit(1);
}

console.log("Exchanging short-lived token for long-lived token...\n");

const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${TOKEN}`;
const res = await fetch(url);
const data = await res.json();

if (data.error) {
  console.error("Exchange failed:", data.error.message);
  process.exit(1);
}

console.log("Long-lived token generated!");
console.log(`Expires in: ${Math.round(data.expires_in / 86400)} days`);
console.log(`Token: ${data.access_token.slice(0, 20)}...`);

// Update .env file with the new token
const envPath = resolve(import.meta.dirname, "../.env");
let envContent = readFileSync(envPath, "utf-8");
envContent = envContent.replace(
  /INSTAGRAM_ACCESS_TOKEN=.*/,
  `INSTAGRAM_ACCESS_TOKEN=${data.access_token}`
);
writeFileSync(envPath, envContent);

console.log("\n.env updated with long-lived token!");
