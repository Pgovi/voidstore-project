import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(import.meta.dirname, "../.env") });

const FB_API = "https://graph.facebook.com/v25.0";
const AD_ACCOUNT_ID = process.env.META_AD_ACCOUNT_ID; // format: act_123456
const ACCESS_TOKEN = process.env.FACEBOOK_PAGE_TOKEN;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const PRODUCTS_API = process.env.BIDRIKALA_API || "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com";
const STORE_URL = "https://bidrikalastore.vercel.app";

if (!ACCESS_TOKEN) {
  console.error("Missing FACEBOOK_PAGE_TOKEN in .env");
  process.exit(1);
}

/* ── API helper ── */
async function graphApi(endpoint, params = {}) {
  const res = await fetch(`${FB_API}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, access_token: ACCESS_TOKEN }),
  });
  const data = await res.json();
  if (data.error) throw new Error(`API Error: ${data.error.message}`);
  return data;
}

async function graphGet(endpoint, fields = "") {
  const url = `${FB_API}${endpoint}?fields=${fields}&access_token=${ACCESS_TOKEN}`;
  const res = await fetch(url);
  return res.json();
}

/* ── Fetch products ── */
async function fetchProducts() {
  const res = await fetch(`${PRODUCTS_API}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const products = await res.json();
  products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));
  return products;
}

/* ── List ad accounts ── */
async function listAdAccounts() {
  const data = await graphGet("/me/adaccounts", "id,name,account_status,currency,business_name");
  if (data.error) throw new Error(data.error.message);
  console.log("Your Ad Accounts:\n");
  if (!data.data || data.data.length === 0) {
    console.log("  No ad accounts found.");
    console.log("  Go to business.facebook.com → Ad Accounts → Add to create one.");
    return;
  }
  for (const acc of data.data) {
    const status = acc.account_status === 1 ? "Active" : `Status: ${acc.account_status}`;
    console.log(`  [${acc.id}] ${acc.name || "Unnamed"} (${acc.currency || "?"}) — ${status}`);
  }
  console.log(`\nAdd your ad account ID to .env:\n  META_AD_ACCOUNT_ID=act_XXXX`);
}

/* ── Create a campaign ── */
async function createCampaign(name, objective = "OUTCOME_TRAFFIC") {
  if (!AD_ACCOUNT_ID) throw new Error("Missing META_AD_ACCOUNT_ID in .env");

  const data = await graphApi(`/${AD_ACCOUNT_ID}/campaigns`, {
    name,
    objective,
    status: "PAUSED",
    special_ad_categories: [],
  });
  console.log(`Campaign created: ${data.id}`);
  console.log(`Name: ${name}`);
  console.log(`Objective: ${objective}`);
  console.log(`Status: PAUSED (activate when ready)`);
  return data.id;
}

/* ── Create an ad set ── */
async function createAdSet(campaignId, name, dailyBudget, targeting) {
  if (!AD_ACCOUNT_ID) throw new Error("Missing META_AD_ACCOUNT_ID in .env");

  const data = await graphApi(`/${AD_ACCOUNT_ID}/adsets`, {
    campaign_id: campaignId,
    name,
    daily_budget: dailyBudget, // in paisa (100 = ₹1)
    billing_event: "IMPRESSIONS",
    optimization_goal: "LINK_CLICKS",
    bid_strategy: "LOWEST_COST_WITHOUT_CAP",
    targeting,
    status: "PAUSED",
  });
  console.log(`Ad Set created: ${data.id}`);
  return data.id;
}

/* ── Create ad creative ── */
async function createCreative(product) {
  if (!AD_ACCOUNT_ID) throw new Error("Missing META_AD_ACCOUNT_ID in .env");

  const name = product.name.split("—").map((s) => s.trim());
  const title = name.length > 1 ? name[1] : name[0];

  const data = await graphApi(`/${AD_ACCOUNT_ID}/adcreatives`, {
    name: `BidriKala - ${title}`,
    object_story_spec: {
      page_id: PAGE_ID,
      instagram_actor_id: IG_USER_ID,
      link_data: {
        message: `${product.description}\n\n✦ Pure silver inlay on matte-black alloy\n✦ Handcrafted in Bidar, Karnataka\n✦ 600-year-old Bidriware tradition\n\n₹${product.price.toLocaleString("en-IN")} — Shop now!`,
        link: STORE_URL,
        name: title,
        picture: product.image,
        call_to_action: {
          type: "SHOP_NOW",
          value: { link: STORE_URL },
        },
      },
    },
  });
  console.log(`Creative created: ${data.id}`);
  return data.id;
}

