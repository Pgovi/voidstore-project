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

/* ── Captions ── */
function buildSingleCaption(product) {
  const name = product.name.split("—").map((s) => s.trim());
  const title = name.length > 1 ? name[1] : name[0];
  const hindiName = name.length > 1 ? name[0] : "";

  let c = "";
  if (hindiName) c += `✦ ${hindiName}\n`;
  c += `${title}\n\n`;
  c += `${product.description}\n\n`;
  c += `✦ Pure silver inlay on matte-black alloy\n`;
  c += `✦ Handcrafted in Bidar, Karnataka\n`;
  c += `✦ 600-year-old Bidriware tradition\n\n`;
  c += `₹${product.price.toLocaleString("en-IN")}`;
  if (product.originalPrice && product.originalPrice > product.price) {
    const discount = Math.round((1 - product.price / product.originalPrice) * 100);
    c += ` (MRP ₹${product.originalPrice.toLocaleString("en-IN")} — Save ${discount}%)`;
  }
  c += `\n`;
  c += `⭐ ${product.rating}/5 | ${product.reviews}+ reviews\n`;
  if (product.stock <= 3) c += `🔸 Only ${product.stock} left in stock\n`;
  c += `\n`;
  c += `🛒 Shop now → bidrikalastore.vercel.app\n`;
  c += `📩 DM or WhatsApp: +91 86604 46406\n\n`;
  c += `#Bidriware #BidriKala #Handcrafted #IndianArt #SilverInlay\n`;
  c += `#MadeInIndia #BidarCraft #TraditionalArt #LuxuryDecor\n`;
  c += `#${product.category.replace(/\s+/g, "")} #ArtisanMade #Heritage #SilverOnBlack`;
  return c;
}

function buildCarouselCaption(category, products) {
  let c = `✦ BidriKala ${category} Collection ✦\n\n`;
  c += `Swipe through our handcrafted ${category.toLowerCase()} pieces →\n\n`;
  products.forEach((p, i) => {
    const name = p.name.split("—").map((s) => s.trim());
    const title = name.length > 1 ? name[1] : name[0];
    c += `${i + 1}. ${title} — ₹${p.price.toLocaleString("en-IN")}\n`;
  });
  c += `\n`;
  c += `✦ Pure silver inlay on matte-black alloy\n`;
  c += `✦ Handcrafted in Bidar, Karnataka\n`;
  c += `✦ 600-year-old Bidriware tradition\n\n`;
  c += `🛒 Shop the full collection → bidrikalastore.vercel.app\n`;
  c += `📩 DM or WhatsApp: +91 86604 46406\n\n`;
  c += `#Bidriware #BidriKala #Handcrafted #IndianArt #SilverInlay\n`;
  c += `#MadeInIndia #BidarCraft #TraditionalArt #LuxuryDecor\n`;
  c += `#${category.replace(/\s+/g, "")} #ArtisanMade #Heritage #SilverOnBlack`;
  return c;
}

function buildAltText(product) {
  return `Handcrafted Bidriware ${product.name} — ${product.description.slice(0, 100)}`;
}

