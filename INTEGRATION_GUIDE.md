# Integration Guide - BidriKala Improvements

## Quick Start

### Step 1: Import CSS Animations
Add to `src/main.jsx`:

```jsx
import './styles/animations.css';
```

### Step 2: Register Service Worker
Add to `src/main.jsx`:

```jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('SW registered:', registration))
      .catch(error => console.log('SW registration failed:', error));
  });
}
```

### Step 3: Update EcommerceStore.jsx

#### Import New Components
```jsx
import ProductCard from './components/ProductCard';
import CartSidebar from './components/CartSidebar';
import Navbar from './components/Navbar';
import LoadingSkeleton from './components/LoadingSkeleton';
import SEOHead, { updateMetaTags } from './components/SEOHead';
```

#### Import Utilities
```jsx
import { generateProductSchema, injectStructuredData } from './utils/seo';
import { announceToScreenReader, trapFocus } from './utils/accessibility';
import { 
  trackProductView, 
  trackAddToCart, 
  trackBeginCheckout,
  trackPurchase,
  trackSearch 
} from './utils/analytics';
import { validateCheckoutForm, validateCouponCode } from './utils/validation';
```

#### Replace Navbar Section
Find the `<nav>` section and replace with:

```jsx
<Navbar
  searchQuery={searchQuery}
  onSearchChange={(query) => {
    setSearchQuery(query);
    if (query) {
      shopRef.current?.scrollIntoView({ behavior: "smooth" });
      trackSearch(query, filteredProducts.length);
    }
  }}
  wishlistCount={wishlist.length}
  cartCount={cartCount}
  user={user}
  onCartClick={() => setCartOpen(true)}
  onWishlistClick={() => setWishlistOpen(true)}
  onLoginClick={() => setLoginOpen(true)}
  onLogout={handleLogout}
  onOpenOrders={openOrders}
  userMenuOpen={userMenuOpen}
  setUserMenuOpen={setUserMenuOpen}
  onShopClick={() => shopRef.current?.scrollIntoView({ behavior: "smooth" })}
  onStoryClick={() => setCraftSheetOpen(true)}
  onContactClick={() => setInfoModal("Contact Us")}
  colors={{ gold, bg, card, border, t1, t2, t3 }}
  f={f}
/>
```

#### Replace Product Grid Loading State
Find the loading skeleton section and replace with:

```jsx
{productsLoading && <LoadingSkeleton count={8} colors={{ card, border }} />}
```

#### Replace Product Cards
Find the product grid mapping and replace with:

```jsx
<div className="product-grid" style={{ 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", 
  gap: "16px" 
}}>
  {filteredProducts.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      onAddToCart={(p) => {
        addToCart(p);
        trackAddToCart(p);
      }}
      onViewDetails={() => {
        setSelectedProduct(product);
        trackProductView(product);
      }}
      isWishlisted={isWishlisted(product.id)}
      onToggleWishlist={toggleWishlist}
      onNotify={setNotifyProductId}
      colors={{ gold, bg, card, border, t1, t2, t3 }}
    />
  ))}
</div>
```

#### Replace Cart Sidebar
Find the cart sidebar section and replace with:

```jsx
{cartOpen && (
  <CartSidebar
    cart={cart}
    cartCount={cartCount}
    cartSubtotal={cartSubtotal}
    cartTotal={cartTotal}
    discount={discount}
    appliedCoupon={appliedCoupon}
    couponCode={couponCode}
    couponError={couponError}
    onClose={() => setCartOpen(false)}
    onUpdateQty={updateQty}
    onRemoveItem={(id) => {
      const item = cart.find(i => i.id === id);
      if (item) trackRemoveFromCart(item, item.qty);
      removeFromCart(id);
    }}
    onApplyCoupon={() => {
      const result = validateCouponCode(couponCode, cartSubtotal);
      if (result.valid) {
        setAppliedCoupon(result.coupon);
        setCouponError("");
        showNotification(`Coupon ${result.coupon.code} applied — ${result.coupon.percent}% OFF!`);
      } else {
        setCouponError(result.error);
      }
    }}
    onRemoveCoupon={removeCoupon}
    onCouponChange={(code) => {
      setCouponCode(code);
      setCouponError("");
    }}
    onCheckout={() => {
      if (!user) { 
        setLoginOpen(true); 
        return; 
      }
      trackBeginCheckout(cart, cartTotal);
      setCartOpen(false); 
      setCheckoutOpen(true); 
      setCheckoutStep(1); 
      setFormErrors({});
      setCustomerForm((prev) => ({ 
        ...prev, 
        name: user.name || prev.name, 
        phone: user.phone || prev.phone, 
        email: user.email || prev.email 
      }));
    }}
    colors={{ gold, bg, card, border, t1, t2, t3 }}
    user={user}
    f={f}
    mono={mono}
  />
)}
```

#### Update Checkout Validation
Replace the `validateCheckout` function:

