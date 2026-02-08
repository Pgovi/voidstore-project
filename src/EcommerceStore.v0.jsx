import { useState, useRef } from "react";

const PRODUCTS = [
  {
    id: 1,
    name: "Taara Kangan — Silver Star Bangle",
    price: 3499,
    originalPrice: 4999,
    category: "Jewelry",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 2341,
    image: "https://www.gitagged.com/wp-content/uploads/2024/08/BIDRI-BANGLE-SMALLSTAR-2-2-300x300.jpg",
    description: "Pure silver star motifs hand-inlaid on oxidised zinc-copper alloy. Each bangle undergoes the traditional 8-stage Bidri process using Bidar Fort soil for the signature matte-black finish. GI-tagged craft.",
  },
  {
    id: 2,
    name: "Surahi Patra — Jug & Leaf Frame",
    price: 6499,
    originalPrice: 8999,
    category: "Wall Art",
    badge: "New",
    rating: 4.9,
    reviews: 1872,
    image: "https://www.gitagged.com/wp-content/uploads/2023/12/BIDRI-FRAME-JUG-LEAF-01-1-300x300.jpg",
    description: "Surahi (jug) with delicate leaf vine patterns — a classic Persian-Deccani motif. Silver wire inlaid on hand-cast alloy, blackened with Bidar Fort soil paste. Comes wall-mount ready.",
  },
  {
    id: 3,
    name: "Pushpa Kalash — Flower Vase Frame",
    price: 5499,
    originalPrice: null,
    category: "Wall Art",
    badge: null,
    rating: 4.7,
    reviews: 956,
    image: "https://www.gitagged.com/wp-content/uploads/2023/12/BIDRI-FRAME-FVASE-01-1-300x300.jpg",
    description: "Ornate flower vase design engraved by chisel and hammer, then inlaid with 97% pure silver sheet. Oxidised using 15th-century Bidar Fort soil — rich in potassium nitrate. Handmade by master karigar.",
  },
  {
    id: 4,
    name: "Nandi Basavanna — Sacred Bull Frame",
    price: 9999,
    originalPrice: 12999,
    category: "Figurines",
    badge: "Hot",
    rating: 4.6,
    reviews: 3102,
    image: "https://www.gitagged.com/wp-content/uploads/2022/01/BIDRI-FRAME-BASAVANNA-1-300x300.jpg",
    description: "Sacred Nandi (Basavanna) — Shiva's divine vehicle — rendered in the Bahmani Sultan-era Bidri technique. Cast from 1:16 copper-zinc alloy, engraved by hand, and inlaid with pure silver. A spiritual masterpiece.",
  },
  {
    id: 5,
    name: "Lekhani Dharak — Wire Pattern Pen Stand",
    price: 3999,
    originalPrice: null,
    category: "Desk Art",
    badge: null,
    rating: 4.5,
    reviews: 687,
    image: "https://www.gitagged.com/wp-content/uploads/2021/02/BIDRI-PENHOLDER-WIRE-1-300x300.jpg",
    description: "Functional desk art with geometric wire-pattern silver inlay. Made from hand-cast zinc-copper alloy, engraved with traditional chisels, and oxidised to jet-black. A perfect corporate gift rooted in heritage.",
  },
  {
    id: 6,
    name: "Chaturbhuj Kalash — 4-Vase Set",
    price: 14999,
    originalPrice: 18999,
    category: "Home Decor",
    badge: "Limited",
    rating: 4.9,
    reviews: 1455,
    image: "https://www.gitagged.com/wp-content/uploads/2020/11/BIDRI-VASE-SET4-1-300x300.jpg",
    description: "A collector's set of four flower vases with varying silver inlay patterns — floral, geometric, vine, and paisley. Each piece individually hand-cast and oxidised. Comes in a heritage gift box.",
  },
  {
    id: 7,
    name: "Mayura Patra — Peacock Frame",
    price: 7499,
    originalPrice: 9999,
    category: "Wall Art",
    badge: null,
    rating: 4.4,
    reviews: 2100,
    image: "https://www.gitagged.com/wp-content/uploads/2019/12/BIDRI-FRAME-PEACOCK-1-300x300.jpg",
    description: "India's national bird in full display, with silver sheet inlay capturing every feather detail. The peacock motif — beloved in Deccani art since the Bahmani era — symbolises grace, beauty, and immortality.",
  },
  {
    id: 8,
    name: "Hasya Buddha — Laughing Buddha",
    price: 11499,
    originalPrice: null,
    category: "Figurines",
    badge: "New",
    rating: 4.7,
    reviews: 430,
    image: "https://www.gitagged.com/wp-content/uploads/2018/06/Bidriware-Silver-Inlay-Happy-Buddha-A1-300x300.jpg",
    description: "The Laughing Buddha — symbol of joy and abundance — reimagined in 600-year-old Bidri craft. Silver inlay on matte-black alloy, oxidised with Bidar Fort soil. Museum-quality, signed by the artisan family.",
  },
  {
    id: 9,
    name: "Gaja Taara — Star Elephant",
    price: 13499,
    originalPrice: 16999,
    category: "Figurines",
    badge: "Hot",
    rating: 4.8,
    reviews: 1890,
    image: "https://www.gitagged.com/wp-content/uploads/2018/04/BIDRI-ELEPHANT-STAR-BIG-1-300x300.jpg",
    description: "A regal elephant adorned with star-pattern silver inlay — symbolising strength, wisdom, and royal power in Deccani tradition. Hand-cast, hand-engraved, hand-inlaid. Each piece takes 2-3 weeks to complete.",
  },
  {
    id: 10,
    name: "Rajmayura — Majestic Peafowl",
    price: 16999,
    originalPrice: 21999,
    category: "Figurines",
    badge: "Limited",
    rating: 4.9,
    reviews: 764,
    image: "https://www.gitagged.com/wp-content/uploads/2018/04/Bidriware-Silver-Inlay-Majestic-Peafowl-1-300x300.jpg",
    description: "Life-size peafowl sculpture — our finest showpiece. Every feather is individually inlaid with pure silver by 4th-generation artisans from Bidar. Takes over a month to craft. Comes with a certificate of authenticity.",
  },
  {
    id: 11,
    name: "Jugalbandi — Twin Surahi Frame",
    price: 7999,
    originalPrice: null,
    category: "Wall Art",
    badge: null,
    rating: 4.6,
    reviews: 542,
    image: "https://www.gitagged.com/wp-content/uploads/2019/12/BIDRI-FRAME-DUALJUG-1-300x300.jpg",
    description: "A symmetrical pair of Surahi jugs — representing the harmony of Persian and Indian design. Silver wire and sheet inlay on blackened alloy, inspired by Mahmud Gawan Madrasa architecture in Bidar.",
  },
  {
    id: 12,
    name: "Ek Surahi — Classic Jug Frame",
    price: 5999,
    originalPrice: 7999,
    category: "Wall Art",
    badge: null,
    rating: 4.5,
    reviews: 328,
    image: "https://www.gitagged.com/wp-content/uploads/2019/12/BIDRI-FRAME-JUG-01-1-300x300.jpg",
    description: "The iconic Bidri Surahi jug — the most traditional motif in Bidriware, dating back to Sultan Ahmed Shah Bahmani's court in the 14th century. Pure silver on jet-black alloy. A piece of living history.",
  },
  {
    id: 13,
    name: "Phool Surahi — Floral Silver Jug",
    price: 6695,
    originalPrice: 8499,
    category: "Home Decor",
    badge: "New",
    rating: 4.9,
    reviews: 215,
    image: "https://www.gitagged.com/wp-content/uploads/2018/04/Bidriware-Flower-Vase-G-300x300.jpg",
    description: "A grand flower jug with elaborate floral silver inlay covering the entire body. The Tarkashi (silver wire) technique creates delicate petal patterns. A stunning centrepiece for any home.",
  },
  {
    id: 14,
    name: "Farsi Surahi — Persian Jug Vase",
    price: 3498,
    originalPrice: null,
    category: "Home Decor",
    badge: null,
    rating: 4.6,
    reviews: 489,
    image: "https://www.gitagged.com/wp-content/uploads/2018/04/Bidriware-Silver-Inlay-Floral-Vase-1-300x300.jpg",
    description: "Inspired by Persian aftabi jugs brought to Bidar by Bahmani-era craftsmen. Pure silver sheet inlay on hand-cast alloy with traditional vine motifs. A bridge between two ancient civilisations.",
  },
  {
    id: 15,
    name: "Farishta Kaan — Angel Earrings",
    price: 1499,
    originalPrice: 1999,
    category: "Earrings",
    badge: "New",
    rating: 4.7,
    reviews: 672,
    image: "https://www.gitagged.com/wp-content/uploads/2017/12/Bidriware-Earrings-Online-1-300x300.jpg",
    description: "Delicate angel-wing earrings with fine silver wire inlay on oxidised alloy. Lightweight yet bold — a contemporary take on 600-year-old craft. Each pair hand-finished by women artisans of Bidar.",
  },
  {
    id: 16,
    name: "Patti Kangan — Leaf Bangle Pair",
    price: 2499,
    originalPrice: 3299,
    category: "Jewelry",
    badge: "Hot",
    rating: 4.8,
    reviews: 1120,
    image: "https://www.gitagged.com/wp-content/uploads/2017/11/Bidriware-Leaf-Bangle-GiTAGGED-1-300x300.jpg",
    description: "A pair of bangles featuring the classic leaf-vine silver inlay pattern. The Tainishan (silver sheet) technique captures every vein of the leaf. Sold as a pair — perfect for gifting.",
  },
  {
    id: 17,
    name: "Mor Murti — Peafowl Showpiece",
    price: 4999,
    originalPrice: null,
    category: "Figurines",
    badge: null,
    rating: 4.5,
    reviews: 341,
    image: "https://www.gitagged.com/wp-content/uploads/2017/11/Bidriware-Silver-Inlay-Peafowl-1-300x300.jpg",
    description: "A graceful peafowl figurine with silver inlay feather detailing. Each feather is individually engraved and inlaid by hand. The matte-black oxidised finish makes the silver shimmer like moonlight.",
  },
  {
    id: 18,
    name: "Mandala Haar — Mandala Pendant",
    price: 1799,
    originalPrice: 2499,
    category: "Pendants",
    badge: null,
    rating: 4.9,
    reviews: 856,
    image: "https://www.gitagged.com/wp-content/uploads/2017/06/BWR-001-PD03-4-1-300x300.jpg",
    description: "A sacred mandala pattern rendered in pure silver on oxidised Bidri alloy. The geometric precision of the inlay reflects the meditative focus of the karigar. Comes with a silver-plated chain.",
  },
  {
    id: 19,
    name: "Yin Yang Haar — Balance Pendant",
    price: 2199,
    originalPrice: null,
    category: "Pendants",
    badge: "Best Seller",
    rating: 4.8,
    reviews: 1534,
    image: "https://www.gitagged.com/wp-content/uploads/2017/06/BWR-001-PD02-4-1-300x300.jpg",
    description: "The universal symbol of balance — Yin and Yang — crafted in the Bidri tradition. Silver inlay on jet-black alloy creates a striking contrast that embodies the pendant's meaning. Unisex design.",
  },
  {
    id: 20,
    name: "Sitara Kaan — Star Ear Studs",
    price: 999,
    originalPrice: 1499,
    category: "Earrings",
    badge: null,
    rating: 4.6,
    reviews: 923,
    image: "https://www.gitagged.com/wp-content/uploads/2017/07/Bidriware-Silver-Ear-Studs-1-300x300.jpg",
    description: "Minimalist star-pattern ear studs — pure silver on oxidised Bidri alloy. The smallest canvas for this ancient art. Hypoallergenic posts, perfect for everyday wear. GI-tagged authentic craft.",
  },
];

