const Icons = {
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  minus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  whatsapp: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
};

const FREE_SHIP = 2000;

export default function CartSidebar({ 
  cart, cartCount, cartSubtotal, cartTotal, discount, appliedCoupon,
  couponCode, couponError, onClose, onUpdateQty, onRemoveItem,
  onApplyCoupon, onRemoveCoupon, onCouponChange, onCheckout,
  colors, user, f, mono 
}) {
  const { gold, bg, card, border, t1, t2, t3 } = colors;

  return (
    <div role="dialog" aria-modal="true" aria-label="Shopping cart" onClick={onClose} style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
      zIndex: 300, animation: "fadeIn 0.2s ease",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "min(420px, 90vw)",
        background: "#ffffff", borderLeft: `1px solid ${border}`,
        display: "flex", flexDirection: "column", animation: "slideRight 0.3s ease",
        boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Cart ({cartCount})</h3>
          <button onClick={onClose} aria-label="Close cart" style={{
            background: "rgba(0,0,0,0.04)", border: "none", color: t3,
            cursor: "pointer", width: "32px", height: "32px", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{Icons.close}</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: t3 }}>
              <p style={{ fontSize: "14px" }}>Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} style={{
                display: "flex", gap: "16px", padding: "16px 0",
                borderBottom: `1px solid ${border}`,
              }}>
                <div style={{
                  width: "64px", height: "64px", borderRadius: "8px",
                  background: "#f5f3ef", flexShrink: 0, display: "flex",
                  alignItems: "center", justifyContent: "center",
                }}>
                  <img src={item.image} alt="" style={{ width: "50px", height: "50px", objectFit: "contain" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {item.name.split("—")[0].trim()}
                  </p>
                  <p style={{ fontSize: "13px", color: t2, marginBottom: "10px" }}>₹{item.price.toLocaleString("en-IN")}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", border: `1px solid ${border}`, borderRadius: "6px", overflow: "hidden" }}>
                      <button onClick={() => onUpdateQty(item.id, -1)} aria-label="Decrease quantity" style={{
                        background: "none", border: "none", color: t2, padding: "4px 8px",
                        cursor: "pointer", display: "flex", alignItems: "center",
                      }}>{Icons.minus}</button>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "0 8px", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                      <button onClick={() => onUpdateQty(item.id, 1)} aria-label="Increase quantity" style={{
                        background: "none", border: "none", color: t2, padding: "4px 8px",
                        cursor: "pointer", display: "flex", alignItems: "center",
                      }}>{Icons.plus}</button>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)} aria-label="Remove item" style={{
                      background: "none", border: "none", color: t3, cursor: "pointer",
                      padding: "4px", display: "flex", alignItems: "center", transition: "color 0.2s",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = t3)}
                    >{Icons.trash}</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: `1px solid ${border}` }}>
            {/* Free Shipping Progress */}
            {(() => {
              const remaining = FREE_SHIP - cartSubtotal;
              const pct = Math.min(100, (cartSubtotal / FREE_SHIP) * 100);
              return (
                <div style={{ marginBottom: "16px", padding: "10px 12px", borderRadius: "8px", background: remaining <= 0 ? "rgba(34,197,94,0.06)" : "rgba(0,0,0,0.02)", border: `1px solid ${remaining <= 0 ? "rgba(34,197,94,0.15)" : border}` }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: remaining <= 0 ? "#16a34a" : t2, marginBottom: "8px" }}>
                    {remaining <= 0 ? "You've unlocked FREE shipping!" : `₹${remaining.toLocaleString("en-IN")} away from free shipping`}
                  </p>
                  <div style={{ height: "4px", borderRadius: "4px", background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: "4px", background: remaining <= 0 ? "#22c55e" : gold, transition: "width 0.3s ease" }} />
                  </div>
                </div>
              );
            })()}

            {/* Coupon Code */}
            {!appliedCoupon ? (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => onCouponChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                    placeholder="Coupon code"
                    aria-label="Coupon code"
                    style={{
                      flex: 1, padding: "10px 12px", borderRadius: "8px", fontSize: "13px",
                      background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                      color: t1, fontFamily: mono, letterSpacing: "0.5px", outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = gold)}
                    onBlur={(e) => (e.target.style.borderColor = border)}
                  />
                  <button onClick={onApplyCoupon} style={{
                    padding: "10px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                    background: "rgba(0,0,0,0.05)", border: `1px solid ${border}`,
                    color: t1, fontFamily: f, cursor: "pointer", transition: "all 0.2s", whiteSpace: "nowrap",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; }}
                  >Apply</button>
                </div>
                {couponError && <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px" }}>{couponError}</p>}
              </div>
            ) : (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 12px", borderRadius: "8px", marginBottom: "16px",
                background: "rgba(200,165,90,0.08)", border: `1px solid rgba(200,165,90,0.2)`,
              }}>
                <div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: gold, fontFamily: mono }}>{appliedCoupon.code}</span>
                  <span style={{ fontSize: "12px", color: t2, marginLeft: "8px" }}>— {appliedCoupon.percent}% off</span>
                </div>
                <button onClick={onRemoveCoupon} style={{
                  background: "none", border: "none", color: t3, cursor: "pointer",
                  fontSize: "12px", padding: "2px 6px", transition: "color 0.2s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = t3)}
                >Remove</button>
              </div>
            )}

            {/* Price Breakdown */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: t3 }}>Subtotal</span>
              <span style={{ fontSize: "13px", color: t2 }}>₹{cartSubtotal.toLocaleString("en-IN")}</span>
            </div>
            {discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", color: "#22c55e" }}>Discount ({appliedCoupon.percent}%)</span>
                <span style={{ fontSize: "13px", color: "#22c55e" }}>−₹{discount.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ fontSize: "13px", color: t3 }}>Shipping</span>
              <span style={{ fontSize: "13px", color: "#22c55e" }}>Free</span>
            </div>
            <div style={{ height: "1px", background: border, margin: "12px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <span style={{ fontSize: "15px", fontWeight: 700 }}>Total</span>
              <span style={{ fontSize: "18px", fontWeight: 800 }}>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", background: gold, color: "#0a0806", border: "none",
                padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                fontFamily: f, cursor: "pointer", transition: "opacity 0.2s", marginBottom: "10px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Checkout — ₹{cartTotal.toLocaleString("en-IN")}
            </button>
            <a
              href={`https://wa.me/918660446406?text=${encodeURIComponent(`Hi BidriKala! I'd like to order:\n${cart.map((item) => `• ${item.name.split("—")[0].trim()} × ${item.qty} — ₹${(item.price * item.qty).toLocaleString("en-IN")}`).join("\n")}${discount > 0 ? `\n\nCoupon: ${appliedCoupon.code} (−₹${discount.toLocaleString("en-IN")})` : ""}\n\nTotal: ₹${cartTotal.toLocaleString("en-IN")}`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                width: "100%", background: "#25D366", color: "#fff", border: "none",
                padding: "13px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
                fontFamily: f, cursor: "pointer", textDecoration: "none", transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              {Icons.whatsapp}
              Order via WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
