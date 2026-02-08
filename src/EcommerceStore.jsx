import { useState, useRef, useEffect } from "react";

const API = "https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com";

const CRAFT_STEPS = [
  { step: "01", title: "Moulding", desc: "Casting a zinc-copper alloy in the ancient 1:16 ratio into rough forms using clay and resin moulds." },
  { step: "02", title: "Smoothening", desc: "Filing and smoothing the rough casting on a hand-turned lathe, revealing the metal's true surface." },
  { step: "03", title: "Designing", desc: "Master karigars sketch intricate Persian-Deccani motifs freehand onto the metal with a sharp stylus." },
  { step: "04", title: "Engraving", desc: "Using chisel and hammer, artisans cut deep grooves following the sketched patterns with precision." },
  { step: "05", title: "Inlaying", desc: "Pure silver wire and sheet (97% purity) is carefully pressed and hammered into the engraved channels." },
  { step: "06", title: "Buffing", desc: "The surface is buffed to make the silver sit perfectly flush with the alloy, creating a seamless finish." },
  { step: "07", title: "Polishing", desc: "Coconut oil and fine abrasives bring out the silver's brilliant lustre against the alloy surface." },
  { step: "08", title: "Oxidising", desc: "Bidar Fort soil — rich in potassium nitrate — turns the alloy jet-black while silver stays gleaming." },
];

const INFO_CONTENT = {
  "History of Bidri": "Bidriware originated in the 14th century during the reign of the Bahmani Sultans in Bidar, Karnataka. Abdullah bin Kaiser, a Persian craftsman, was invited by Sultan Ahmed Shah Bahmani to decorate the royal court. The craft blends Persian metalwork techniques with Indian design sensibilities, creating a unique art form that has survived over 600 years.",
  "The 8-Step Process": "Each Bidriware piece undergoes 8 meticulous stages: (1) Moulding — casting the zinc-copper alloy (1:16 ratio), (2) Smoothening — filing the surface, (3) Designing — sketching motifs with chisels, (4) Engraving — cutting patterns with chisel and hammer, (5) Silver Inlaying — pressing pure silver wire/sheet into grooves, (6) Smoothening — buffing the silver flush, (7) Buffing — polishing the surface, (8) Oxidising — applying Bidar Fort soil paste to blacken the alloy while leaving silver untouched.",
  "Bidar Fort Soil": "The secret behind Bidriware's signature jet-black finish lies in the soil from the 15th-century Bidar Fort. This soil is uniquely rich in potassium nitrate. When mixed with ammonium chloride and water, it creates a paste that selectively oxidises the zinc-copper alloy to a deep matte black — while leaving the silver inlay gleaming. No other soil in the world produces this exact chemical reaction.",
  "Contact Us": "BidriKala — Direct from Bidar's artisan families to your home.\n\nEmail: namaste@bidrikala.in\nPhone: +91 86604 46406\nWorkshop: Mangalpet Road, Bidar, Karnataka 585401\n\nVisit our workshop to see master karigars at work. Tours available by appointment.",
  "Shipping & Delivery": "All BidriKala products are carefully wrapped in velvet-lined heritage boxes.\n\nIndia: Free shipping on all orders. Delivery in 5-7 business days.\nInternational: Shipped via insured courier. Delivery in 10-15 business days.\n\nEvery piece is packed with traditional handmade paper and includes a care guide.",
  "Returns Policy": "We stand behind every piece crafted by our artisans.\n\n30-Day Returns: If you're not completely satisfied, return within 30 days for a full refund.\nDamage Protection: All shipments are insured. Report any damage within 48 hours.\nExchange: Happy to exchange for a different piece of equal or greater value.\n\nContact us at namaste@bidrikala.in to initiate a return.",
  "Care Guide": "Bidriware is remarkably durable — pieces from the 15th century still survive in museums.\n\nDaily Care: Wipe with a soft dry cloth to maintain the silver's shine.\nDeep Clean: Use a mild silver polish on inlay areas only. Avoid abrasive cleaners.\nDo Not: Soak in water, use chemical cleaners, or expose to extreme heat.\nDisplay: Keep away from direct sunlight to preserve the matte-black finish.\n\nWith proper care, your Bidriware will last generations.",
};

/* ───── SVG Icons (inline for zero deps) ───── */
const Icons = {
  search: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  cart: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>,
  close: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  minus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/></svg>,
  plus: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14"/><path d="M5 12h14"/></svg>,
  trash: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  star: <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  whatsapp: <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/></svg>,
  arrowUp: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>,
  instagram: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  facebook: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  heartFilled: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  bell: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  mail: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  user: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  logout: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  package: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>,
};

