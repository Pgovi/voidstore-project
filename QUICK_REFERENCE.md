# Quick Reference - BidriKala Improvements

## 🚀 Quick Start (5 minutes)

### 1. Import CSS
```jsx
// src/main.jsx
import './styles/animations.css';
```

### 2. Register Service Worker
```jsx
// src/main.jsx - add after imports
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}
```

### 3. Import Components
```jsx
// src/EcommerceStore.jsx - add to imports
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Navbar from './components/Navbar';
import LoadingSkeleton from './components/LoadingSkeleton';
import SEOHead from './components/SEOHead';
```

### 4. Import Utilities
```jsx
// src/EcommerceStore.jsx - add to imports
import { trackAddToCart, trackProductView } from './utils/analytics';
import { validateCheckoutForm } from './utils/validation';
import { announceToScreenReader } from './utils/accessibility';
```

## 📦 Component Props

### ProductCard
```jsx
<ProductCard
  product={product}              // Product object
  onAddToCart={(p) => {}}       // Add to cart handler
  onViewDetails={() => {}}      // View details handler
  isWishlisted={boolean}        // Wishlist state
  onToggleWishlist={(id) => {}} // Toggle wishlist
  onNotify={(id) => {}}         // Notify when available
  colors={colorObject}          // Color theme
/>
```

### CartSidebar
```jsx
<CartSidebar
  cart={[]}                     // Cart items array
  cartCount={0}                 // Total items
  cartSubtotal={0}              // Subtotal amount
  cartTotal={0}                 // Total after discount
  discount={0}                  // Discount amount
  appliedCoupon={null}          // Applied coupon object
  couponCode=""                 // Coupon input value
  couponError=""                // Coupon error message
  onClose={() => {}}            // Close handler
  onUpdateQty={(id, delta) => {}} // Update quantity
  onRemoveItem={(id) => {}}     // Remove item
  onApplyCoupon={() => {}}      // Apply coupon
  onRemoveCoupon={() => {}}     // Remove coupon
  onCouponChange={(code) => {}} // Coupon input change
  onCheckout={() => {}}         // Checkout handler
  colors={colorObject}          // Color theme
  user={userObject}             // User object
  f={fontFamily}                // Font family
  mono={monoFont}               // Monospace font
/>
```

### Navbar
```jsx
<Navbar
  searchQuery=""                // Search input value
  onSearchChange={(q) => {}}    // Search handler
  wishlistCount={0}             // Wishlist count
  cartCount={0}                 // Cart count
  user={null}                   // User object
  onCartClick={() => {}}        // Cart click
  onWishlistClick={() => {}}    // Wishlist click
  onLoginClick={() => {}}       // Login click
  onLogout={() => {}}           // Logout handler
  onOpenOrders={() => {}}       // Orders handler
  userMenuOpen={false}          // User menu state
  setUserMenuOpen={(v) => {}}   // Set menu state
  onShopClick={() => {}}        // Shop nav click
  onStoryClick={() => {}}       // Story nav click
  onContactClick={() => {}}     // Contact nav click
  colors={colorObject}          // Color theme
  f={fontFamily}                // Font family
/>
```

## 🎯 Analytics Events

```jsx
import { 
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackBeginCheckout,
  trackPurchase,
  trackSearch,
  trackWishlistAdd
} from './utils/analytics';

// Track product view
trackProductView(product);

// Track add to cart
trackAddToCart(product, quantity);

// Track purchase
trackPurchase(orderId, cart, total, discount);

// Track search
trackSearch(query, resultsCount);
```

## ✅ Validation Functions

```jsx
import { 
  validateEmail,
  validatePhone,
  validatePincode,
  validateCheckoutForm,
  validateCouponCode
} from './utils/validation';

// Validate email
const isValid = validateEmail('test@example.com'); // true/false

// Validate phone
const isValid = validatePhone('9876543210'); // true/false

// Validate checkout form
const { isValid, errors } = validateCheckoutForm(formData);

// Validate coupon
const { valid, error, coupon } = validateCouponCode('BIDRI20', cartSubtotal);
```

## ♿ Accessibility Functions

```jsx
import { 
  announceToScreenReader,
  trapFocus,
  checkColorContrast
} from './utils/accessibility';

// Announce to screen reader
announceToScreenReader('Item added to cart');

// Trap focus in modal
const cleanup = trapFocus(modalElement);
// Later: cleanup();

// Check color contrast
const meetsWCAG = checkColorContrast('#b08d3e', '#ffffff');
```