/* ── Wait for Instagram to process media ── */
async function waitForProcessing(containerId) {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${IG_API}/${containerId}?fields=status_code&access_token=${TOKEN}`);
    const data = await res.json();
    console.log(`  Status: ${data.status_code}`);
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") throw new Error("Media processing failed");
  }
  throw new Error("Media processing timed out");
}

/* ── Post single image ── */
async function postSingle(product) {
  console.log("  Creating media container...");
  const createRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_url: product.image,
      caption: buildSingleCaption(product),
      alt_text: buildAltText(product),
      location_id: "263981580311674",
      access_token: TOKEN,
    }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(createData.error.message);
  console.log(`  Container: ${createData.id}`);

  await waitForProcessing(createData.id);

  console.log("  Publishing...");
  const pubRes = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: createData.id, access_token: TOKEN }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);
  return pubData.id;
}

/* ── Post carousel (multiple images) ── */
async function postCarousel(category, products) {
  // Create child containers
  const childIds = [];
  for (const product of products) {
    console.log(`  Creating child: ${product.name}`);
    const childRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: product.image,
        alt_text: buildAltText(product),
        is_carousel_item: true,
        access_token: TOKEN,
      }),
    });
    const childData = await childRes.json();
    if (childData.error) throw new Error(childData.error.message);
    childIds.push(childData.id);
    await waitForProcessing(childData.id);
  }

  // Create carousel container
  console.log("  Creating carousel...");
  const carouselRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "CAROUSEL",
      children: childIds,
      caption: buildCarouselCaption(category, products),
      location_id: "263981580311674",
      access_token: TOKEN,
    }),
  });
  const carouselData = await carouselRes.json();
  if (carouselData.error) throw new Error(carouselData.error.message);

  await waitForProcessing(carouselData.id);

  console.log("  Publishing carousel...");
  const pubRes = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: carouselData.id, access_token: TOKEN }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);
  return pubData.id;
}

/* ── Post Reel (video) ── */
async function postReel(product) {
  if (!product.video) throw new Error("Product has no video URL");

  console.log("  Creating reel container...");
  const createRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "REELS",
      video_url: product.video,
      caption: buildSingleCaption(product),
      location_id: "263981580311674",
      access_token: TOKEN,
    }),
  });
  const createData = await createRes.json();
  if (createData.error) throw new Error(createData.error.message);
  console.log(`  Container: ${createData.id}`);

  await waitForProcessing(createData.id);

  console.log("  Publishing reel...");
  const pubRes = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: createData.id, access_token: TOKEN }),
  });
  const pubData = await pubRes.json();
  if (pubData.error) throw new Error(pubData.error.message);
  return pubData.id;
}

/* ── Main ── */
async function main() {
  const args = process.argv.slice(2);
  const postAll = args.includes("--all");
  const carouselMode = args.includes("--carousel");
  const reelMode = args.includes("--reel");
  const productId = args.find((a) => !a.startsWith("--"));

  console.log("Fetching products from BidriKala API...\n");
  const products = await fetchProducts();
  products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));

  if (!postAll && !productId && !carouselMode) {
    console.log("Available products:\n");
    for (const p of products) {
      console.log(`  [${p.productId}] ${p.name} — ₹${p.price} (${p.category})`);
    }
    const categories = [...new Set(products.map((p) => p.category))];
    console.log(`\nCategories: ${categories.join(", ")}`);
    console.log(`\nUsage:`);
    console.log(`  node instagram-post.mjs <id>              Post single product`);
    console.log(`  node instagram-post.mjs --all             Post all products (30s delay)`);
    console.log(`  node instagram-post.mjs --carousel <cat>  Carousel by category`);
    console.log(`  node instagram-post.mjs --reel <id>       Post as Reel (needs video URL)`);
    return;
  }

  // Carousel mode: post a category carousel
  if (carouselMode) {
    const category = args.find((a) => !a.startsWith("--")) || "";
    const catProducts = products.filter((p) =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
    if (catProducts.length < 2) {
      console.error(`Need at least 2 products in category "${category}". Found: ${catProducts.length}`);
      process.exit(1);
    }
    const cat = catProducts[0].category;
    console.log(`Posting carousel: ${cat} (${catProducts.length} products)\n`);
    console.log(`Caption preview:\n${buildCarouselCaption(cat, catProducts)}\n`);
    const mediaId = await postCarousel(cat, catProducts.slice(0, 5));
    console.log(`\nCarousel posted! Media ID: ${mediaId}`);
    return;
  }

  // Reel mode
  if (reelMode && productId) {
    const product = products.find((p) => p.productId === productId);
    if (!product) { console.error(`Product ${productId} not found`); process.exit(1); }
    console.log(`Posting reel: ${product.name}`);
    const mediaId = await postReel(product);
    console.log(`\nReel posted! Media ID: ${mediaId}`);
    return;
  }

  // Single product
  if (productId && !postAll) {
    const product = products.find((p) => p.productId === productId);
    if (!product) { console.error(`Product ${productId} not found`); process.exit(1); }
    console.log(`Posting: ${product.name}`);
    console.log(`Caption preview:\n${buildSingleCaption(product)}\n`);
    const mediaId = await postSingle(product);
    console.log(`\nPosted successfully! Media ID: ${mediaId}`);
    return;
  }

  // Post all
  if (postAll) {
    console.log(`Posting ${products.length} products to Instagram...\n`);
    let success = 0, failed = 0;
    for (const product of products) {
      try {
        console.log(`[${product.productId}] ${product.name}`);
        const mediaId = await postSingle(product);
        console.log(`  Posted! Media ID: ${mediaId}\n`);
        success++;
        if (product !== products[products.length - 1]) {
          console.log("  Waiting 30s...\n");
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