const CATEGORIES = ["All", ...new Set(PRODUCTS.map((p) => p.category))];

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
  "GI Tag Certificate": "Bidriware received its Geographical Indication (GI) tag on 3rd January 2006 — one of the first crafts in India to receive this recognition. The GI tag certifies that every authentic Bidriware piece originates from Bidar, Karnataka, and is made using the traditional process by registered artisan families. Our products carry this certification.",
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
};

export default function EcommerceStore() {
  const [cart, setCart] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [notification, setNotification] = useState({ message: "", visible: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [craftSheetOpen, setCraftSheetOpen] = useState(false);
  const [infoModal, setInfoModal] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const shopRef = useRef(null);

  const showNotification = (msg) => {
    setNotification({ message: msg, visible: true });
    setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 2200);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...prev, { ...product, qty: 1 }];
    });
    showNotification(`${product.name.split("—")[0].trim()} added`);
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const updateQty = (id, delta) =>
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)));

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
  const gold = "#c8a55a";
  const bg = "#09090b";
  const card = "#111113";
  const border = "rgba(255,255,255,0.06)";
  const t1 = "#fafafa";
  const t2 = "#a1a1aa";
  const t3 = "#71717a";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      <div style={{ minHeight: "100vh", background: bg, color: t1, fontFamily: f }}>

        {/* ══════ NAVBAR ══════ */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 48px)", height: "64px",
          background: "rgba(9,9,11,0.8)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderBottom: `1px solid ${border}`,
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
                  background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`,
                  borderRadius: "8px", padding: "7px 12px 7px 34px", color: t1, fontSize: "13px",
                  fontFamily: f, width: "180px", outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                onBlur={(e) => (e.target.style.borderColor = border)}
              />
              <span style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: t3 }}>{Icons.search}</span>
            </div>

            <button onClick={() => setCartOpen(true)} style={{
              position: "relative", background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`,
              borderRadius: "8px", padding: "7px 10px", color: t2, cursor: "pointer", display: "flex",
              alignItems: "center", gap: "6px", fontSize: "13px", fontFamily: f, transition: "all 0.2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = t1; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = t2; }}
            >
              {Icons.cart}
              {cartCount > 0 && (
                <span style={{
                  position: "absolute", top: "-6px", right: "-6px",
                  background: gold, color: bg, fontSize: "10px", fontWeight: 700,
                  width: "18px", height: "18px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{cartCount}</span>
              )}
            </button>

            <button className="mobile-menu-btn" onClick={() => setMobileMenu(!mobileMenu)} style={{
              display: "none", background: "none", border: "none", color: t2, cursor: "pointer", padding: "4px",
            }}>{Icons.menu}</button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenu && (
          <div style={{
            position: "fixed", inset: 0, top: "64px", background: "rgba(9,9,11,0.97)", zIndex: 99,
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
            background: "rgba(255,255,255,0.03)",
          }}>
            600-year-old craft. GI-tagged. Handmade in Bidar.
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
              onMouseEnter={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = t1; }}
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
            { label: "GI Certified", sub: "Authentic Craft" },
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

              {/* Category pills */}
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                    background: activeCategory === cat ? t1 : "rgba(255,255,255,0.05)",
                    color: activeCategory === cat ? bg : t2,
                    border: activeCategory === cat ? "none" : `1px solid ${border}`,
                    padding: "7px 16px", borderRadius: "9999px", fontSize: "13px",
                    fontWeight: 500, fontFamily: f, cursor: "pointer", transition: "all 0.2s",
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* Product grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card" style={{
                  background: card, borderRadius: "12px", overflow: "hidden",
                  border: `1px solid ${border}`, transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Image */}
                  <div onClick={() => setSelectedProduct(product)} style={{
                    position: "relative", aspectRatio: "1", background: "#1a1a1c",
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
                        background: product.badge === "New" ? "rgba(255,255,255,0.1)" : gold,
                        color: product.badge === "New" ? t1 : bg,
                        fontSize: "10px", fontWeight: 700, padding: "4px 10px",
                        borderRadius: "6px", letterSpacing: "0.5px", textTransform: "uppercase",
                        backdropFilter: product.badge === "New" ? "blur(8px)" : "none",
                      }}>{product.badge}</span>
                    )}
                    {product.originalPrice && (
                      <span style={{
                        position: "absolute", top: "12px", right: "12px",
                        background: "rgba(200,165,90,0.15)", color: gold,
                        fontSize: "10px", fontWeight: 700, padding: "4px 8px",
                        borderRadius: "6px",
                      }}>-{Math.round((1 - product.price / product.originalPrice) * 100)}%</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px" }}>
                    <p style={{ fontSize: "11px", color: t3, marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
                      {product.category}
                    </p>
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
                      <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} style={{
                        background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`,
                        color: t2, padding: "6px 14px", borderRadius: "6px", fontSize: "12px",
                        fontWeight: 600, fontFamily: f, cursor: "pointer", transition: "all 0.2s",
                      }}
                        onMouseEnter={(e) => { e.target.style.background = t1; e.target.style.color = bg; e.target.style.borderColor = t1; }}
                        onMouseLeave={(e) => { e.target.style.background = "rgba(255,255,255,0.06)"; e.target.style.color = t2; e.target.style.borderColor = border; }}
                      >Add</button>
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

        {/* ══════ CRAFT BANNER ══════ */}
        <section style={{ padding: "0 clamp(16px, 4vw, 48px) clamp(48px, 6vw, 80px)" }}>
          <div onClick={() => setCraftSheetOpen(true)} style={{
            maxWidth: "1280px", margin: "0 auto", background: card, border: `1px solid ${border}`,
            borderRadius: "16px", padding: "clamp(32px, 5vw, 56px)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "32px",
            transition: "border-color 0.3s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
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
                  background: i === 0 ? gold : "rgba(255,255,255,0.04)",
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
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)")}
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
                flex: 1, background: "rgba(255,255,255,0.05)", border: `1px solid ${border}`,
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
                {["History of Bidri", "The 8-Step Process", "Bidar Fort Soil", "GI Tag Certificate", "Care Guide"].map((link) => (
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
                <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                  <a href="https://wa.me/918660446406" target="_blank" rel="noopener noreferrer" style={{ color: t3, transition: "color 0.2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#25D366")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = t3)}
                  >{Icons.whatsapp}</a>
                </div>
              </div>
            </div>
            <div style={{ borderTop: `1px solid ${border}`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <p style={{ fontSize: "12px", color: t3 }}>© 2025 BidriKala. All rights reserved.</p>
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
              background: "#18181b", borderRadius: "16px", maxWidth: "720px", width: "100%",
              maxHeight: "90vh", overflowY: "auto", border: `1px solid ${border}`,
              display: "grid", gridTemplateColumns: "1fr 1fr",
              animation: "slideUp 0.3s ease",
            }} className="modal-content">
              {/* Image side */}
              <div style={{ background: "#1a1a1c", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", minHeight: "300px", borderRadius: "16px 0 0 16px" }}>
                <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: "90%", maxHeight: "320px", objectFit: "contain" }} />
              </div>
              {/* Info side */}
              <div style={{ padding: "32px", position: "relative" }}>
                <button onClick={() => setSelectedProduct(null)} style={{
                  position: "absolute", top: "16px", right: "16px", background: "rgba(255,255,255,0.05)",
                  border: "none", color: t3, cursor: "pointer", width: "32px", height: "32px",
                  borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = t1; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = t3; }}
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

                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "24px" }}>
                  <span style={{ fontSize: "24px", fontWeight: 800 }}>₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                  {selectedProduct.originalPrice && (
                    <span style={{ fontSize: "14px", color: t3, textDecoration: "line-through" }}>₹{selectedProduct.originalPrice.toLocaleString("en-IN")}</span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }} style={{
                    flex: 1, background: t1, color: bg, border: "none", padding: "12px",
                    borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: f,
                    cursor: "pointer", transition: "opacity 0.2s",
                  }}
                    onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
                    onMouseLeave={(e) => (e.target.style.opacity = "1")}
                  >Add to Cart</button>
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
              background: "#18181b", borderLeft: `1px solid ${border}`,
              display: "flex", flexDirection: "column", animation: "slideRight 0.3s ease",
            }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: `1px solid ${border}` }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700 }}>Cart ({cartCount})</h3>
                <button onClick={() => setCartOpen(false)} style={{
                  background: "rgba(255,255,255,0.05)", border: "none", color: t3,
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
                        background: "#1a1a1c", flexShrink: 0, display: "flex",
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
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ fontSize: "14px", color: t2 }}>Total</span>
                    <span style={{ fontSize: "18px", fontWeight: 800 }}>₹{cartTotal.toLocaleString("en-IN")}</span>
                  </div>
                  <a
                    href={`https://wa.me/918660446406?text=${encodeURIComponent(`Hi BidriKala! I'd like to order:\n${cart.map((item) => `• ${item.name.split("—")[0].trim()} × ${item.qty} — ₹${(item.price * item.qty).toLocaleString("en-IN")}`).join("\n")}\n\nTotal: ₹${cartTotal.toLocaleString("en-IN")}`)}`}
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

        {/* ══════ INFO MODAL ══════ */}
        {infoModal && (
          <div onClick={() => setInfoModal(null)} style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
            zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px", animation: "fadeIn 0.2s ease",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{
              background: "#18181b", borderRadius: "16px", maxWidth: "520px", width: "100%",
              maxHeight: "80vh", overflowY: "auto", padding: "32px",
              border: `1px solid ${border}`, animation: "slideUp 0.3s ease",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: 800 }}>{infoModal}</h3>
                <button onClick={() => setInfoModal(null)} style={{
                  background: "rgba(255,255,255,0.05)", border: "none", color: t3,
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
              background: "#18181b", borderRadius: "20px 20px 0 0", maxHeight: "90vh",
              overflowY: "auto", borderTop: `1px solid rgba(255,255,255,0.08)`,
              animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}>
              {/* Drag handle */}
              <div style={{ padding: "12px 0 0", textAlign: "center", position: "sticky", top: 0, zIndex: 2, background: "#18181b", borderRadius: "20px 20px 0 0" }}>
                <div style={{ width: "36px", height: "4px", borderRadius: "4px", background: "rgba(255,255,255,0.15)", margin: "0 auto" }} />
              </div>

              {/* Header */}
              <div style={{ padding: "28px 32px 32px", textAlign: "center", position: "relative" }}>
                <button onClick={() => setCraftSheetOpen(false)} style={{
                  position: "absolute", top: "12px", right: "24px", background: "rgba(255,255,255,0.05)",
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
                      background: idx === 0 || idx === 7 ? gold : "rgba(255,255,255,0.04)",
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
            background: "rgba(255,255,255,0.06)", border: `1px solid ${border}`,
            color: t3, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = t1; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = t3; }}
        >{Icons.arrowUp}</button>

        {/* ══════ NOTIFICATION TOAST ══════ */}
        <div style={{
          position: "fixed", bottom: notification.visible ? "32px" : "-60px", left: "50%",
          transform: "translateX(-50%)", background: t1, color: bg,
          padding: "10px 24px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          fontFamily: f, zIndex: 9999, transition: "bottom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}>
          {notification.message}
        </div>
      </div>

      <style>{`
        html { scroll-behavior: smooth; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }

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
        }

        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
