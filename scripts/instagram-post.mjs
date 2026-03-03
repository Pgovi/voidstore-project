import dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(import.meta.dirname, "../.env") });

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const IG_USER_ID = process.env.INSTAGRAM_USER_ID;
const API = process.env.BIDRIKALA_API || "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com";
const IG_API = "https://graph.instagram.com/v21.0";

if (!TOKEN || !IG_USER_ID) {
  console.error("Missing INSTAGRAM_ACCESS_TOKEN or INSTAGRAM_USER_ID in .env");
  process.exit(1);
}

/* ── Fetch all products from BidriKala API ── */
async function fetchProducts() {
  const res = await fetch(`${API}/products`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

/* ── Build Instagram caption for a product ── */
function buildCaption(product) {
  const name = product.name.split("—").map((s) => s.trim());
  const title = name.length > 1 ? name[1] : name[0];
  const hindiName = name.length > 1 ? name[0] : "";

  let caption = "";
  if (hindiName) caption += `✦ ${hindiName}\n`;
  caption += `${title}\n\n`;
  caption += `${product.description}\n\n`;
  caption += `✦ Pure silver inlay on matte-black alloy\n`;
  caption += `✦ Handcrafted in Bidar, Karnataka\n`;
  caption += `✦ 600-year-old Bidriware tradition\n\n`;
  caption += `₹${product.price.toLocaleString("en-IN")}`;
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    caption += ` (MRP ₹${product.originalPrice.toLocaleString("en-IN")} — Save ${discount}%)`;
  }
  caption += `\n`;
  caption += `⭐ ${product.rating}/5 | ${product.reviews}+ reviews\n`;
  if (product.stock <= 3) caption += `🔸 Only ${product.stock} left in stock\n`;
  caption += `\n`;
  caption += `🛒 Shop now → bidrikalastore.vercel.app\n`;
  caption += `📩 DM or WhatsApp: +91 86604 46406\n\n`;
  caption += `#Bidriware #BidriKala #Handcrafted #IndianArt #SilverInlay\n`;
  caption += `#MadeInIndia #BidarCraft #TraditionalArt #LuxuryDecor\n`;
  caption += `#${product.category.replace(/\s+/g, "")} #ArtisanMade #Heritage #SilverOnBlack`;

  return caption;
}

/* ── Build alt text for accessibility + SEO ── */
function buildAltText(product) {
  return `Handcrafted Bidriware ${product.name} — ${product.description.slice(0, 100)}`;
}

/* ── Post a single image to Instagram ── */
async function postToInstagram(product) {
  const caption = buildCaption(product);
  const altText = buildAltText(product);

  // Step 1: Create media container with alt text and location (Bidar, Karnataka)
  console.log("  Creating media container...");
  const createRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: product.image,
      caption,
      alt_text: altText,
      location_id: "263981580311674",
      access_token: TOKEN,
    }),
  });

  const createData = await createRes.json();
  if (createData.error) {
    throw new Error(`Container creation failed: ${createData.error.message}`);
  }

  const containerId = createData.id;
  console.log(`  Container created: ${containerId}`);

  // Step 2: Wait for container to be ready (poll status)
  let ready = false;
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const statusRes = await fetch(
      `${IG_API}/${containerId}?fields=status_code&access_token=${TOKEN}`
    );
    const statusData = await statusRes.json();
    console.log(`  Status: ${statusData.status_code}`);
    if (statusData.status_code === "FINISHED") {
      ready = true;
      break;
    }
    if (statusData.status_code === "ERROR") {
      throw new Error("Media processing failed");
    }
  }

  if (!ready) throw new Error("Media processing timed out");

  // Step 3: Publish the container
  console.log("  Publishing...");
  const publishRes = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: TOKEN,
    }),
  });

  const publishData = await publishRes.json();
  if (publishData.error) {
    throw new Error(`Publish failed: ${publishData.error.message}`);
  }

  return publishData.id;
}

/* ── Main ── */
async function main() {
  const args = process.argv.slice(2);
  const postAll = args.includes("--all");
  const productId = args.find((a) => !a.startsWith("--"));

  console.log("Fetching products from BidriKala API...\n");
  const products = await fetchProducts();
  products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));

  if (!postAll && !productId) {
    console.log("Available products:\n");
    for (const p of products) {
      console.log(`  [${p.productId}] ${p.name} — ₹${p.price} (${p.category})`);
    }
    console.log(`\nUsage:`);
    console.log(`  node instagram-post.mjs <productId>   Post a single product`);
    console.log(`  node instagram-post.mjs --all          Post all products (with 30s delay between each)`);
    return;
  }

  if (productId) {
    const product = products.find((p) => p.productId === productId);
    if (!product) {
      console.error(`Product ${productId} not found`);
      process.exit(1);
    }
    console.log(`Posting: ${product.name}`);
    console.log(`Caption preview:\n${buildCaption(product)}\n`);
    const mediaId = await postToInstagram(product);
    console.log(`\nPosted successfully! Media ID: ${mediaId}`);
  }

  if (postAll) {
    console.log(`Posting ${products.length} products to Instagram...\n`);
    let success = 0;
    let failed = 0;

    for (const product of products) {
      try {
        console.log(`[${product.productId}] ${product.name}`);
        const mediaId = await postToInstagram(product);
        console.log(`  Posted! Media ID: ${mediaId}\n`);
        success++;
        if (product !== products[products.length - 1]) {
          console.log("  Waiting 30s before next post...\n");
          await new Promise((r) => setTimeout(r, 30000));
        }
      } catch (err) {
        console.error(`  FAILED: ${err.message}\n`);
        failed++;
      }
    }

    console.log(`\nDone! ${success} posted, ${failed} failed.`);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
