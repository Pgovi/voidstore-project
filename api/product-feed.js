const PRODUCTS_API = "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com/products";
const STORE_URL = "https://bidrikalastore.vercel.app";

export default async function handler(req, res) {
  try {
    const prodRes = await fetch(PRODUCTS_API);
    const products = await prodRes.json();
    products.sort((a, b) => parseInt(a.productId) - parseInt(b.productId));

    const items = products
      .map((p) => {
        const availability = p.stock > 0 ? "in stock" : "out of stock";
        const salePrice = p.originalPrice && p.originalPrice > p.price
          ? `${p.price.toFixed(2)} INR`
          : "";
        const originalPrice = p.originalPrice && p.originalPrice > p.price
          ? `${p.originalPrice.toFixed(2)} INR`
          : `${p.price.toFixed(2)} INR`;

        return `    <item>
      <g:id>${escapeXml(p.productId)}</g:id>
      <g:title>${escapeXml(p.name)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${STORE_URL}?product=${encodeURIComponent(p.productId)}</g:link>
      <g:image_link>${escapeXml(p.image)}</g:image_link>
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:price>${originalPrice}</g:price>${salePrice ? `\n      <g:sale_price>${salePrice}</g:sale_price>` : ""}
      <g:brand>BidriKala</g:brand>
      <g:product_type>${escapeXml(p.category)}</g:product_type>
      <g:custom_label_0>${escapeXml(p.category)}</g:custom_label_0>
      <g:custom_label_1>${p.badge ? escapeXml(p.badge) : ""}</g:custom_label_1>
    </item>`;
      })
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>BidriKala - Handcrafted Bidriware</title>
    <link>${STORE_URL}</link>
    <description>Premium handcrafted Bidriware products with pure silver inlay</description>
${items}
  </channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
