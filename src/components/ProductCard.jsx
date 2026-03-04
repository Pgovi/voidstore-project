import { useState } from "react";

const Icons = {
  star: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  heartFilled: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bell: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
};

export default function ProductCard({ product, onAddToCart, onViewDetails, isWishlisted, onToggleWishlist, onNotify, colors }) {
  const { gold, bg, card, border, t1, t2, t3 } = colors;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="product-card" style={{
      background: card, borderRadius: "12px", overflow: "hidden",
      border: `1px solid ${border}`, transition: "all 0.3s ease",
      cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}
      onMouseEnter={(e) => { 
        e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; 
        e.currentTarget.style.transform = "translateY(-2px)"; 
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; 
      }}
      onMouseLeave={(e) => { 
        e.currentTarget.style.borderColor = border; 
        e.currentTarget.style.transform = "translateY(0)"; 
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; 
      }}
    >
      {/* Image */}
      <div onClick={onViewDetails} style={{
        position: "relative", aspectRatio: "1", background: "#f5f3ef",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        {!imageLoaded && (
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.04)",
            animation: "pulse 1.5s infinite",
          }} />
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          loading="lazy" 
          onLoad={() => setImageLoaded(true)}
          style={{
            width: "85%", height: "85%", objectFit: "contain", 
            transition: "transform 0.4s ease",
            opacity: imageLoaded ? 1 : 0,
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        {product.badge && (
          <span style={{
            position: "absolute", top: "12px", left: "12px",
            background: product.badge === "New" ? "rgba(0,0,0,0.06)" : gold,
            color: product.badge === "New" ? t1 : "#fff",
            fontSize: "10px", fontWeight: 700, padding: "4px 10px",
            borderRadius: "6px", letterSpacing: "0.5px", textTransform: "uppercase",
            backdropFilter: product.badge === "New" ? "blur(8px)" : "none",
          }}>{product.badge}</span>
        )}
        {product.originalPrice && (
          <span style={{
            position: "absolute", top: "12px", right: "44px",
            background: "rgba(200,165,90,0.15)", color: gold,
            fontSize: "10px", fontWeight: 700, padding: "4px 8px",
            borderRadius: "6px",
          }}>-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }} 
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          style={{
            position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)",
            border: "none", borderRadius: "50%", width: "32px", height: "32px",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: isWishlisted ? "#ef4444" : t3,
            transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
          onMouseEnter={(e) => { if (!isWishlisted) e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={(e) => { if (!isWishlisted) e.currentTarget.style.color = t3; }}
        >{isWishlisted ? Icons.heartFilled : Icons.heart}</button>
      </div>

      {/* Info */}
      <div className="card-info" style={{ padding: "16px" }}>
        <p style={{ 
          fontSize: "11px", color: t3, marginBottom: "6px", 
          textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 
        }}>
          {product.category}
        </p>
        {product.stock <= 5 && (
          <p style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600, marginBottom: "6px" }}>
            Only {product.stock} left in stock
          </p>
        )}
        <h4 className="card-title" onClick={onViewDetails} style={{
          fontSize: "14px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.4,
          letterSpacing: "-0.2px", cursor: "pointer",
        }}>{product.name}</h4>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
          <span style={{ color: gold, display: "flex", alignItems: "center" }}>{Icons.star}</span>
          <span style={{ fontSize: "12px", color: t2 }}>{product.rating}</span>
          <span style={{ fontSize: "12px", color: t3 }}>({product.reviews.toLocaleString()})</span>
        </div>

        <div className="card-price-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="card-prices" style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span className="card-price" style={{ fontSize: "16px", fontWeight: 700 }}>
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.originalPrice && (
              <span style={{ fontSize: "12px", color: t3, textDecoration: "line-through" }}>
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {product.stock > 0 ? (
            <button 
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} 
              aria-label={`Add ${product.name} to cart`}
              style={{
                background: "rgba(0,0,0,0.05)", border: `1px solid ${border}`,
                color: t2, padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { 
                e.target.style.background = t1; 
                e.target.style.color = bg; 
                e.target.style.borderColor = t1; 
              }}
              onMouseLeave={(e) => { 
                e.target.style.background = "rgba(0,0,0,0.05)"; 
                e.target.style.color = t2; 
                e.target.style.borderColor = border; 
              }}
            >Add</button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); onNotify(product.id); }} 
              aria-label={`Notify when ${product.name} is available`}
              style={{
                background: "rgba(176,141,62,0.1)", border: `1px solid rgba(176,141,62,0.2)`,
                color: gold, padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                fontWeight: 600, cursor: "pointer", display: "flex",
                alignItems: "center", gap: "4px", transition: "all 0.2s",
              }}
            >{Icons.bell} Notify</button>
          )}
        </div>
      </div>
    </div>
  );
}