```jsx
const proceedToPayment = () => {
  const validation = validateCheckoutForm(customerForm);
  if (validation.isValid) {
    setCheckoutStep(2);
  } else {
    setFormErrors(validation.errors);
  }
};
```

#### Add SEO Component
Add at the top of the return statement:

```jsx
return (
  <>
    <SEOHead />
    <div style={{ minHeight: "100vh", background: bg, color: t1, fontFamily: f }}>
      {/* rest of the component */}
    </div>
  </>
);
```

#### Track Product Views
Add useEffect for product detail modal:

```jsx
useEffect(() => {
  if (selectedProduct) {
    injectStructuredData(generateProductSchema(selectedProduct));
    updateMetaTags({
      title: `${selectedProduct.name} | BidriKala`,
      description: selectedProduct.description || `Handcrafted ${selectedProduct.name}`,
      image: selectedProduct.image,
      url: `https://bidrikalastore.vercel.app/product/${selectedProduct.id}`
    });
    trackProductView(selectedProduct);
  }
}, [selectedProduct]);
```

#### Track Purchases
Update the `confirmPayment` function to include tracking:

```jsx
const confirmPayment = async () => {
  // ... existing validation code ...
  
  setOrderId(newOrderId);
  setCheckoutStep(3);
  
  // Track purchase
  trackPurchase(newOrderId, cart, cartTotal, discount);
  
  // ... rest of the function ...
};
```

#### Add Screen Reader Announcements
Update notification function:

```jsx
const showNotification = (msg) => {
  setNotification({ message: msg, visible: true });
  announceToScreenReader(msg);
  setTimeout(() => setNotification((n) => ({ ...n, visible: false })), 2200);
};
```

### Step 4: Update package.json Scripts

Add build optimization:

```json
{
  "scripts": {
    "dev": "vite --host 0.0.0.0 --port 5173",
    "build": "vite build",
    "preview": "vite preview",
    "analyze": "vite build --mode analyze"
  }
}
```

### Step 5: Update vite.config.js

Add optimizations:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'vercel-vendor': ['@vercel/analytics', '@vercel/speed-insights']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  }
})
```

## Testing Checklist

### Functionality
- [ ] All product cards render correctly
- [ ] Cart operations work (add, remove, update quantity)
- [ ] Wishlist operations work
- [ ] Checkout flow completes
- [ ] Coupon codes validate properly
- [ ] Search filters products
- [ ] User authentication works

### SEO
- [ ] Meta tags update on product view
- [ ] Structured data validates on [Google Rich Results Test](https://search.google.com/test/rich-results)
- [ ] Open Graph tags work on [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt

### Accessibility
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces cart updates
- [ ] All interactive elements have proper labels
- [ ] Focus trap works in modals
- [ ] Color contrast meets WCAG AA standards
- [ ] Skip to content link works

### Performance
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 3.5s
- [ ] Images lazy load
- [ ] Service worker caches assets

### Mobile
- [ ] Responsive on all screen sizes
- [ ] Touch targets are at least 44x44px
- [ ] Modals work on mobile
- [ ] Cart sidebar slides smoothly
- [ ] PWA installable on mobile

## Deployment

### Vercel Deployment
1. Push changes to GitHub
2. Vercel will auto-deploy
3. Verify all features work in production
4. Test PWA installation
5. Run Lighthouse audit

### Post-Deployment
1. Submit sitemap to Google Search Console
2. Verify structured data in search results
3. Test social sharing on Facebook/Twitter
4. Monitor analytics for errors
5. Check service worker registration

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Ensure HTTPS in production
- Clear browser cache
- Check service-worker.js path

### Structured Data Not Showing
- Validate with Google Rich Results Test
- Check JSON-LD syntax
- Ensure script tag is in <head>
- Wait 24-48 hours for Google to index

### Components Not Rendering
- Check import paths
- Verify all props are passed correctly
- Check browser console for errors
- Ensure colors object is defined

### Analytics Not Tracking
- Check if gtag is loaded
- Verify event names match GA4 format
- Check Network tab for analytics requests
- Enable debug mode in development

## Next Steps

1. **A/B Testing**: Implement variant testing for conversion optimization
2. **Advanced Filters**: Add price range, rating filters
3. **Product Reviews**: Build review submission and display
4. **Wishlist Sync**: Sync wishlist across devices
5. **Email Marketing**: Integrate with email service
6. **Push Notifications**: Add web push for promotions
7. **Live Chat**: Integrate customer support chat
8. **Inventory Management**: Real-time stock updates

## Support

For issues or questions:
- Check IMPROVEMENTS.md for detailed documentation
- Review component files for inline comments
- Test in isolation before integrating
- Use browser DevTools for debugging

## Performance Monitoring

Monitor these metrics:
- Core Web Vitals (LCP, FID, CLS)
- Conversion rate
- Cart abandonment rate
- Average order value
- Page load times
- Error rates

Use Vercel Analytics and Google Analytics 4 for tracking.