## 🔍 SEO Functions

```jsx
import { 
  generateProductSchema,
  injectStructuredData,
  updateMetaTags
} from './utils/seo';

// Generate and inject product schema
const schema = generateProductSchema(product);
injectStructuredData(schema);

// Update meta tags
updateMetaTags({
  title: 'Product Name | BidriKala',
  description: 'Product description',
  image: 'https://example.com/image.jpg',
  url: 'https://example.com/product/1'
});
```

## 🛠️ Debug Tools (Development)

Open browser console and use:

```javascript
// Available at window.BidriKalaDebug

// Log performance metrics
BidriKalaDebug.logPerformance();

// Check accessibility
BidriKalaDebug.checkAccessibility();

// Simulate slow network
const restore = BidriKalaDebug.simulateSlowNetwork(3000);
// Later: restore();

// Test responsive breakpoints
BidriKalaDebug.testResponsiveness();

// Debug state
BidriKalaDebug.debugState('cart', cartState);

// Validate product data
BidriKalaDebug.validateProductData(product);

// Test localStorage
BidriKalaDebug.testLocalStorage();

// Clear all data
BidriKalaDebug.clearAllData();

// Mock data
BidriKalaDebug.mockProducts
BidriKalaDebug.mockUser
BidriKalaDebug.mockCart
```

## 🎨 Color Theme Object

```jsx
const colors = {
  gold: "#b08d3e",
  bg: "#faf9f7",
  card: "#ffffff",
  border: "rgba(0,0,0,0.08)",
  t1: "#1c1917",  // Primary text
  t2: "#57534e",  // Secondary text
  t3: "#a8a29e"   // Tertiary text
};
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🔗 Important URLs

### Development
- Local: http://localhost:5173
- Sitemap: http://localhost:5173/sitemap.xml
- Robots: http://localhost:5173/robots.txt
- Manifest: http://localhost:5173/manifest.json

### Testing Tools
- Lighthouse: Chrome DevTools > Lighthouse
- Rich Results: https://search.google.com/test/rich-results
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- WAVE: https://wave.webaim.org/
- PageSpeed: https://pagespeed.web.dev/

## 📋 Pre-Deployment Checklist

- [ ] All components imported correctly
- [ ] Service worker registered
- [ ] CSS animations imported
- [ ] Analytics tracking added
- [ ] Validation functions used
- [ ] Accessibility labels added
- [ ] SEO meta tags updated
- [ ] Structured data injected
- [ ] Local testing passed
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] Mobile responsive
- [ ] Accessibility tested

## 🐛 Common Issues & Fixes

### Service Worker Not Working
```javascript
// Check registration
navigator.serviceWorker.getRegistrations().then(console.log);

// Unregister all
navigator.serviceWorker.getRegistrations().then(regs => 
  regs.forEach(reg => reg.unregister())
);
```

### Components Not Rendering
```javascript
// Check imports
console.log(ProductCard); // Should not be undefined

// Check props
console.log(props); // Verify all required props
```

### Analytics Not Tracking
```javascript
// Check if gtag exists
console.log(typeof window.gtag); // Should be 'function'

// Enable debug mode
window.gtag('config', 'GA_MEASUREMENT_ID', { debug_mode: true });
```

### Styles Not Applying
```javascript
// Check if CSS is imported
import './styles/animations.css'; // In main.jsx

// Check class names
console.log(element.className);
```

## 💾 Local Storage Keys

```javascript
// Used by the app
'bk_wishlist'  // Wishlist items
'bk_recent'    // Recently viewed
'bk_user'      // User data
'bk_token'     // Auth token
'bk_email_dismissed' // Email popup dismissed
```

## 🔑 Environment Variables

```bash
# .env (if needed)
VITE_API_URL=https://d9fz0n04h2.execute-api.ap-south-1.amazonaws.com
VITE_GA_ID=G-XXXXXXXXXX
```

## 📞 Quick Help

- **Full Documentation**: See IMPROVEMENTS.md
- **Integration Steps**: See INTEGRATION_GUIDE.md
- **Implementation Summary**: See IMPLEMENTATION_SUMMARY.md
- **Component Source**: Check src/components/*.jsx
- **Utility Source**: Check src/utils/*.js

---

*Keep this file handy for quick reference during development!*