export default function EcommerceStore() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ message: "", visible: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [craftSheetOpen, setCraftSheetOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1 = details, 2 = payment, 3 = success
  const [customerForm, setCustomerForm] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
  const [formErrors, setFormErrors] = useState({});
  const [orderId, setOrderId] = useState("");
  const [upiTxnId, setUpiTxnId] = useState("");
  const [txnError, setTxnError] = useState("");
  const [socialProof, setSocialProof] = useState({ visible: false, product: "", buyer: "", city: "" });
  const [wishlist, setWishlist] = useState(() => { try { return JSON.parse(localStorage.getItem("bk_wishlist")) || []; } catch { return []; } });
  const [recentlyViewed, setRecentlyViewed] = useState(() => { try { return JSON.parse(localStorage.getItem("bk_recent")) || []; } catch { return []; } });
  const [sortBy, setSortBy] = useState("featured");
  const [emailPopup, setEmailPopup] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyProductId, setNotifyProductId] = useState(null);
  const [user, setUser] = useState(() => { try { return JSON.parse(localStorage.getItem("bk_user")); } catch { return null; } });
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem("bk_token"));
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginForm, setLoginForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authMode, setAuthMode] = useState("login"); // "login" | "signup" | "verify"
  const [verifyCode, setVerifyCode] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [ordersOpen, setOrdersOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const shopRef = useRef(null);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  /* Fetch products from API */
  useEffect(() => {
    fetch(`${API}/products`)
      .then((r) => r.json())
      .then((data) => {
        const normalized = data.map((p) => ({
          ...p,
          id: parseInt(p.productId),
          originalPrice: p.originalPrice === 0 ? null : p.originalPrice,
          badge: p.badge === "" ? null : p.badge,
        }));
        setProducts(normalized.sort((a, b) => a.id - b.id));
      })
      .catch(() => {});
  }, []);

  /* Fetch cart from API when logged in */
  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API}/cart`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((items) => {
        if (!Array.isArray(items) || items.length === 0) return;
        setCart((prev) => {
          if (prev.length > 0) return prev;
          return items.map((ci) => {
            const p = products.find((pr) => pr.productId === ci.productId);
            return p ? { ...p, qty: ci.qty } : null;
          }).filter(Boolean);
        });
      })
      .catch(() => {});
  }, [accessToken, products]);

  /* Fetch wishlist from API when logged in */
  useEffect(() => {
    if (!accessToken) return;
    fetch(`${API}/wishlist`, { headers: { Authorization: `Bearer ${accessToken}` } })
      .then((r) => r.json())
      .then((items) => {
        if (!Array.isArray(items) || items.length === 0) return;
        setWishlist(items.map((w) => parseInt(w.productId)).filter(Boolean));
      })
      .catch(() => {});
  }, [accessToken]);

  const showNotification = (msg) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 2200);
  };

  /* Login / Logout — Cognito Auth */
  const handleSignup = async () => {
    const { name, phone, email, password } = loginForm;
    if (!name.trim()) { setLoginError("Name is required"); return; }
    if (!phone.trim() && !email.trim()) { setLoginError("Phone or email is required"); return; }
    if (phone.trim() && !/^\d{10}$/.test(phone.trim())) { setLoginError("Enter a valid 10-digit phone number"); return; }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setLoginError("Enter a valid email"); return; }
    if (!password || password.length < 8) { setLoginError("Password must be at least 8 characters"); return; }
    setAuthLoading(true); setLoginError("");
    try {
      const res = await fetch(`${API}/auth/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setAuthUsername(email.trim() || `+91${phone.trim()}`);
      setAuthMode("verify");
      showNotification("Verification code sent!");
    } catch (err) { setLoginError(err.message); }
    setAuthLoading(false);
  };

  const handleVerify = async () => {
    if (!verifyCode.trim()) { setLoginError("Enter verification code"); return; }
    setAuthLoading(true); setLoginError("");
    try {
      const res = await fetch(`${API}/auth/verify`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: authUsername, code: verifyCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");
      showNotification("Verified! Logging in...");
      await doLogin(authUsername, loginForm.password);
    } catch (err) { setLoginError(err.message); }
    setAuthLoading(false);
  };

  const handleLoginSubmit = async () => {
    const { phone, email, password } = loginForm;
    const username = email.trim() || (phone.trim() ? `+91${phone.trim()}` : "");
    if (!username) { setLoginError("Phone or email is required"); return; }
    if (!password) { setLoginError("Password is required"); return; }
    setAuthLoading(true); setLoginError("");
    try { await doLogin(username, password); }
    catch (err) { setLoginError(err.message); }
    setAuthLoading(false);
  };

  const doLogin = async (username, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    const token = data.accessToken;
    localStorage.setItem("bk_token", token);
    setAccessToken(token);
    const profRes = await fetch(`${API}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
    const profile = await profRes.json();
    const userData = { name: profile.name || loginForm.name.trim(), phone: profile.phone || loginForm.phone.trim(), email: profile.email || loginForm.email.trim(), userId: profile.userId };
    localStorage.setItem("bk_user", JSON.stringify(userData));
    setUser(userData);
    setLoginOpen(false); setLoginError(""); setAuthMode("login");
    showNotification(`Welcome, ${userData.name}!`);
    setCartOpen(false); setCheckoutOpen(true); setCheckoutStep(1); setFormErrors({});
    setCustomerForm((prev) => ({ ...prev, name: userData.name, phone: userData.phone, email: userData.email }));
  };

  const handleLogout = () => {
    localStorage.removeItem("bk_user");
    localStorage.removeItem("bk_token");
    setUser(null);
    setAccessToken(null);
    setUserMenuOpen(false);
    showNotification("Logged out");
  };

  /* Fetch orders */
  const fetchOrders = async () => {
    if (!accessToken) return;
    try {
      const res = await fetch(`${API}/orders`, { headers: { Authorization: `Bearer ${accessToken}` } });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch {}
  };
  const openOrders = () => { setOrdersOpen(true); setUserMenuOpen(false); fetchOrders(); };

  /* Wishlist helpers */
  const toggleWishlist = (productId) => {
    const adding = !wishlist.includes(productId);
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem("bk_wishlist", JSON.stringify(next));
      showNotification(next.includes(productId) ? "Added to wishlist" : "Removed from wishlist");
      return next;
    });
    if (accessToken) {
      const pid = String(productId);
      if (adding) {
        fetch(`${API}/wishlist/${pid}`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => {});
      } else {
        fetch(`${API}/wishlist/${pid}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => {});
      }
    }
  };
  const isWishlisted = (productId) => wishlist.includes(productId);

  /* Recently viewed — track when product detail opens */
  useEffect(() => {
    if (selectedProduct) {
      setRecentlyViewed((prev) => {
        const next = [selectedProduct.id, ...prev.filter((id) => id !== selectedProduct.id)].slice(0, 8);
        localStorage.setItem("bk_recent", JSON.stringify(next));
        return next;
      });
    }
  }, [selectedProduct]);

  /* Close user menu on outside click */
  useEffect(() => {
    if (!userMenuOpen) return;
    const close = () => setUserMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [userMenuOpen]);

  /* Email capture popup — show after 8s on first visit */
  useEffect(() => {
    if (!localStorage.getItem("bk_email_dismissed")) {
      const t = setTimeout(() => setEmailPopup(true), 8000);
      return () => clearTimeout(t);
    }
  }, []);
  const dismissEmailPopup = () => { setEmailPopup(false); localStorage.setItem("bk_email_dismissed", "1"); };

  /* Social proof — "Someone just bought..." popup */
  const buyers = ["Priya", "Rahul", "Ananya", "Vikram", "Sneha", "Arjun", "Meera", "Karthik", "Divya", "Aditya"];
  const cities = ["Mumbai", "Bangalore", "Delhi", "Hyderabad", "Pune", "Chennai", "Kolkata", "Jaipur", "Ahmedabad", "Lucknow"];
  useEffect(() => {
    if (products.length === 0) return;
    const timer = setInterval(() => {
      const p = products[Math.floor(Math.random() * products.length)];
      const b = buyers[Math.floor(Math.random() * buyers.length)];
      const c = cities[Math.floor(Math.random() * cities.length)];
      setSocialProof({ visible: true, product: p.name.split("—")[0].trim(), buyer: b, city: c, image: p.image });
      setTimeout(() => setSocialProof((s) => ({ ...s, visible: false })), 4000);
    }, 18000 + Math.random() * 12000);
    return () => clearInterval(timer);
  }, [products]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      const newQty = exists ? exists.qty + 1 : 1;
      if (accessToken) {
        fetch(`${API}/cart`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({ productId: String(product.id), qty: newQty }),
        }).catch(() => {});
      }
      if (exists) return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`${product.name.split("—")[0].trim()} added`);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (accessToken) fetch(`${API}/cart/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => {});
  };
  const updateQty = (id, delta) => {
    setCart((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item)).filter((item) => item.qty > 0);
      const item = updated.find((i) => i.id === id);
      if (accessToken) {
        if (item) {
          fetch(`${API}/cart/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
            body: JSON.stringify({ qty: item.qty }),
          }).catch(() => {});
        } else {
          fetch(`${API}/cart/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } }).catch(() => {});
        }
      }
      return updated;
    });
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const applyCoupon = () => {
    setCouponError("");
    const code = couponCode.trim().toUpperCase();
    if (code === "BIDRI20") {
      if (cartSubtotal >= 5000) {
        setAppliedCoupon({ code: "BIDRI20", percent: 20 });
        setCouponError("");
        showNotification("Coupon BIDRI20 applied — 20% OFF!");
      } else {
        setCouponError("Min. order ₹5,000 for this code");
      }
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const validateCheckout = () => {
    const errs = {};
    if (!customerForm.name.trim()) errs.name = "Name is required";
    if (!/^\d{10}$/.test(customerForm.phone.trim())) errs.phone = "Enter 10-digit phone number";
    if (customerForm.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email.trim())) errs.email = "Invalid email";
    if (!customerForm.address.trim()) errs.address = "Address is required";
    if (!customerForm.city.trim()) errs.city = "City is required";
    if (!customerForm.state.trim()) errs.state = "State is required";
    if (!/^\d{6}$/.test(customerForm.pincode.trim())) errs.pincode = "Enter 6-digit pincode";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const proceedToPayment = () => {
    if (validateCheckout()) setCheckoutStep(2);
  };

  const confirmPayment = async () => {
    const txn = upiTxnId.trim();
    if (!txn || txn.length < 6) { setTxnError("Enter a valid UPI Transaction ID / UTR number"); return; }
    setTxnError("");
    const shippingAddress = `${customerForm.address}, ${customerForm.city}, ${customerForm.state} — ${customerForm.pincode}`;

    // Save order to AWS
    if (accessToken) {
      try {
        const res = await fetch(`${API}/orders`, {
          method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify({
            items: cart.map((item) => ({ productId: String(item.id), name: item.name, qty: item.qty, price: item.price })),
            subtotal: cartSubtotal, discount, total: cartTotal,
            paymentMethod: "UPI", upiTxnId: txn, shippingAddress,
          }),
        });
        const data = await res.json();
        setOrderId(data.orderId || `BK${Date.now().toString(36).toUpperCase()}`);
      } catch { setOrderId(`BK${Date.now().toString(36).toUpperCase()}`); }
    } else {
      setOrderId(`BK${Date.now().toString(36).toUpperCase()}`);
    }
    setCheckoutStep(3);

    // Send confirmation email to customer
    if (customerForm.email) {
      fetch("/api/send-order-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId, upiTxnId: txn,
          customerName: customerForm.name, customerEmail: customerForm.email, customerPhone: customerForm.phone,
          address: shippingAddress,
          items: cart.map((item) => ({ name: item.name.split("—")[0].trim(), qty: item.qty, price: item.price })),
          subtotal: cartSubtotal, discount, total: cartTotal,
        }),
      }).catch(() => {});
    }
  };

  const closeOrderSuccess = () => {
    setCheckoutOpen(false);
    setCheckoutStep(1);
    setCart([]);
    setCustomerForm({ name: "", phone: "", email: "", address: "", city: "", state: "", pincode: "" });
    setAppliedCoupon(null);
    setCouponCode("");
    setOrderId("");
    setUpiTxnId("");
    setTxnError("");
  };

  const discount = appliedCoupon ? Math.round(cartSubtotal * appliedCoupon.percent / 100) : 0;
  const cartTotal = cartSubtotal - discount;

  const filteredProducts = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "bestselling") return b.reviews - a.reviews;
    return 0; // featured — default order
  });

  const recentProducts = recentlyViewed.map((id) => products.find((p) => p.id === id)).filter(Boolean);

  const handleFooterLink = (link) => {
    const catMap = { "All Products": "All", "Wall Art": "Wall Art", Figurines: "Figurines", Jewelry: "Jewelry", Earrings: "Earrings", Pendants: "Pendants" };
    if (catMap[link] !== undefined) {
      setActiveCategory(catMap[link]);
      shopRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (INFO_CONTENT[link]) {
      setInfoModal(link);
    }
  };

  const f = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  const mono = "'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace";
  const gold = "#b08d3e";
  const bg = "#faf9f7";
  const card = "#ffffff";
  const border = "rgba(0,0,0,0.08)";
  const t1 = "#1c1917";
  const t2 = "#57534e";
  const t3 = "#a8a29e";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ minHeight: "100vh", background: bg, color: t1, fontFamily: f }}>

        {/* ══════ ANNOUNCEMENT BAR ══════ */}
        <div style={{
          padding: "10px clamp(16px, 4vw, 48px)", textAlign: "center",
          borderBottom: `1px solid ${border}`, background: "rgba(176,141,62,0.05)",
        }}>
          <p style={{ fontSize: "13px", color: t2 }}>
            <span style={{ fontWeight: 700, color: t1 }}>SUMMER SALE</span>
            {" "}&mdash; Flat 20% OFF on orders above ₹5,000{" "}
            <span style={{
              fontFamily: mono, fontSize: "12px", background: "rgba(0,0,0,0.05)",
              border: `1px solid ${border}`, padding: "3px 10px", borderRadius: "6px",
              marginLeft: "8px", color: gold, fontWeight: 600, letterSpacing: "0.5px",
            }}>Code: BIDRI20</span>
          </p>
        </div>

        {/* ══════ NAVBAR ══════ */}
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
                    if (item === "Shop") shopRef.current?.scrollIntoView({ behavior: "smooth" });
                    if (item === "Story") setCraftSheetOpen(true);
                    if (item === "Contact") setInfoModal("Contact Us");
                  }}
                >{item}</span>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div className="search-wrap" style={{ position: "relative" }}>
              <input
                type="text" placeholder="Search..." value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); if (e.target.value) shopRef.current?.scrollIntoView({ behavior: "smooth" }); }}
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
            <button onClick={() => setWishlistOpen(true)} style={{
              position: "relative", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
              borderRadius: "8px", padding: "7px 10px", color: t2, cursor: "pointer", display: "flex",
              alignItems: "center", fontSize: "13px", fontFamily: f, transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = wishlist.length > 0 ? "#ef4444" : t2; }}
            >
              {wishlist.length > 0 ? Icons.heartFilled : Icons.heart}
              {wishlist.length > 0 && (
                <span style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  background: "#ef4444", color: "#fff", fontSize: "10px", fontWeight: 700,
                  width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{wishlist.length}</span>
              )}
            </button>

            <button onClick={() => setCartOpen(true)} style={{
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
                <button onClick={(e) => { e.stopPropagation(); setUserMenuOpen(!userMenuOpen); }} style={{
                  background: gold, border: "none", borderRadius: "50%", width: "32px", height: "32px",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                  color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: f,
                }}>{user.name.charAt(0).toUpperCase()}</button>
                {userMenuOpen && (
                  <div style={{
                    position: "absolute", top: "40px", right: 0, background: card,
                    border: `1px solid ${border}`, borderRadius: "10px", padding: "12px 16px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "180px", zIndex: 110,
                  }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, marginBottom: "2px" }}>{user.name}</p>
                    <p style={{ fontSize: "11px", color: t3, marginBottom: "12px" }}>{user.phone || user.email}</p>
                    <button onClick={openOrders} style={{
                      display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none",
                      color: t2, fontSize: "12px", fontFamily: f, cursor: "pointer", padding: 0, marginBottom: "10px",
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = t1)}
                      onMouseLeave={(e) => (e.currentTarget.style.color = t2)}
                    >{Icons.package} My Orders</button>
                    <button onClick={handleLogout} style={{
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
              <button onClick={() => setLoginOpen(true)} style={{
                background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                borderRadius: "8px", padding: "7px 12px", color: t2, cursor: "pointer",
                fontSize: "13px", fontFamily: f, display: "flex", alignItems: "center", gap: "5px",
                transition: "all 0.2s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = t1; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = t2; }}
              >{Icons.user} Login</button>
            )}

            <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{
              display: "none", background: "none", border: "none", color: t2, cursor: "pointer", padding: "4px",
            }}>{Icons.menu}</button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{
            position: "fixed", inset: 0, top: "64px", background: "rgba(255,255,255,0.97)", zIndex: 99,
            display: "flex", flexDirection: "column", padding: "32px 24px", gap: "24px",
            backdropFilter: "blur(20px)",
          }}>
            {["Shop", "Story", "Contact"].map((item) => (
              <span key={item} style={{ fontSize: "20px", fontWeight: 600, color: t1, cursor: "pointer" }}
                onClick={() => {
                  setMobileMenu(false);
                  if (item === "Shop") shopRef.current?.scrollIntoView({ behavior: "smooth" });
                  if (item === "Story") setCraftSheetOpen(true);
                  if (item === "Contact") setInfoModal("Contact Us");
                }}
              >{item}</span>
            ))}
          </div>
        )}

        {/* ══════ HERO ══════ */}
        <section style={{
          padding: "clamp(60px, 12vw, 120px) clamp(16px, 4vw, 48px) clamp(40px, 8vw, 80px)",
          maxWidth: "900px", textAlign: "center", margin: "0 auto",
        }}>
          <div style={{
            display: "inline-block", padding: "5px 14px", borderRadius: "9999px",
            border: `1px solid ${border}`, fontSize: "12px", color: t2, marginBottom: "24px",
            background: "rgba(0,0,0,0.02)",
          }}>
            600-year-old craft. Handmade in Bidar.
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 6vw, 64px)", fontWeight: 900, letterSpacing: "-2px",
            lineHeight: 1.05, marginBottom: "20px",
          }}>
            Silver on Black.
            <br />
            <span style={{ color: gold }}>Timeless Art.</span>
          </h2>
          <p style={{ fontSize: "clamp(15px, 2vw, 18px)", color: t2, lineHeight: 1.7, maxWidth: "560px", margin: "0 auto 36px" }}>
            Handcrafted Bidriware — pure silver inlaid on matte-black alloy by master artisans from Bidar, Karnataka.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })} className="btn-primary" style={{
              background: t1, color: bg, border: "none", padding: "12px 28px",
              borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: f,
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >Shop Collection</button>
            <button onClick={() => setCraftSheetOpen(true)} style={{
              background: "transparent", color: t2, border: `1px solid ${border}`,
              padding: "12px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
              fontFamily: f, cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.target.style.borderColor = "rgba(0,0,0,0.15)"; e.target.style.color = t1; }}
              onMouseLeave={(e) => { e.target.style.borderColor = border; e.target.style.color = t2; }}
            >Our Process</button>
          </div>
        </section>

        {/* ══════ TRUST BAR ══════ */}
        <div style={{
          display: "flex", justifyContent: "center", gap: "clamp(24px, 5vw, 56px)",
          padding: "24px clamp(16px, 4vw, 48px)", borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`, flexWrap: "wrap",
        }}>
          {[
            { label: "Free Shipping", sub: "All India" },
            { label: "Handmade", sub: "8-Step Process" },
            { label: "30-Day Returns", sub: "Easy Exchange" },
          ].map((b) => (
            <div key={b.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: t1, marginBottom: "2px" }}>{b.label}</p>
              <p style={{ fontSize: "11px", color: t3 }}>{b.sub}</p>
            </div>
          ))}
        </div>

        {/* ══════ SHOP SECTION ══════ */}
        <section ref={shopRef} style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

            {/* Section header */}
            <div style={{ marginBottom: "32px" }}>
              <h3 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "16px" }}>
                Shop All
              </h3>

              {/* Category pills + Sort */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                      background: activeCategory === cat ? t1 : "rgba(0,0,0,0.04)",
                      color: activeCategory === cat ? bg : t2,
                      border: activeCategory === cat ? "none" : `1px solid ${border}`,
                      padding: "7px 16px", borderRadius: "9999px", fontSize: "13px",
                      fontWeight: 500, fontFamily: f, cursor: "pointer", transition: "all 0.2s",
                    }}>{cat}</button>
                  ))}
                </div>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{
                  background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px",
                  padding: "7px 12px", fontSize: "13px", color: t2, fontFamily: f,
                  cursor: "pointer", outline: "none",
                }}>
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low → High</option>
                  <option value="price-high">Price: High → Low</option>
                  <option value="bestselling">Bestselling</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card" style={{
                  background: card, borderRadius: "12px", overflow: "hidden",
                  border: `1px solid ${border}`, transition: "all 0.3s ease",
                  cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
                >
                  {/* Image */}
                  <div onClick={() => setSelectedProduct(product)} style={{
                    position: "relative", aspectRatio: "1", background: "#f5f3ef",
                    display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                  }}>
                    <img src={product.image} alt={product.name} loading="lazy" style={{
                      width: "85%", height: "85%", objectFit: "contain", transition: "transform 0.4s ease",
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
                    <button onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }} style={{
                      position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)",
                      border: "none", borderRadius: "50%", width: "32px", height: "32px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", color: isWishlisted(product.id) ? "#ef4444" : t3,
                      transition: "all 0.2s", boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                      onMouseEnter={(e) => { if (!isWishlisted(product.id)) e.currentTarget.style.color = "#ef4444"; }}
                      onMouseLeave={(e) => { if (!isWishlisted(product.id)) e.currentTarget.style.color = t3; }}
                    >{isWishlisted(product.id) ? Icons.heartFilled : Icons.heart}</button>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontSize: "11px", color: t3, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
                      {product.category}
                    </p>
                    {product.stock <= 5 && (
                      <p style={{ fontSize: "11px", color: "#dc2626", fontWeight: 600, marginBottom: "6px" }}>
                        Only {product.stock} left in stock
                      </p>
                    )}
                    <h4 onClick={() => setSelectedProduct(product)} style={{
                      fontSize: "14px", fontWeight: 600, marginBottom: "8px", lineHeight: 1.4,
                      letterSpacing: "-0.2px", cursor: "pointer",
                    }}>{product.name}</h4>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                      <span style={{ color: gold, display: "flex", alignItems: "center" }}>{Icons.star}</span>
                      <span style={{ fontSize: "12px", color: t2 }}>{product.rating}</span>
                      <span style={{ fontSize: "12px", color: t3 }}>({product.reviews.toLocaleString()})</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 700 }}>
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                        {product.originalPrice && (
                          <span style={{ fontSize: "12px", color: t3, textDecoration: "line-through" }}>
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      {product.stock > 0 ? (
                        <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{
                          background: "rgba(0,0,0,0.05)", border: `1px solid ${border}`,
                          color: t2, padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                          fontWeight: 600, fontFamily: f, cursor: "pointer", transition: "all 0.2s",
                        }}
                          onMouseEnter={(e) => { e.target.style.background = t1; e.target.style.color = bg; e.target.style.borderColor = t1; }}
                          onMouseLeave={(e) => { e.target.style.background = "rgba(0,0,0,0.05)"; e.target.style.color = t2; e.target.style.borderColor = border; }}
                        >Add</button>
                      ) : (
                        <button onClick={(e) => { e.stopPropagation(); setNotifyProductId(product.id); }} style={{
                          background: "rgba(176,141,62,0.1)", border: `1px solid rgba(176,141,62,0.2)`,
                          color: gold, padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                          fontWeight: 600, fontFamily: f, cursor: "pointer", display: "flex",
                          alignItems: "center", gap: "4px", transition: "all 0.2s",
                        }}>{Icons.bell} Notify</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div style={{ textAlign: "center", padding: "80px 0", color: t3 }}>
                <p style={{ fontSize: "16px", fontWeight: 500 }}>No products found</p>
                <p style={{ fontSize: "13px", marginTop: "8px", color: t3 }}>Try a different search or category</p>
              </div>
            )}
          </div>
        </section>

        {/* ══════ RECENTLY VIEWED ══════ */}
        {recentProducts.length > 1 && (
          <section style={{ padding: "0 clamp(16px, 4vw, 48px) clamp(32px, 4vw, 48px)" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "16px" }}>Recently Viewed</h3>
              <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                {recentProducts.map((p) => (
                  <div key={p.id} onClick={() => setSelectedProduct(p)} style={{
                    minWidth: "160px", maxWidth: "160px", cursor: "pointer", borderRadius: "10px",
                    border: `1px solid ${border}`, overflow: "hidden", flexShrink: 0,
                    background: card, transition: "border-color 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                  >
                    <div style={{ background: "#f5f3ef", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <img src={p.image} alt={p.name} loading="lazy" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                    </div>
                    <div style={{ padding: "10px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, lineHeight: 1.3, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name.split("—")[0].trim()}</p>
                      <p style={{ fontSize: "13px", fontWeight: 700, color: t1 }}>₹{p.price.toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════ CRAFT BANNER ══════ */}
        <section style={{ padding: "0 clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div onClick={() => setCraftSheetOpen(true)} style={{
            maxWidth: "1280px", margin: "0 auto", background: card, border: `1px solid ${border}`,
            borderRadius: "16px", padding: "clamp(32px, 5vw, 56px)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px",
            transition: "border-color 0.3s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
          >
            <div>
              <p style={{ fontSize: "12px", color: gold, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>The Craft</p>
              <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, letterSpacing: "-0.8px", marginBottom: "8px" }}>
                8 Steps. 600 Years. Pure Silver.
              </h3>
              <p style={{ fontSize: "14px", color: t2, lineHeight: 1.7 }}>
                Discover the ancient process behind every handcrafted masterpiece.
              </p>
            </div>
            <div className="craft-steps-preview" style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
              {["01", "02", "03", "04", "05", "06", "07", "08"].map((s, i) => (
                <div key={s} style={{
                  width: "32px", height: "32px", borderRadius: "8px",
                  background: i === 0 ? gold : "rgba(0,0,0,0.03)",
                  border: i === 0 ? "none" : `1px solid ${border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: mono, fontSize: "10px", fontWeight: 600,
                  color: i === 0 ? bg : t3,
                }}>{s}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ TESTIMONIALS ══════ */}
        <section style={{ padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <h3 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 800, letterSpacing: "-1px", marginBottom: "32px" }}>
              What Customers Say
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {[
                { name: "Priya M.", city: "Bangalore", text: "The Nandi Basavanna frame is absolutely stunning. The silver inlay catches the light beautifully. A true masterpiece for our pooja room.", stars: 5 },
                { name: "Rajesh K.", city: "Mumbai", text: "Gifted the 4-Vase Set to my parents on their anniversary. They were moved to tears. The craftsmanship is unmatched.", stars: 5 },
                { name: "Ananya S.", city: "Delhi", text: "I wear my Taara Kangan every day. People always ask about it. Incredible to think this craft is 600 years old.", stars: 5 },
              ].map((r, i) => (
                <div key={i} style={{
                  background: card, border: `1px solid ${border}`, borderRadius: "12px",
                  padding: "24px", transition: "border-color 0.3s",
                }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                >
                  <div style={{ display: "flex", gap: "2px", marginBottom: "16px", color: gold }}>
                    {Array(r.stars).fill(0).map((_, j) => <span key={j}>{Icons.star}</span>)}
                  </div>
                  <p style={{ fontSize: "14px", color: t2, lineHeight: 1.7, marginBottom: "20px" }}>"{r.text}"</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${border}`, paddingTop: "16px" }}>
                    <div>
                      <p style={{ fontSize: "13px", fontWeight: 600 }}>{r.name}</p>
                      <p style={{ fontSize: "11px", color: t3 }}>{r.city}</p>
                    </div>
                    <span style={{ fontSize: "10px", color: t3, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ NEWSLETTER ══════ */}
        <section style={{ padding: "0 clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div style={{
            maxWidth: "560px", margin: "0 auto", textAlign: "center",
            background: card, border: `1px solid ${border}`, borderRadius: "16px",
            padding: "clamp(32px, 5vw, 48px)",
          }}>
            <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>Stay in the loop</h3>
            <p style={{ fontSize: "13px", color: t2, marginBottom: "24px", lineHeight: 1.6 }}>
              New collections, artisan stories, and exclusive offers. No spam.
            </p>
            <div style={{ display: "flex", gap: "8px", maxWidth: "400px", margin: "0 auto" }}>
              <input type="email" placeholder="your@email.com" style={{
                flex: 1, background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px",
                fontFamily: f, outline: "none",
              }} />
              <button onClick={() => showNotification("Subscribed!")} style={{
                background: t1, color: bg, border: "none", padding: "10px 20px",
                borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: f,
                cursor: "pointer", transition: "opacity 0.2s", whiteSpace: "nowrap",
              }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >Subscribe</button>
            </div>
          </div>
        </section>

        {/* ══════ INSTAGRAM FEED ══════ */}
        <section style={{ padding: "0 clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
            <p style={{ fontSize: "12px", color: gold, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>Follow Us</p>
            <h3 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "8px" }}>
              @bidrikala on Instagram
            </h3>
            <p style={{ fontSize: "13px", color: t2, marginBottom: "24px" }}>See our latest creations and behind-the-scenes from the workshop</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "8px" }}>
              {products.slice(0, 6).map((p, i) => (
                <a key={i} href="https://instagram.com/bidrikala" target="_blank" rel="noopener noreferrer" style={{
                  aspectRatio: "1", borderRadius: "10px", overflow: "hidden", position: "relative",
                  background: "#f5f3ef", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}>
                  <img src={p.image} alt="" loading="lazy" style={{ width: "80%", height: "80%", objectFit: "contain", transition: "transform 0.3s" }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  />
                  <div style={{
                    position: "absolute", inset: 0, background: "rgba(0,0,0,0)", transition: "background 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.3)"; e.currentTarget.querySelector("span").style.opacity = "1"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0)"; e.currentTarget.querySelector("span").style.opacity = "0"; }}
                  >
                    <span style={{ color: "#fff", opacity: 0, transition: "opacity 0.3s" }}>{Icons.instagram}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ══════ FOOTER ══════ */}
        <footer style={{
          padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 48px) 32px",
          borderTop: `1px solid ${border}`, marginTop: "40px",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
              {/* Brand */}
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "12px" }}>
                  Bidri<span style={{ color: gold }}>Kala</span>
                </h4>
                <p style={{ fontSize: "13px", color: t3, lineHeight: 1.7, maxWidth: "280px" }}>
                  Handcrafted Bidriware — direct from Bidar's artisan families. 600 years of tradition, delivered to your door.
                </p>
              </div>
              {/* Shop */}
              <div>
                <h5 style={{ fontSize: "12px", fontWeight: 600, color: t3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Shop</h5>
                {["All Products", "Wall Art", "Figurines", "Jewelry", "Earrings", "Pendants"].map((link) => (
                  <p key={link} style={{ fontSize: "13px", color: t2, marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                    onClick={() => handleFooterLink(link)}
                    onMouseEnter={(e) => (e.target.style.color = t1)}
                    onMouseLeave={(e) => (e.target.style.color = t2)}
                  >{link}</p>
                ))}
              </div>
              {/* Info */}
              <div>
                <h5 style={{ fontSize: "12px", fontWeight: 600, color: t3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Learn</h5>
                {["History of Bidri", "The 8-Step Process", "Bidar Fort Soil", "Care Guide"].map((link) => (
                  <p key={link} style={{ fontSize: "13px", color: t2, marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                    onClick={() => handleFooterLink(link)}
                    onMouseEnter={(e) => (e.target.style.color = t1)}
                    onMouseLeave={(e) => (e.target.style.color = t2)}
                  >{link}</p>
                ))}
              </div>
              {/* Support */}
              <div>
                <h5 style={{ fontSize: "12px", fontWeight: 600, color: t3, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Support</h5>
                {["Contact Us", "Shipping & Delivery", "Returns Policy"].map((link) => (
                  <p key={link} style={{ fontSize: "13px", color: t2, marginBottom: "10px", cursor: "pointer", transition: "color 0.2s" }}
                    onClick={() => handleFooterLink(link)}
                    onMouseEnter={(e) => (e.target.style.color = t1)}
                    onMouseLeave={(e) => (e.target.style.color = t2)}
                  >{link}</p>
                ))}
                <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
                  {[
                    { icon: "instagram", href: "#", hover: "#E4405F" },
                    { icon: "facebook", href: "#", hover: "#1877F2" },
                    { icon: "linkedin", href: "#", hover: "#0A66C2" },
                    { icon: "whatsapp", href: "https://wa.me/918660446406", hover: "#25D366" },
                  ].map((s) => (
                    <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer"
                      style={{
                        width: "36px", height: "36px", borderRadius: "8px",
                        background: "rgba(0,0,0,0.03)", border: `1px solid ${border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: t3, textDecoration: "none", transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = s.hover; e.currentTarget.style.borderColor = s.hover + "40"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = t3; e.currentTarget.style.borderColor = border; }}
                    >{Icons[s.icon]}</a>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <p style={{ fontSize: "12px", color: t3 }}>© 2026 BidriKala. All rights reserved.</p>
              <p style={{ fontSize: "12px", color: t3 }}>Mangalpet Road, Bidar, Karnataka 585401</p>
            </div>
          </div>
        </footer>

        {/* ══════ PRODUCT DETAIL MODAL ══════ */}
        {selectedProduct && (
          <div onClick={() => setSelectedProduct(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#ffffff", borderRadius: "16px", maxWidth: "720px", width: "100%",
              maxHeight: "90vh", overflowY: "auto", border: `1px solid ${border}`,
              display: "grid", gridTemplateColumns: "1fr 1fr",
              animation: "slideUp 0.3s ease", boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }} className="modal-content">
              {/* Image side */}
              <div style={{ background: "#f5f3ef", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", minHeight: "300px", borderRadius: "16px 0 0 16px" }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "90%", maxHeight: "320px", objectFit: "contain" }} />
              </div>
              {/* Info side */}
              <div style={{ padding: "32px", position: "relative" }}>
                <button onClick={() => setSelectedProduct(null)} style={{
                  position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.04)",
                  border: "none", color: t3, cursor: "pointer", width: "32px", height: "32px",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = t1; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = t3; }}
                >{Icons.close}</button>

                <p style={{ fontSize: "11px", color: gold, fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>{selectedProduct.category}</p>
                <h3 style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "12px", lineHeight: 1.3, paddingRight: "32px" }}>
                  {selectedProduct.name}
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <span style={{ color: gold, display: "flex", alignItems: "center" }}>{Icons.star}</span>
                  <span style={{ fontSize: "13px", color: t2 }}>{selectedProduct.rating} ({selectedProduct.reviews.toLocaleString()} reviews)</span>
                </div>
                <p style={{ fontSize: "13px", color: t2, lineHeight: 1.75, marginBottom: "24px" }}>{selectedProduct.description}</p>

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
                  <span style={{ fontSize: "24px", fontWeight: 800 }}>₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                  {selectedProduct.originalPrice && (
                    <span style={{ fontSize: "14px", color: t3, textDecoration: "line-through" }}>₹{selectedProduct.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>
                {selectedProduct.stock <= 5 && (
                  <p style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600, marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#dc2626", display: "inline-block", animation: "pulse 1.5s infinite" }} />
                    Only {selectedProduct.stock} left in stock — order soon
                  </p>
                )}
                {selectedProduct.stock > 5 && <div style={{ marginBottom: "16px" }} />}

                <div className="modal-add-to-cart" style={{ display: "flex", gap: "10px" }}>
                  {selectedProduct.stock > 0 ? (
                    <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{
                      flex: 1, background: t1, color: bg, border: "none", padding: "12px",
                      borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: f,
                      cursor: "pointer", transition: "opacity 0.2s",
                    }}
                      onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                      onMouseLeave={(e) => (e.target.style.opacity = "1")}
                    >Add to Cart</button>
                  ) : (
                    <button onClick={() => setNotifyProductId(selectedProduct.id)} style={{
                      flex: 1, background: gold, color: "#fff", border: "none", padding: "12px",
                      borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: f,
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}>{Icons.bell} Notify Me When Available</button>
                  )}
                  <button onClick={() => toggleWishlist(selectedProduct.id)} style={{
                    width: "44px", borderRadius: "8px", border: `1px solid ${border}`,
                    background: isWishlisted(selectedProduct.id) ? "rgba(239,68,68,0.08)" : "rgba(0,0,0,0.04)",
                    color: isWishlisted(selectedProduct.id) ? "#ef4444" : t3,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s",
                  }}>{isWishlisted(selectedProduct.id) ? Icons.heartFilled : Icons.heart}</button>
                  <a
                    href={`https://wa.me/918660446406?text=${encodeURIComponent(`Hi! I'm interested in ${selectedProduct.name} (₹${selectedProduct.price.toLocaleString("en-IN")}). Is it available?`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: "44px", borderRadius: "8px", background: "#25D366",
                      color: "#fff", textDecoration: "none", flexShrink: 0, transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >{Icons.whatsapp}</a>
                </div>
              </div>

              {/* You May Also Like */}
              {(() => {
                const related = products.filter((p) => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 4);
                return related.length > 0 ? (
                  <div style={{ gridColumn: "1 / -1", padding: "20px 24px", borderTop: `1px solid ${border}` }}>
                    <h4 style={{ fontSize: "14px", fontWeight: 700, marginBottom: "14px" }}>You May Also Like</h4>
                    <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "4px" }}>
                      {related.map((rp) => (
                        <div key={rp.id} onClick={() => setSelectedProduct(rp)} style={{
                          minWidth: "120px", cursor: "pointer", borderRadius: "8px",
                          border: `1px solid ${border}`, overflow: "hidden", flexShrink: 0,
                          transition: "border-color 0.2s",
                        }}
                          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(0,0,0,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.borderColor = border)}
                        >
                          <div style={{ background: "#f5f3ef", aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img src={rp.image} alt={rp.name} loading="lazy" style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                          </div>
                          <div style={{ padding: "8px" }}>
                            <p style={{ fontSize: "11px", fontWeight: 600, lineHeight: 1.3, marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rp.name.split("—")[0].trim()}</p>
                            <p style={{ fontSize: "12px", fontWeight: 700, color: t1 }}>₹{rp.price.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>

            {/* Sticky Add to Cart — Mobile */}
            <div className="sticky-mobile-cart" style={{
              display: "none", position: "fixed", bottom: 0, left: 0, right: 0,
              background: card, borderTop: `1px solid ${border}`, padding: "12px 16px",
              zIndex: 201, boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "12px", color: t2, marginBottom: "2px" }}>{selectedProduct.name.split("—")[0].trim()}</p>
                  <p style={{ fontSize: "18px", fontWeight: 800 }}>₹{selectedProduct.price.toLocaleString("en-IN")}</p>
                </div>
                <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{
                  background: t1, color: bg, border: "none", padding: "12px 24px",
                  borderRadius: "8px", fontSize: "14px", fontWeight: 700, fontFamily: f,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>Add to Cart</button>
              </div>
            </div>
          </div>
        )}

        {/* ══════ CART SIDEBAR ══════ */}
        {cartOpen && (
          <div onClick={() => setCartOpen(false)} style={{
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
                <button onClick={() => setCartOpen(false)} style={{
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
                            <button onClick={() => updateQty(item.id, -1)} style={{
                              background: "none", border: "none", color: t2, padding: "4px 8px",
                              cursor: "pointer", display: "flex", alignItems: "center",
                            }}>{Icons.minus}</button>
                            <span style={{ fontSize: "12px", fontWeight: 600, padding: "0 8px", minWidth: "20px", textAlign: "center" }}>{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)} style={{
                              background: "none", border: "none", color: t2, padding: "4px 8px",
                              cursor: "pointer", display: "flex", alignItems: "center",
                            }}>{Icons.plus}</button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} style={{
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
                    const FREE_SHIP = 5000;
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
                          onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                          onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                          placeholder="Coupon code"
                          style={{
                            flex: 1, padding: "10px 12px", borderRadius: "8px", fontSize: "13px",
                            background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                            color: t1, fontFamily: mono, letterSpacing: "0.5px", outline: "none",
                          }}
                          onFocus={(e) => (e.target.style.borderColor = gold)}
                          onBlur={(e) => (e.target.style.borderColor = border)}
                        />
                        <button onClick={applyCoupon} style={{
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
                      <button onClick={removeCoupon} style={{
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
                    onClick={() => {
                      if (!user) { setLoginOpen(true); return; }
                      setCartOpen(false); setCheckoutOpen(true); setCheckoutStep(1); setFormErrors({});
                      setCustomerForm((prev) => ({ ...prev, name: user.name || prev.name, phone: user.phone || prev.phone, email: user.email || prev.email }));
                    }}
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
        )}

        {/* ══════ WISHLIST SIDEBAR ══════ */}
        {wishlistOpen && (
          <div onClick={() => setWishlistOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: "min(400px, 90vw)",
              background: card, boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
              display: "flex", flexDirection: "column", animation: "slideRight 0.3s ease",
            }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Wishlist ({wishlist.length})</h3>
                <button onClick={() => setWishlistOpen(false)} style={{
                  background: "rgba(0,0,0,0.04)", border: "none", color: t3, cursor: "pointer",
                  width: "32px", height: "32px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{Icons.close}</button>
              </div>

              {/* Items */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                {wishlist.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: t3 }}>
                    <div style={{ marginBottom: "12px", opacity: 0.4 }}>{Icons.heart}</div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>Your wishlist is empty</p>
                    <p style={{ fontSize: "12px", marginTop: "4px" }}>Tap the heart on any product to save it</p>
                  </div>
                ) : (
                  wishlist.map((pid) => {
                    const p = products.find((pr) => pr.id === pid);
                    if (!p) return null;
                    return (
                      <div key={p.id} style={{
                        display: "flex", gap: "14px", padding: "14px 0",
                        borderBottom: `1px solid ${border}`, alignItems: "center",
                      }}>
                        <div onClick={() => { setWishlistOpen(false); setSelectedProduct(p); }} style={{
                          width: "72px", height: "72px", borderRadius: "8px", background: "#f5f3ef",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer",
                        }}>
                          <img src={p.image} alt={p.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p onClick={() => { setWishlistOpen(false); setSelectedProduct(p); }} style={{
                            fontSize: "13px", fontWeight: 600, marginBottom: "4px", cursor: "pointer",
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          }}>{p.name.split("—")[0].trim()}</p>
                          <p style={{ fontSize: "14px", fontWeight: 700 }}>₹{p.price.toLocaleString("en-IN")}</p>
                          <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                            <button onClick={() => { addToCart(p); toggleWishlist(p.id); }} style={{
                              background: t1, color: bg, border: "none", padding: "5px 12px",
                              borderRadius: "6px", fontSize: "11px", fontWeight: 600, fontFamily: f, cursor: "pointer",
                            }}>Add to Cart</button>
                            <button onClick={() => toggleWishlist(p.id)} style={{
                              background: "none", border: `1px solid ${border}`, padding: "5px 10px",
                              borderRadius: "6px", fontSize: "11px", color: t3, fontFamily: f, cursor: "pointer",
                            }}>Remove</button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ ORDERS SIDEBAR ══════ */}
        {ordersOpen && (
          <div onClick={() => setOrdersOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              position: "absolute", top: 0, right: 0, bottom: 0, width: "min(440px, 92vw)",
              background: card, boxShadow: "-4px 0 24px rgba(0,0,0,0.08)",
              display: "flex", flexDirection: "column", animation: "slideRight 0.3s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>My Orders</h3>
                <button onClick={() => setOrdersOpen(false)} style={{
                  background: "rgba(0,0,0,0.04)", border: "none", color: t3, cursor: "pointer",
                  width: "32px", height: "32px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{Icons.close}</button>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
                {orders.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "60px 0", color: t3 }}>
                    <div style={{ marginBottom: "12px", opacity: 0.4 }}>{Icons.package}</div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>No orders yet</p>
                    <p style={{ fontSize: "12px", marginTop: "4px" }}>Your order history will appear here</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.orderId} style={{
                      border: `1px solid ${border}`, borderRadius: "12px", padding: "16px",
                      marginBottom: "14px", background: "rgba(0,0,0,0.01)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 700, color: gold }}>{order.orderId}</p>
                          <p style={{ fontSize: "11px", color: t3, marginTop: "2px" }}>
                            {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <span style={{
                          fontSize: "10px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px",
                          padding: "4px 10px", borderRadius: "20px",
                          background: order.status === "pending" ? "rgba(245,158,11,0.1)" : order.status === "confirmed" ? "rgba(34,197,94,0.1)" : "rgba(0,0,0,0.04)",
                          color: order.status === "pending" ? "#f59e0b" : order.status === "confirmed" ? "#22c55e" : t2,
                        }}>{order.status}</span>
                      </div>
                      {Array.isArray(order.items) && order.items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: "12px" }}>
                          <span style={{ color: t2 }}>{item.name?.split("—")[0]?.trim() || `Product ${item.productId}`} × {item.qty}</span>
                          <span style={{ fontWeight: 600 }}>₹{((item.price || 0) * item.qty).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: `1px solid ${border}`, marginTop: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                        {order.discount > 0 && <span style={{ fontSize: "11px", color: "#22c55e" }}>-₹{order.discount.toLocaleString("en-IN")} off</span>}
                        <span style={{ fontSize: "14px", fontWeight: 700, marginLeft: "auto" }}>₹{(order.total || 0).toLocaleString("en-IN")}</span>
                      </div>
                      {order.paymentMethod && (
                        <p style={{ fontSize: "11px", color: t3, marginTop: "6px" }}>
                          Paid via {order.paymentMethod}{order.upiTxnId ? ` · ${order.upiTxnId}` : ""}
                        </p>
                      )}
                      {order.shippingAddress && (
                        <p style={{ fontSize: "11px", color: t3, marginTop: "4px" }}>Ship to: {order.shippingAddress}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ CHECKOUT MODAL ══════ */}
        {checkoutOpen && (
          <div style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "16px", animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: card, border: `1px solid ${border}`, borderRadius: "16px",
              width: "100%", maxWidth: "480px", maxHeight: "90vh", overflow: "auto",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}>
              {/* Header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "20px 24px", borderBottom: `1px solid ${border}`,
              }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0 }}>
                    {checkoutStep === 1 ? "Shipping Details" : checkoutStep === 2 ? "Payment" : "Order Confirmed"}
                  </h3>
                  {checkoutStep < 3 && <p style={{ fontSize: "12px", color: t3, margin: "4px 0 0" }}>
                    Step {checkoutStep} of 2
                  </p>}
                </div>
                <button onClick={() => setCheckoutOpen(false)} style={{
                  background: "none", border: "none", color: t3, cursor: "pointer", padding: "4px",
                }}>{Icons.close}</button>
              </div>

              {checkoutStep === 1 ? (
                <div style={{ padding: "20px 24px" }}>
                  {/* Name */}
                  {[
                    { key: "name", label: "Full Name *", placeholder: "Ramesh Kumar", type: "text" },
                    { key: "phone", label: "Phone *", placeholder: "9876543210", type: "tel", maxLength: 10 },
                    { key: "email", label: "Email", placeholder: "ramesh@example.com (optional)", type: "email" },
                    { key: "address", label: "Address *", placeholder: "House/Flat No, Street, Landmark", type: "text" },
                    { key: "city", label: "City *", placeholder: "Bidar", type: "text" },
                  ].map((field) => (
                    <div key={field.key} style={{ marginBottom: "14px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, marginBottom: "6px", display: "block" }}>{field.label}</label>
                      <input
                        type={field.type}
                        maxLength={field.maxLength}
                        value={customerForm[field.key]}
                        onChange={(e) => { setCustomerForm((f) => ({ ...f, [field.key]: e.target.value })); setFormErrors((fe) => ({ ...fe, [field.key]: "" })); }}
                        placeholder={field.placeholder}
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                          background: "rgba(0,0,0,0.04)", border: `1px solid ${formErrors[field.key] ? "#ef4444" : border}`,
                          color: t1, fontFamily: f, outline: "none", boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = gold)}
                        onBlur={(e) => (e.target.style.borderColor = formErrors[field.key] ? "#ef4444" : border)}
                      />
                      {formErrors[field.key] && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{formErrors[field.key]}</p>}
                    </div>
                  ))}
                  {/* State + Pincode row */}
                  <div style={{ display: "flex", gap: "12px", marginBottom: "14px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, marginBottom: "6px", display: "block" }}>State *</label>
                      <input
                        type="text"
                        value={customerForm.state}
                        onChange={(e) => { setCustomerForm((f) => ({ ...f, state: e.target.value })); setFormErrors((fe) => ({ ...fe, state: "" })); }}
                        placeholder="Karnataka"
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                          background: "rgba(0,0,0,0.04)", border: `1px solid ${formErrors.state ? "#ef4444" : border}`,
                          color: t1, fontFamily: f, outline: "none", boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = gold)}
                        onBlur={(e) => (e.target.style.borderColor = formErrors.state ? "#ef4444" : border)}
                      />
                      {formErrors.state && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{formErrors.state}</p>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, marginBottom: "6px", display: "block" }}>Pincode *</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={customerForm.pincode}
                        onChange={(e) => { setCustomerForm((f) => ({ ...f, pincode: e.target.value.replace(/\D/g, "") })); setFormErrors((fe) => ({ ...fe, pincode: "" })); }}
                        placeholder="585401"
                        style={{
                          width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                          background: "rgba(0,0,0,0.04)", border: `1px solid ${formErrors.pincode ? "#ef4444" : border}`,
                          color: t1, fontFamily: mono, outline: "none", boxSizing: "border-box",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = gold)}
                        onBlur={(e) => (e.target.style.borderColor = formErrors.pincode ? "#ef4444" : border)}
                      />
                      {formErrors.pincode && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{formErrors.pincode}</p>}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div style={{ padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.02)", border: `1px solid ${border}`, marginBottom: "16px" }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t3, marginBottom: "8px" }}>ORDER SUMMARY</p>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "12px", color: t2 }}>{item.name.split("—")[0].trim()} × {item.qty}</span>
                        <span style={{ fontSize: "12px", color: t2 }}>₹{(item.price * item.qty).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                    {discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                        <span style={{ fontSize: "12px", color: "#22c55e" }}>Discount</span>
                        <span style={{ fontSize: "12px", color: "#22c55e" }}>−₹{discount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div style={{ height: "1px", background: border, margin: "8px 0" }} />
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700 }}>Total</span>
                      <span style={{ fontSize: "14px", fontWeight: 700 }}>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <button onClick={proceedToPayment} style={{
                    width: "100%", background: gold, color: "#0a0806", border: "none",
                    padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                    fontFamily: f, cursor: "pointer", transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Continue to Payment
                  </button>
                </div>
              ) : checkoutStep === 2 ? (
                <div style={{ padding: "20px 24px" }}>
                  {/* Shipping to summary */}
                  <div style={{
                    padding: "12px", borderRadius: "8px", marginBottom: "16px",
                    background: "rgba(0,0,0,0.02)", border: `1px solid ${border}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t3, margin: 0 }}>SHIPPING TO</p>
                      <button onClick={() => setCheckoutStep(1)} style={{
                        background: "none", border: "none", color: gold, cursor: "pointer", fontSize: "11px", fontWeight: 600,
                      }}>Edit</button>
                    </div>
                    <p style={{ fontSize: "13px", color: t1, margin: "0 0 2px", fontWeight: 600 }}>{customerForm.name}</p>
                    <p style={{ fontSize: "12px", color: t2, margin: "0 0 2px" }}>{customerForm.address}</p>
                    <p style={{ fontSize: "12px", color: t2, margin: "0 0 2px" }}>{customerForm.city}, {customerForm.state} — {customerForm.pincode}</p>
                    <p style={{ fontSize: "12px", color: t2, margin: 0 }}>{customerForm.phone}{customerForm.email ? ` · ${customerForm.email}` : ""}</p>
                  </div>

                  {/* Amount */}
                  <div style={{
                    textAlign: "center", padding: "16px", marginBottom: "16px",
                    borderRadius: "8px", background: "rgba(200,165,90,0.06)", border: `1px solid rgba(200,165,90,0.15)`,
                  }}>
                    <p style={{ fontSize: "12px", color: t3, margin: "0 0 4px" }}>Amount to Pay</p>
                    <p style={{ fontSize: "28px", fontWeight: 800, color: gold, margin: 0 }}>₹{cartTotal.toLocaleString("en-IN")}</p>
                  </div>

                  {/* UPI Payment — QR for desktop, button for mobile */}
                  {(() => {
                    const upiUrl = `upi://pay?pa=9611886777@kotak&pn=BidriKala&am=${cartTotal}&cu=INR&tn=${encodeURIComponent(`BidriKala Order - ${cartCount} item(s)`)}`;
                    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiUrl)}`;
                    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                    return isMobile ? (
                      <button
                        onClick={() => { window.location.href = upiUrl; }}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                          width: "100%", background: gold, color: "#0a0806", border: "none",
                          padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                          fontFamily: f, cursor: "pointer", transition: "opacity 0.2s", marginBottom: "10px",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/></svg>
                        Pay ₹{cartTotal.toLocaleString("en-IN")} via UPI
                      </button>
                    ) : (
                      <div style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
                        padding: "16px", borderRadius: "10px", marginBottom: "10px",
                        background: "rgba(0,0,0,0.02)", border: `1px solid ${border}`,
                      }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: t1, margin: 0 }}>Scan with any UPI app to pay</p>
                        <img src={qrSrc} alt="UPI QR Code" style={{ width: "180px", height: "180px", borderRadius: "8px", background: "#fff", padding: "8px" }} />
                        <p style={{ fontSize: "11px", color: t3, margin: 0, textAlign: "center" }}>Google Pay · PhonePe · Paytm · BHIM</p>
                      </div>
                    );
                  })()}

                  {/* UPI Transaction ID Input */}
                  <div style={{ marginBottom: "12px" }}>
                    <label style={{ fontSize: "12px", fontWeight: 600, color: t2, marginBottom: "6px", display: "block" }}>
                      UPI Transaction ID / UTR Number *
                    </label>
                    <input
                      type="text"
                      value={upiTxnId}
                      onChange={(e) => { setUpiTxnId(e.target.value); setTxnError(""); }}
                      placeholder="e.g. 432115678901 (from your UPI app)"
                      style={{
                        width: "100%", padding: "10px 12px", borderRadius: "8px", fontSize: "14px",
                        background: "rgba(0,0,0,0.04)", border: `1px solid ${txnError ? "#ef4444" : border}`,
                        color: t1, fontFamily: mono, letterSpacing: "0.5px", outline: "none", boxSizing: "border-box",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = gold)}
                      onBlur={(e) => (e.target.style.borderColor = txnError ? "#ef4444" : border)}
                    />
                    {txnError && <p style={{ fontSize: "11px", color: "#ef4444", marginTop: "4px" }}>{txnError}</p>}
                    <p style={{ fontSize: "11px", color: t3, marginTop: "4px" }}>
                      Find this in your UPI app under payment history / transaction details
                    </p>
                  </div>
                  <button
                    onClick={confirmPayment}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      width: "100%", background: "#22c55e", color: "#fff", border: "none",
                      padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                      fontFamily: f, cursor: "pointer", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                    I've Completed the Payment
                  </button>
                  {/* Secure Payment Badges */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginTop: "16px", padding: "12px", borderRadius: "8px", background: "rgba(0,0,0,0.02)", border: `1px solid ${border}` }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <span style={{ fontSize: "11px", color: t2, fontWeight: 500 }}>100% Secure</span>
                    <span style={{ width: "1px", height: "14px", background: border }} />
                    <span style={{ fontSize: "11px", color: t2, fontWeight: 600 }}>UPI</span>
                    <span style={{ width: "1px", height: "14px", background: border }} />
                    <span style={{ fontSize: "11px", color: t2, fontWeight: 500 }}>Google Pay</span>
                    <span style={{ width: "1px", height: "14px", background: border }} />
                    <span style={{ fontSize: "11px", color: t2, fontWeight: 500 }}>PhonePe</span>
                  </div>
                </div>
              ) : (
                /* Step 3 — Order Success */
                <div style={{ padding: "40px 24px", textAlign: "center" }}>
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%", margin: "0 auto 20px",
                    background: "rgba(34,197,94,0.12)", border: "2px solid #22c55e",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 6px" }}>Order Received!</h3>
                  <p style={{ fontSize: "13px", color: t2, margin: "0 0 6px" }}>Thank you for your purchase</p>
                  <p style={{ fontSize: "11px", color: "#f59e0b", margin: "0 0 20px", padding: "6px 12px", borderRadius: "6px", background: "rgba(245,158,11,0.08)", display: "inline-block" }}>We'll verify your payment and start processing</p>

                  <div style={{
                    padding: "14px", borderRadius: "10px", marginBottom: "16px",
                    background: "rgba(0,0,0,0.02)", border: `1px solid ${border}`, textAlign: "left",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: t3 }}>Order ID</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: gold, fontFamily: mono }}>{orderId}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: t3 }}>Amount Paid</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: t1 }}>₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: t3 }}>Payment Method</span>
                      <span style={{ fontSize: "12px", color: t1 }}>UPI</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "12px", color: t3 }}>UPI Txn ID</span>
                      <span style={{ fontSize: "12px", fontWeight: 600, color: t1, fontFamily: mono }}>{upiTxnId}</span>
                    </div>
                    <div style={{ height: "1px", background: border, margin: "10px 0" }} />
                    <p style={{ fontSize: "12px", color: t3, margin: "0 0 4px" }}>Shipping to</p>
                    <p style={{ fontSize: "13px", color: t1, fontWeight: 600, margin: "0 0 2px" }}>{customerForm.name}</p>
                    <p style={{ fontSize: "12px", color: t2, margin: 0 }}>
                      {customerForm.address}, {customerForm.city}, {customerForm.state} — {customerForm.pincode}
                    </p>
                  </div>

                  {customerForm.email && (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#22c55e", marginBottom: "12px" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                      Confirmation email sent to {customerForm.email}
                    </div>
                  )}

                  <a
                    href={`https://wa.me/918660446406?text=${encodeURIComponent(`Hi BidriKala! I've completed my order.\n\nOrder ID: ${orderId}\nUPI Txn ID: ${upiTxnId}\nAmount: ₹${cartTotal.toLocaleString("en-IN")}\n\nItems:\n${cart.map((item) => `• ${item.name.split("—")[0].trim()} × ${item.qty}`).join("\n")}\n\nShip to: ${customerForm.name}\n${customerForm.address}, ${customerForm.city}, ${customerForm.state} — ${customerForm.pincode}\nPhone: ${customerForm.phone}`)}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                      width: "100%", background: "#25D366", color: "#fff", border: "none",
                      padding: "13px", borderRadius: "8px", fontSize: "14px", fontWeight: 600,
                      fontFamily: f, cursor: "pointer", textDecoration: "none", transition: "opacity 0.2s",
                      marginBottom: "10px", boxSizing: "border-box",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {Icons.whatsapp}
                    Send Order Details on WhatsApp
                  </a>
                  <p style={{ fontSize: "11px", color: t3, textAlign: "center", marginBottom: "16px" }}>Tap above to send order details — we'll confirm and ship your order</p>

                  <button
                    onClick={closeOrderSuccess}
                    style={{
                      width: "100%", background: gold, color: "#0a0806", border: "none",
                      padding: "14px", borderRadius: "8px", fontSize: "14px", fontWeight: 700,
                      fontFamily: f, cursor: "pointer", transition: "opacity 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════ INFO MODAL ══════ */}
        {infoModal && (
          <div onClick={() => setInfoModal(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#ffffff", borderRadius: "16px", maxWidth: "520px", width: "100%",
              maxHeight: "80vh", overflowY: "auto", padding: "32px",
              border: `1px solid ${border}`, animation: "slideUp 0.3s ease",
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800 }}>{infoModal}</h3>
                <button onClick={() => setInfoModal(null)} style={{
                  background: "rgba(0,0,0,0.04)", border: "none", color: t3,
                  cursor: "pointer", width: "32px", height: "32px", borderRadius: "8px",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>{Icons.close}</button>
              </div>
              <p style={{ fontSize: "14px", color: t2, lineHeight: 1.8, whiteSpace: "pre-line" }}>
                {INFO_CONTENT[infoModal]}
              </p>
            </div>
          </div>
        )}

        {/* ══════ CRAFT STORY BOTTOM SHEET ══════ */}
        {craftSheetOpen && (
          <div onClick={() => setCraftSheetOpen(false)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
            zIndex: 400, display: "flex", flexDirection: "column", justifyContent: "flex-end",
            animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#ffffff", borderRadius: "20px 20px 0 0", maxHeight: "90vh",
              overflowY: "auto", borderTop: `1px solid rgba(0,0,0,0.06)`,
              animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.1)",
            }}>
              {/* Drag handle */}
              <div style={{ padding: "12px 0 0", textAlign: "center", position: "sticky", top: 0, zIndex: 2, background: "#ffffff", borderRadius: "20px 20px 0 0" }}>
                <div style={{ width: "36px", height: "4px", borderRadius: "4px", background: "rgba(0,0,0,0.12)", margin: "0 auto" }} />
              </div>

              {/* Header */}
              <div style={{ padding: "28px 32px 32px", textAlign: "center", position: "relative" }}>
                <button onClick={() => setCraftSheetOpen(false)} style={{
                  position: "absolute", top: "12px", right: "24px", background: "rgba(0,0,0,0.04)",
                  border: "none", color: t3, cursor: "pointer", width: "32px", height: "32px",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                }}>{Icons.close}</button>

                <p style={{ fontSize: "12px", color: gold, fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
                  The 8-Step Bidri Process
                </p>
                <h2 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, letterSpacing: "-1px", marginBottom: "8px" }}>
                  From Alloy to <span style={{ color: gold }}>Masterpiece</span>
                </h2>
                <p style={{ fontSize: "14px", color: t2, maxWidth: "460px", margin: "0 auto", lineHeight: 1.7 }}>
                  Each piece is handcrafted through eight meticulous stages — a tradition spanning 600 years.
                </p>
              </div>

              <div style={{ height: "1px", background: border, margin: "0 32px" }} />

              {/* Steps */}
              <div style={{ padding: "32px 32px 24px", maxWidth: "680px", margin: "0 auto" }}>
                {CRAFT_STEPS.map((item, idx) => (
                  <div key={item.step} style={{
                    display: "flex", gap: "20px", alignItems: "flex-start",
                    padding: "16px 0", borderBottom: idx < 7 ? `1px solid ${border}` : "none",
                  }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: idx === 0 || idx === 7 ? gold : "rgba(0,0,0,0.03)",
                      border: idx === 0 || idx === 7 ? "none" : `1px solid ${border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: mono, fontSize: "11px", fontWeight: 700,
                      color: idx === 0 || idx === 7 ? bg : t3, flexShrink: 0,
                    }}>{item.step}</div>
                    <div>
                      <h4 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>{item.title}</h4>
                      <p style={{ fontSize: "13px", color: t2, lineHeight: 1.65 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ padding: "8px 32px 32px", textAlign: "center" }}>
                <div style={{ height: "1px", background: border, marginBottom: "24px" }} />
                <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                  <button onClick={() => { setCraftSheetOpen(false); shopRef.current?.scrollIntoView({ behavior: "smooth" }); }} style={{
                    background: t1, color: bg, border: "none", padding: "11px 24px",
                    borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: f, cursor: "pointer",
                  }}>Shop Collection</button>
                  <button onClick={() => setCraftSheetOpen(false)} style={{
                    background: "transparent", color: t2, border: `1px solid ${border}`,
                    padding: "11px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                    fontFamily: f, cursor: "pointer",
                  }}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════ FLOATING WHATSAPP ══════ */}
        <a href="https://wa.me/918660446406?text=Hi%20BidriKala!" target="_blank" rel="noopener noreferrer"
          className="whatsapp-float"
          style={{
            position: "fixed", bottom: "24px", right: "24px", zIndex: 50,
            width: "52px", height: "52px", borderRadius: "16px",
            background: "#25D366", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.3)",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >{Icons.whatsapp}</a>

        {/* ══════ BACK TO TOP ══════ */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="back-to-top"
          style={{
            position: "fixed", bottom: "24px", right: "84px", zIndex: 50,
            width: "40px", height: "40px", borderRadius: "10px",
            background: "rgba(0,0,0,0.05)", border: `1px solid ${border}`,
            color: t3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = t1; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.05)"; e.currentTarget.style.color = t3; }}
        >{Icons.arrowUp}</button>

        {/* ══════ LOGIN MODAL ══════ */}
        {loginOpen && (
          <div onClick={() => { setLoginOpen(false); setAuthMode("login"); setLoginError(""); }} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: card, borderRadius: "16px", maxWidth: "400px", width: "100%",
              padding: "32px", position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease",
            }}>
              <button onClick={() => { setLoginOpen(false); setAuthMode("login"); setLoginError(""); }} style={{
                position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.04)",
                border: "none", color: t3, cursor: "pointer", width: "28px", height: "28px",
                borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{Icons.close}</button>
              <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: `rgba(176,141,62,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", color: gold }}>{Icons.user}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 800, fontFamily: f, marginBottom: "4px" }}>
                  {authMode === "verify" ? "Verify Account" : authMode === "signup" ? "Create Account" : "Welcome Back"}
                </h3>
                <p style={{ fontSize: "13px", color: t2 }}>
                  {authMode === "verify" ? "Enter the code sent to your email/phone" : authMode === "signup" ? "Sign up to continue" : "Login to proceed to checkout"}
                </p>
              </div>
              {authMode !== "verify" && (
                <div style={{ display: "flex", marginBottom: "20px", borderRadius: "8px", overflow: "hidden", border: `1px solid ${border}` }}>
                  {["login", "signup"].map((m) => (
                    <button key={m} onClick={() => { setAuthMode(m); setLoginError(""); }} style={{
                      flex: 1, padding: "10px", border: "none", fontSize: "13px", fontWeight: 600, fontFamily: f,
                      cursor: "pointer", transition: "all 0.2s",
                      background: authMode === m ? gold : "transparent", color: authMode === m ? "#fff" : t2,
                    }}>{m === "login" ? "Login" : "Sign Up"}</button>
                  ))}
                </div>
              )}
              {loginError && <p style={{ fontSize: "12px", color: "#ef4444", marginBottom: "12px", textAlign: "center" }}>{loginError}</p>}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {authMode === "verify" ? (
                  <>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, display: "block", marginBottom: "4px" }}>Verification Code</label>
                      <input type="text" placeholder="Enter 6-digit code" value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "16px", fontFamily: mono, outline: "none", boxSizing: "border-box", textAlign: "center", letterSpacing: "4px" }}
                      />
                    </div>
                    <button onClick={handleVerify} disabled={authLoading} style={{
                      width: "100%", background: t1, color: bg, border: "none", padding: "12px",
                      borderRadius: "8px", fontSize: "14px", fontWeight: 700, fontFamily: f,
                      cursor: authLoading ? "wait" : "pointer", opacity: authLoading ? 0.7 : 1, transition: "opacity 0.2s", marginTop: "4px",
                    }}>{authLoading ? "Verifying..." : "Verify & Continue"}</button>
                  </>
                ) : (
                  <>
                    {authMode === "signup" && (
                      <div>
                        <label style={{ fontSize: "12px", fontWeight: 600, color: t2, display: "block", marginBottom: "4px" }}>Full Name *</label>
                        <input type="text" placeholder="Enter your name" value={loginForm.name}
                          onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                          style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px", fontFamily: f, outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    )}
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, display: "block", marginBottom: "4px" }}>Phone Number</label>
                      <input type="tel" placeholder="10-digit mobile number" value={loginForm.phone}
                        onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px", fontFamily: f, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, display: "block", marginBottom: "4px" }}>Email</label>
                      <input type="email" placeholder="your@email.com" value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px", fontFamily: f, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: "12px", fontWeight: 600, color: t2, display: "block", marginBottom: "4px" }}>Password *</label>
                      <input type="password" placeholder={authMode === "signup" ? "Min 8 characters" : "Enter password"} value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        style={{ width: "100%", background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`, borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px", fontFamily: f, outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <p style={{ fontSize: "11px", color: t3 }}>* Phone or email required</p>
                    <button onClick={authMode === "signup" ? handleSignup : handleLoginSubmit} disabled={authLoading} style={{
                      width: "100%", background: t1, color: bg, border: "none", padding: "12px",
                      borderRadius: "8px", fontSize: "14px", fontWeight: 700, fontFamily: f,
                      cursor: authLoading ? "wait" : "pointer", opacity: authLoading ? 0.7 : 1, transition: "opacity 0.2s", marginTop: "4px",
                    }}>{authLoading ? "Please wait..." : authMode === "signup" ? "Create Account" : "Login & Continue"}</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ══════ EMAIL CAPTURE POPUP ══════ */}
        {emailPopup && (
          <div onClick={dismissEmailPopup} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: card, borderRadius: "16px", maxWidth: "400px", width: "100%",
              padding: "32px", textAlign: "center", position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease",
            }}>
              <button onClick={dismissEmailPopup} style={{
                position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.04)",
                border: "none", color: t3, cursor: "pointer", width: "28px", height: "28px",
                borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{Icons.close}</button>
              <div style={{ color: gold, marginBottom: "16px" }}>{Icons.mail}</div>
              <h3 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "6px", fontFamily: f }}>Get 10% Off</h3>
              <p style={{ fontSize: "13px", color: t2, marginBottom: "20px", lineHeight: 1.6 }}>
                Subscribe and get <strong style={{ color: gold }}>10% off</strong> your first order. Plus early access to new collections.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="email" placeholder="your@email.com" style={{
                  flex: 1, background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                  borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px",
                  fontFamily: f, outline: "none",
                }} />
                <button onClick={() => { showNotification("Welcome! Check your email for the code."); dismissEmailPopup(); }} style={{
                  background: t1, color: bg, border: "none", padding: "10px 18px",
                  borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: f,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>Get Code</button>
              </div>
              <p style={{ fontSize: "11px", color: t3, marginTop: "12px" }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        )}

        {/* ══════ NOTIFY ME MODAL ══════ */}
        {notifyProductId && (
          <div onClick={() => setNotifyProductId(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
            zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.3s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: card, borderRadius: "16px", maxWidth: "380px", width: "100%",
              padding: "28px", textAlign: "center", position: "relative",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease",
            }}>
              <button onClick={() => setNotifyProductId(null)} style={{
                position: "absolute", top: "12px", right: "12px", background: "rgba(0,0,0,0.04)",
                border: "none", color: t3, cursor: "pointer", width: "28px", height: "28px",
                borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center",
              }}>{Icons.close}</button>
              <div style={{ color: gold, marginBottom: "12px" }}>{Icons.bell}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "6px", fontFamily: f }}>Notify Me</h3>
              <p style={{ fontSize: "13px", color: t2, marginBottom: "16px", lineHeight: 1.5 }}>
                We'll email you when <strong>{products.find((p) => p.id === notifyProductId)?.name.split("—")[0].trim()}</strong> is back in stock.
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="email" placeholder="your@email.com" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} style={{
                  flex: 1, background: "rgba(0,0,0,0.04)", border: `1px solid ${border}`,
                  borderRadius: "8px", padding: "10px 14px", color: t1, fontSize: "13px",
                  fontFamily: f, outline: "none",
                }} />
                <button onClick={() => { showNotification("We'll notify you!"); setNotifyProductId(null); setNotifyEmail(""); }} style={{
                  background: t1, color: bg, border: "none", padding: "10px 18px",
                  borderRadius: "8px", fontSize: "13px", fontWeight: 600, fontFamily: f,
                  cursor: "pointer", whiteSpace: "nowrap",
                }}>Notify</button>
              </div>
            </div>
          </div>
        )}

        {/* ══════ SOCIAL PROOF POPUP ══════ */}
        <div style={{
          position: "fixed", bottom: socialProof.visible ? "24px" : "-120px", left: "24px",
          background: card, border: `1px solid ${border}`, borderRadius: "12px",
          padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px",
          zIndex: 60, transition: "bottom 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)", maxWidth: "320px", fontFamily: f,
        }}>
          {socialProof.image && <img src={socialProof.image} alt="" style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }} />}
          <div>
            <p style={{ fontSize: "12px", color: t2, margin: 0, lineHeight: 1.4 }}>
              <strong style={{ color: t1 }}>{socialProof.buyer}</strong> from {socialProof.city}
            </p>
            <p style={{ fontSize: "13px", color: t1, fontWeight: 600, margin: "2px 0 0" }}>{socialProof.product}</p>
            <p style={{ fontSize: "10px", color: t3, margin: "2px 0 0" }}>just purchased</p>
          </div>
        </div>

        {/* ══════ NOTIFICATION TOAST ══════ */}
        <div style={{
          position: "fixed", bottom: notification.visible ? "32px" : "-60px", left: "50%",
          transform: "translateX(-50%)", background: t1, color: bg,
          padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          fontFamily: f, zIndex: 9999, transition: "bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
        }}>
          {notification.message}
        </div>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.06); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.12); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .search-wrap { display: none !important; }
          .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
          .modal-content { grid-template-columns: 1fr !important; }
          .modal-content > div:first-child { min-height: 200px !important; border-radius: 16px 16px 0 0 !important; }
          .craft-steps-preview { display: none !important; }
          .back-to-top { display: none !important; }
          .whatsapp-float { bottom: 16px !important; right: 16px !important; }
          .sticky-mobile-cart { display: flex !important; }
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
