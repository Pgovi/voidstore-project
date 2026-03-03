const IG_API = "https://graph.instagram.com/v21.0";
const PRODUCTS_API = "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com/products";

export default async function handler(req, res) {
  // Verify this is a cron call (Vercel sends this header)
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
  const IG_USER_ID = process.env.INSTAGRAM_USER_ID;

  if (!TOKEN || !IG_USER_ID) {
    return res.status(500).json({ error: "Missing Instagram credentials" });
  }

  try {
    // Fetch all products
    const prodRes = await fetch(PRODUCTS_API);
    const products = await prodRes.json();
    products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));

    // Pick today's product using day-of-year rotation
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((now - start) / 86400000);
    const index = dayOfYear % products.length;
    const product = products[index];

    // Build caption and alt text
    const caption = buildCaption(product);
    const altText = `Handcrafted Bidriware ${product.name} — ${product.description.slice(0, 100)}`;

    // Step 1: Create media container with alt text and location
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
    if (createData.error) throw new Error(createData.error.message);

    // Step 2: Wait for processing
    let ready = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      const statusRes = await fetch(
        `${IG_API}/${createData.id}?fields=status_code&access_token=${TOKEN}`
      );
      const statusData = await statusRes.json();
      if (statusData.status_code === "FINISHED") { ready = true; break; }
      if (statusData.status_code === "ERROR") throw new Error("Media processing failed");
    }
    if (!ready) throw new Error("Media processing timed out");

    // Step 3: Publish
    const pubRes = await fetch(`${IG_API}/${IG_USER_ID}/media_publish`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creation_id: createData.id, access_token: TOKEN }),
    });
    const pubData = await pubRes.json();
    if (pubData.error) throw new Error(pubData.error.message);

    return res.status(200).json({
      success: true,
      product: product.name,
      mediaId: pubData.id,
      dayIndex: index,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

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