/* ── Create ad ── */
async function createAd(adsetId, creativeId, name) {
  if (!AD_ACCOUNT_ID) throw new Error("Missing META_AD_ACCOUNT_ID in .env");

  const data = await graphApi(`/${AD_ACCOUNT_ID}/ads`, {
    adset_id: adsetId,
    creative: { creative_id: creativeId },
    name,
    status: "PAUSED",
  });
  console.log(`Ad created: ${data.id}`);
  return data.id;
}

/* ── Quick campaign builder ── */
async function quickCampaign(productId, dailyBudgetINR = 200) {
  const products = await fetchProducts();
  const product = products.find((p) => p.productId === productId);
  if (!product) throw new Error(`Product ${productId} not found`);

  const name = product.name.split("—").map((s) => s.trim());
  const title = name.length > 1 ? name[1] : name[0];
  const dailyBudgetPaisa = dailyBudgetINR * 100;

  console.log(`\nCreating ad campaign for: ${title}`);
  console.log(`Daily budget: ₹${dailyBudgetINR}\n`);

  // 1. Campaign
  const campaignId = await createCampaign(`BidriKala - ${title}`, "OUTCOME_TRAFFIC");

  // 2. Ad Set with targeting
  const targeting = {
    geo_locations: { countries: ["IN"] },
    age_min: 25,
    age_max: 55,
    locales: [6], // English (India)
    flexible_spec: [
      {
        interests: [
          { id: "6003139266461", name: "Handicraft" },
          { id: "6003384829572", name: "Home decor" },
          { id: "6003397425735", name: "Interior design" },
          { id: "6003012327985", name: "Art" },
          { id: "6003310769498", name: "Luxury goods" },
        ],
      },
    ],
  };

  const adsetId = await createAdSet(
    campaignId,
    `${title} - India 25-55 Art Lovers`,
    dailyBudgetPaisa,
    targeting
  );

  // 3. Creative
  const creativeId = await createCreative(product);

  // 4. Ad
  const adId = await createAd(adsetId, creativeId, `${title} - Ad`);

  console.log(`\n--- Campaign Ready ---`);
  console.log(`Campaign: ${campaignId}`);
  console.log(`Ad Set:   ${adsetId}`);
  console.log(`Creative: ${creativeId}`);
  console.log(`Ad:       ${adId}`);
  console.log(`\nStatus: PAUSED — Review in Ads Manager, then activate.`);
  console.log(`Ads Manager: https://www.facebook.com/adsmanager`);
}

/* ── List campaigns ── */
async function listCampaigns() {
  if (!AD_ACCOUNT_ID) throw new Error("Missing META_AD_ACCOUNT_ID in .env");
  const data = await graphGet(
    `/${AD_ACCOUNT_ID}/campaigns`,
    "id,name,objective,status,daily_budget,lifetime_budget"
  );
  if (data.error) throw new Error(data.error.message);
  console.log("Your Campaigns:\n");
  if (!data.data || data.data.length === 0) {
    console.log("  No campaigns found.");
    return;
  }
  for (const c of data.data) {
    const budget = c.daily_budget
      ? `₹${(c.daily_budget / 100).toFixed(0)}/day`
      : c.lifetime_budget
        ? `₹${(c.lifetime_budget / 100).toFixed(0)} lifetime`
        : "No budget set";
    console.log(`  [${c.id}] ${c.name} — ${c.status} — ${c.objective} — ${budget}`);
  }
}

/* ── Main ── */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log("BidriKala Meta Ads Manager\n");
    console.log("Commands:");
    console.log("  node meta-ads.mjs accounts            List your ad accounts");
    console.log("  node meta-ads.mjs campaigns            List campaigns");
    console.log("  node meta-ads.mjs products             List products");
    console.log("  node meta-ads.mjs create <id> [budget]  Create campaign for product");
    console.log("                                          (budget in INR, default ₹200/day)");
    console.log("\nSetup:");
    console.log("  1. Run 'accounts' to find your Ad Account ID");
    console.log("  2. Add META_AD_ACCOUNT_ID=act_XXXX to .env");
    console.log("  3. Run 'create <productId>' to build a campaign");
    return;
  }

  if (command === "accounts") {
    await listAdAccounts();
    return;
  }

  if (command === "campaigns") {
    await listCampaigns();
    return;
  }

  if (command === "products") {
    const products = await fetchProducts();
    console.log("Available products:\n");
    for (const p of products) {
      console.log(`  [${p.productId}] ${p.name} — ₹${p.price} (${p.category})`);
    }
    return;
  }

  if (command === "create") {
    const productId = args[1];
    const budget = args[2] ? parseInt(args[2]) : 200;
    if (!productId) {
      console.error("Usage: node meta-ads.mjs create <productId> [dailyBudget]");
      process.exit(1);
    }
    await quickCampaign(productId, budget);
    return;
  }

  console.error(`Unknown command: ${command}`);
  process.exit(1);
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
