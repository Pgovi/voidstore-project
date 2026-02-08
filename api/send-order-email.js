export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) return res.status(500).json({ error: "Email not configured" });

  try {
    const { orderId, upiTxnId, customerName, customerEmail, customerPhone, address, items, subtotal, discount, total } = req.body;
    if (!customerEmail || !orderId) return res.status(400).json({ error: "Missing required fields" });

    const itemRows = items
      .map((item) => `<tr><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#e4e4e7">${item.name}</td><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#a1a1aa;text-align:center">${item.qty}</td><td style="padding:8px 12px;border-bottom:1px solid #27272a;color:#e4e4e7;text-align:right">₹${(item.price * item.qty).toLocaleString("en-IN")}</td></tr>`)
      .join("");

    const html = `
    <div style="max-width:520px;margin:0 auto;font-family:'Segoe UI',Arial,sans-serif;background:#09090b;color:#e4e4e7;padding:32px;border-radius:12px">
      <div style="text-align:center;margin-bottom:24px">
        <h1 style="font-size:22px;font-weight:800;color:#fafafa;margin:0 0 4px">BidriKala</h1>
        <p style="font-size:12px;color:#71717a;margin:0">Handcrafted Bidriware from Bidar</p>
      </div>
      <div style="text-align:center;padding:20px;background:rgba(34,197,94,0.08);border-radius:10px;margin-bottom:20px">
        <p style="font-size:28px;margin:0 0 4px">✓</p>
        <h2 style="font-size:18px;font-weight:700;color:#22c55e;margin:0 0 4px">Order Received!</h2>
        <p style="font-size:13px;color:#a1a1aa;margin:0 0 6px">Thank you for your purchase, ${customerName}</p>
        <p style="font-size:11px;color:#f59e0b;margin:0;padding:4px 10px;border-radius:4px;background:rgba(245,158,11,0.1);display:inline-block">We'll verify your payment and confirm shortly</p>
      </div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px;margin-bottom:16px">
        <p style="font-size:11px;color:#71717a;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Order Details</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:6px 12px;color:#71717a;font-size:12px">Order ID</td><td style="padding:6px 12px;color:#c8a55a;font-size:12px;font-weight:600;text-align:right">${orderId}</td></tr>
          <tr><td style="padding:6px 12px;color:#71717a;font-size:12px">Payment</td><td style="padding:6px 12px;color:#e4e4e7;font-size:12px;text-align:right">UPI</td></tr>
          ${upiTxnId ? `<tr><td style="padding:6px 12px;color:#71717a;font-size:12px">UPI Txn ID</td><td style="padding:6px 12px;color:#e4e4e7;font-size:12px;font-weight:600;text-align:right">${upiTxnId}</td></tr>` : ""}
        </table>
      </div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px;margin-bottom:16px">
        <p style="font-size:11px;color:#71717a;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Items</p>
        <table style="width:100%;border-collapse:collapse">${itemRows}</table>
        <div style="margin-top:12px;padding-top:8px;border-top:1px solid #27272a">
          <table style="width:100%">
            <tr><td style="padding:4px 12px;color:#a1a1aa;font-size:12px">Subtotal</td><td style="padding:4px 12px;color:#e4e4e7;font-size:12px;text-align:right">₹${subtotal.toLocaleString("en-IN")}</td></tr>
            ${discount > 0 ? `<tr><td style="padding:4px 12px;color:#22c55e;font-size:12px">Discount</td><td style="padding:4px 12px;color:#22c55e;font-size:12px;text-align:right">−₹${discount.toLocaleString("en-IN")}</td></tr>` : ""}
            <tr><td style="padding:4px 12px;color:#e4e4e7;font-size:14px;font-weight:700">Total</td><td style="padding:4px 12px;color:#c8a55a;font-size:16px;font-weight:800;text-align:right">₹${total.toLocaleString("en-IN")}</td></tr>
          </table>
        </div>
      </div>
      <div style="background:#18181b;border:1px solid #27272a;border-radius:10px;padding:16px;margin-bottom:20px">
        <p style="font-size:11px;color:#71717a;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px">Shipping To</p>
        <p style="font-size:13px;color:#fafafa;font-weight:600;margin:0 0 2px">${customerName}</p>
        <p style="font-size:12px;color:#a1a1aa;margin:0 0 2px">${address}</p>
        <p style="font-size:12px;color:#a1a1aa;margin:0">${customerPhone}</p>
      </div>
      <div style="text-align:center;padding-top:16px;border-top:1px solid #27272a">
        <p style="font-size:12px;color:#71717a;margin:0 0 4px">Questions? Contact us at</p>
        <p style="font-size:12px;color:#c8a55a;margin:0">namaste@bidrikala.in · +91 86604 46406</p>
      </div>
    </div>`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "BidriKala <onboarding@resend.dev>",
        to: customerEmail,
        subject: `Order Received — ${orderId} | BidriKala`,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Email send failed");
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error.message);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
}
