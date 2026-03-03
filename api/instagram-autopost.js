const IG_API = "https://graph.instagram.com/v21.0";
const PRODUCTS_API = "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com/products";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  const IG_USER_ID = process.env.INSTAGRAM_USER_ID;

  if (!TOKEN || !IG_USER_ID) {
    return res.status(500).json({ error: "Missing Instagram credentials" });
  }

  try {
    const prodRes = await fetch(PRODUCTS_API);
    const products = await prodRes.json();
    products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));

    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    const isCarouselDay = dayOfYear % 3 === 0; // Every 3rd day = carousel

    let result;
    if (isCarouselDay) {
      result = await postCarousel(products, dayOfYear, IG_USER_ID, TOKEN);
    } else {
      result = await postSingle(products, dayOfYear, IG_USER_ID, TOKEN);
    }

    return res.status(200).json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

/* ── Single product post ── */
async function postSingle(products, dayOfYear, IG_USER_ID, TOKEN) {
  const index = dayOfYear % products.length;
  const product = products[index];

  const containerId = await createMediaContainer(IG_USER_ID, TOKEN, {
    image_url: product.image,
    caption: buildSingleCaption(product),
    alt_text: buildAltText(product),
    location_id: "263981580311674",
  });

  await waitForProcessing(containerId, TOKEN);
  const mediaId = await publish(IG_USER_ID, TOKEN, containerId);

  return { type: "single", product: product.name, mediaId };
}

/* ── Carousel post (category showcase) ── */
async function postCarousel(products, dayOfYear, IG_USER_ID, TOKEN) {
  // Group products by category
  const categories = [...new Set(products.map((p) => p.category))];
  const catIndex = Math.floor(dayOfYear / 3) % categories.length;
  const category = categories[catIndex];
  const catProducts = products.filter((p) => p.category === category).slice(0, 5);

  // Step 1: Create child containers for each image
  const childIds = [];
  for (const product of catProducts) {
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
    if (childData.error) throw new Error(`Child container failed: ${childData.error.message}`);
    childIds.push(childData.id);

    // Wait for each child to process
    await waitForProcessing(childData.id, TOKEN);
  }

  // Step 2: Create carousel container
  const carouselRes = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      media_type: "CAROUSEL",
      children: childIds,
      caption: buildCarouselCaption(category, catProducts),
      location_id: "263981580311674",
      access_token: TOKEN,
    }),
  });
  const carouselData = await carouselRes.json();
  if (carouselData.error) throw new Error(`Carousel failed: ${carouselData.error.message}`);

  await waitForProcessing(carouselData.id, TOKEN);
  const mediaId = await publish(IG_USER_ID, TOKEN, carouselData.id);

  return { type: "carousel", category, products: catProducts.map((p) => p.name), mediaId };
}

/* ── Helpers ── */
async function createMediaContainer(IG_USER_ID, TOKEN, params) {
  const res = await fetch(`${IG_API}/${IG_USER_ID}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...params, access_token: TOKEN }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.id;
}

async function waitForProcessing(containerId, TOKEN) {
  for (let i = 0; i < 10; i++) {
    await new Promise((r) => setTimeout(r, 3000));
    const res = await fetch(`${IG_API}/${containerId}?fields=status_code&access_token=${TOKEN}`);
    const data = await res.json();
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR") throw new Error("Media processing failed");
  }
  throw new Error("Media processing timed out");
}

async function publish(IG_USER_ID, TOKEN, containerId) {
  const res = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ creation_id: containerId, access_token: TOKEN }),
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.id;
}

function buildAltText(product) {
  return `Handcrafted Bidriware ${product.name} — ${product.description.slice(0, 100)}`;
}

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
