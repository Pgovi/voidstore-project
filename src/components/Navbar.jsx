const Icons = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  cart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  heartFilled: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  package: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>,
};

export default function Navbar({
  searchQuery, onSearchChange, wishlistCount, cartCount, user,
  onCartClick, onWishlistClick, onLoginClick, onLogout, onOpenOrders,
  userMenuOpen, setUserMenuOpen, onShopClick, onStoryClick, onContactClick,
  colors, f
}) {
  const { gold, border, t1, t2, t3 } = colors;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 clamp(16px, 4vw, 48px)", height: "64px",
      background: "rgba(255,255,255,0.85)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
      borderBottom: `1px solid ${border}`, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
        <h1 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.5px", cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Bidri<span style={{ color: gold }}>Kala</span>
        </h1>
        <div className="nav-links" style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          {["Shop", "Story", "Contact"].map((item) => (
            <span key={item} style={{ fontSize: "13px", color: t2, cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.target.style.color = t1)}
              onMouseLeave={(e) => (e.target.style.color = t2)}
              onClick={() => {
                if (item === "Shop") onShopClick();
                if (item === "Story") onStoryClick();
                if (item === "Contact") onContactClick();
              }}
            >{item}</span>
          ))}
        </div>
      </div>

      <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div className="search-wrap" style={{ position: "relative" }}>
          <input
            type="text" 
            placeholder="Search..." 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search products"
            style={{
              background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
              borderRadius: "8px", padding: "7px 12px 7px 34px", color: t1, fontSize: "13px",
              fontFamily: f, width: "180px", outline: "none", transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "rgba(0,0,0,0.12)")}
            onBlur={(e) => (e.target.style.borderColor = border)}
          />
          <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: t3 }}>{Icons.search}</span>
        </div>

        {/* Wishlist button */}
        <button aria-label="Wishlist" onClick={onWishlistClick} style={{
          position: "relative", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
          borderRadius: "8px", padding: "7px 10px", color: t2, cursor: "pointer", display: "flex",
          alignItems: "center", fontSize: "13px", fontFamily: f, transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#ef4444"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = wishlistCount > 0 ? "#ef4444" : t2; }}
        >
          {wishlistCount > 0 ? Icons.heartFilled : Icons.heart}
          {wishlistCount > 0 && (
            <span style={{
              position: "absolute", top: "-6px", right: "-6px",
              background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: 700,
              width: "18px", height: "18px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{wishlistCount}</span>
          )}
        </button>

        <button aria-label="Shopping cart" onClick={onCartClick} style={{
          position: "relative", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
          borderRadius: "8px", padding: "7px 10px", color: t2, cursor: "pointer", display: "flex",
          alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: f, transition: "all 0.2s",
        }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = t1; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = t2; }}
        >
          {Icons.cart}
          {cartCount > 0 && (
            <span style={{
              position: "absolute", top: "-6px", right: "-6px",
              background: gold, color: "#fff", fontSize: "10px", fontWeight: 700,
              width: "18px", height: "18px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{cartCount}</span>
          )}
        </button>

        {/* User button */}
        {user ? (
          <div style={{ position: "relative" }}>
            <button aria-label="User menu" onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }} style={{
              background: gold, border: "none", borderRadius: "50%", width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: f,
            }}>{user.name.charAt(0).toUpperCase()}</button>
            {userMenuOpen && (
              <div style={{
                position: "absolute", top: "40px", right: 0, background: "#fff",
                border: `1px solid ${border}`, borderRadius: "10px", padding: "12px 16px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "180px", zIndex: 110,
              }}>
                <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{user.name}</p>
                <p style={{ fontSize: "11px", color: t3, marginBottom: "12px" }}>{user.phone || user.email}</p>
                <button onClick={onOpenOrders} style={{
                  display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none",
                  color: t2, fontSize: "12px", fontFamily: f, cursor: "pointer", padding: 0, marginBottom: "10px",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = t1)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = t2)}
                >{Icons.package} My Orders</button>
                <button onClick={onLogout} style={{
                  display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none",
                  color: t2, fontSize: "12px", fontFamily: f, cursor: "pointer", padding: 0,
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = t2)}
                >{Icons.logout} Logout</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={onLoginClick} style={{
            background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
            borderRadius: "8px", padding: "7px 12px", color: t2, cursor: "pointer",
            fontSize: "13px", fontFamily: f, display: "flex", alignItems: "center", gap: "5px",
            transition: "all 0.2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = t1; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = t2; }}
          >{Icons.user} <span className="login-text">Login</span></button>
        )}
      </div>
    </nav>
  );
}
