# BidriKala Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        User Browser                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Navbar     │  │  ProductCard │  │  CartSidebar │      │
│  │  Component   │  │   Component  │  │   Component  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌────────────────────────────────────────────────────┐     │
│  │         EcommerceStore (Main Component)            │     │
│  │  - State Management                                │     │
│  │  - Business Logic                                  │     │
│  │  - Event Handlers                                  │     │
│  └────────────────────────────────────────────────────┘     │
│                                                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   SEO    │  │Analytics │  │Validation│  │A11y Utils│   │
│  │  Utils   │  │  Utils   │  │  Utils   │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Worker                            │
│  - Caching Strategy                                          │
│  - Offline Support                                           │
│  - Background Sync                                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    External Services                         │
├─────────────────────────────────────────────────────────────┤
│  AWS API Gateway  │  Google Analytics  │  Vercel Analytics  │
│  Cognito Auth     │  Search Console    │  Speed Insights    │
└─────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.jsx
└── EcommerceStore.jsx
    ├── SEOHead
    ├── Navbar
    │   ├── SearchInput
    │   ├── WishlistButton
    │   ├── CartButton
    │   └── UserMenu
    ├── Hero Section
    ├── Product Grid
    │   └── ProductCard (multiple)
    │       ├── ProductImage
    │       ├── WishlistButton
    │       ├── ProductInfo
    │       └── AddToCartButton
    ├── CartSidebar
    │   ├── CartItems
    │   ├── CouponInput
    │   ├── PriceBreakdown
    │   └── CheckoutButton
    ├── WishlistSidebar
    ├── CheckoutModal
    ├── ProductDetailModal
    └── Footer
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                      User Actions                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Event Handlers                             │
│  - onClick, onChange, onSubmit                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Validation Layer                            │
│  - validateCheckoutForm()                                    │
│  - validateCouponCode()                                      │
│  - validateEmail()                                           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   State Updates                              │
│  - useState hooks                                            │
│  - localStorage sync                                         │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Side Effects                                │
│  - API calls                                                 │
│  - Analytics tracking                                        │
│  - Screen reader announcements                               │
│  - SEO updates                                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   UI Re-render                               │
│  - Component updates                                         │
│  - Animation triggers                                        │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Application State                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Product State                                               │
│  ├── products: []                                            │
│  ├── selectedProduct: null                                   │
│  ├── activeCategory: "All"                                   │
│  ├── searchQuery: ""                                         │
│  ├── sortBy: "featured"                                      │
│  └── productsLoading: true                                   │
│                                                               │
│  Cart State                                                  │
│  ├── cart: []                                                │
│  ├── cartOpen: false                                         │
│  ├── couponCode: ""                                          │
│  └── appliedCoupon: null                                     │
│                                                               │
│  User State                                                  │
│  ├── user: null                                              │
│  ├── accessToken: null                                       │
│  ├── loginOpen: false                                        │
│  └── userMenuOpen: false                                     │
│                                                               │
│  Wishlist State                                              │
│  ├── wishlist: []                                            │
│  ├── wishlistOpen: false                                     │
│  └── recentlyViewed: []                                      │
│                                                               │
│  Checkout State                                              │
│  ├── checkoutOpen: false                                     │
│  ├── checkoutStep: 1                                         │
│  ├── customerForm: {}                                        │
│  └── formErrors: {}                                          │
│                                                               │
│  UI State                                                    │
│  ├── notification: {}                                        │
│  ├── mobileMenu: false                                       │
│  └── craftSheetOpen: false                                   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## API Integration

```
┌─────────────────────────────────────────────────────────────┐
│                    API Endpoints                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  GET  /products                                              │
│  └─> Fetch all products                                      │
│                                                               │
│  GET  /cart                                                  │
│  └─> Fetch user's cart (authenticated)                       │
│                                                               │
│  POST /cart                                                  │
│  └─> Add/update cart item (authenticated)                    │
│                                                               │
│  DELETE /cart/:id                                            │
│  └─> Remove cart item (authenticated)                        │
│                                                               │
│  GET  /wishlist                                              │
│  └─> Fetch user's wishlist (authenticated)                   │
│                                                               │
│  POST /wishlist/:id                                          │
│  └─> Add to wishlist (authenticated)                         │
│                                                               │
│  DELETE /wishlist/:id                                        │
│  └─> Remove from wishlist (authenticated)                    │
│                                                               │
│  POST /orders                                                │
│  └─> Create new order (authenticated)                        │
│                                                               │
│  GET  /orders                                                │
│  └─> Fetch user's orders (authenticated)                     │
│                                                               │
│  POST /auth/signup                                           │
│  └─> User registration                                       │
│                                                               │
│  POST /auth/login                                            │
│  └─> User authentication                                     │
│                                                               │
│  POST /auth/verify                                           │
│  └─> Verify email/phone                                      │
│                                                               │
│  GET  /auth/me                                               │
│  └─> Get user profile (authenticated)                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Analytics Events Flow

```
User Action
    │
    ▼
Event Handler
    │
    ├─> Update State
    │
    └─> Track Event
            │
            ├─> Google Analytics 4
            │   └─> Event: add_to_cart, purchase, etc.
            │
            ├─> Vercel Analytics
            │   └─> Custom events
            │
            └─> Console (dev mode)
                └─> Debug logging
```

## SEO Implementation

```
Page Load
    │
    ▼
SEOHead Component
    │
    ├─> Inject Organization Schema
    │   └─> JSON-LD in <head>
    │
    └─> Set Default Meta Tags
            │
            ▼
User Views Product
    │
    ▼
Product Detail Modal Opens
    │
    ├─> Generate Product Schema
    │   └─> Inject into <head>
    │
    └─> Update Meta Tags
        ├─> og:title
        ├─> og:description
        ├─> og:image
        ├─> og:url
        ├─> twitter:title
        ├─> twitter:description
        └─> twitter:image
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                   Service Worker Cache                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Cache First (Static Assets)                                │
│  ├── /index.html                                             │
│  ├── /logo/*.png                                             │
│  ├── /manifest.json                                          │
│  └── CSS/JS bundles                                          │
│                                                               │
│  Network First (Dynamic Content)                             │
│  ├── /products API                                           │
│  ├── /cart API                                               │
│  └── /orders API                                             │
│                                                               │
│  Cache Then Network (Images)                                 │
│  └── Product images                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Performance Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  Optimization Layers                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Build Time                                                  │
│  ├── Code splitting                                          │
│  ├── Tree shaking                                            │
│  ├── Minification                                            │
│  └── Bundle optimization                                     │
│                                                               │
│  Load Time                                                   │
│  ├── Service worker caching                                  │
│  ├── Resource preloading                                     │
│  ├── Font optimization                                       │
│  └── Critical CSS inline                                     │
│                                                               │
│  Runtime                                                     │
│  ├── Lazy loading images                                     │
│  ├── Virtual scrolling                                       │
│  ├── Debounced search                                        │
│  └── Memoized components                                     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Measures                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Input Validation                                            │
│  ├── Email format validation                                 │
│  ├── Phone number validation                                 │
│  ├── Input sanitization                                      │
│  └── XSS prevention                                          │
│                                                               │
│  Authentication                                              │
│  ├── AWS Cognito                                             │
│  ├── JWT tokens                                              │
│  ├── Secure token storage                                    │
│  └── Token refresh                                           │
│                                                               │
│  API Security                                                │
│  ├── HTTPS only                                              │
│  ├── CORS configuration                                      │
│  ├── Rate limiting                                           │
│  └── Authorization headers                                   │
│                                                               │
│  Data Protection                                             │
│  ├── PII sanitization                                        │
│  ├── Secure localStorage                                     │
│  └── No sensitive data in URLs                               │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Accessibility Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Accessibility Features                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Semantic HTML                                               │
│  ├── Proper heading hierarchy                                │
│  ├── Landmark regions                                        │
│  ├── Form labels                                             │
│  └── Button vs link usage                                    │
│                                                               │
│  ARIA Attributes                                             │
│  ├── aria-label                                              │
│  ├── aria-labelledby                                         │
│  ├── aria-describedby                                        │
│  ├── aria-live regions                                       │
│  └── role attributes                                         │
│                                                               │
│  Keyboard Navigation                                         │
│  ├── Tab order                                               │
│  ├── Focus management                                        │
│  ├── Focus trap in modals                                    │
│  └── Keyboard shortcuts                                      │
│                                                               │
│  Visual Accessibility                                        │
│  ├── Color contrast (WCAG AA)                                │
│  ├── Focus indicators                                        │
│  ├── Text sizing                                             │
│  └── Reduced motion support                                  │
│                                                               │
│  Screen Reader Support                                       │
│  ├── Live announcements                                      │
│  ├── Status updates                                          │
│  ├── Error messages                                          │
│  └── Loading states                                          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Pipeline

```
Developer
    │
    ├─> Git Commit
    │       │
    │       ▼
    │   GitHub Repository
    │       │
    │       ▼
    │   Vercel Webhook
    │       │
    │       ▼
    │   Build Process
    │       ├─> Install dependencies
    │       ├─> Run build
    │       ├─> Optimize assets
    │       └─> Generate static files
    │           │
    │           ▼
    │       Deploy to CDN
    │           ├─> Edge locations
    │           ├─> SSL certificate
    │           └─> Custom domain
    │               │
    │               ▼
    │           Production Site
    │               ├─> Analytics active
    │               ├─> Service worker registered
    │               └─> SEO indexed
    │
    └─> Local Development
            ├─> Hot reload
            ├─> Debug tools
            └─> Mock data
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Stack                            │
├─────────────────────────────────────────────────────────────┤
│  Framework:        React 18                                  │
│  Build Tool:       Vite 5                                    │
│  Language:         JavaScript (ES6+)                         │
│  Styling:          Inline CSS-in-JS                          │
│  State:            React Hooks (useState, useEffect)         │
│  Routing:          None (SPA)                                │
├─────────────────────────────────────────────────────────────┤
│                    Backend Stack                             │
├─────────────────────────────────────────────────────────────┤
│  API:              AWS API Gateway                           │
│  Functions:        AWS Lambda                                │
│  Database:         DynamoDB                                  │
│  Auth:             AWS Cognito                               │
│  Storage:          S3                                        │
├─────────────────────────────────────────────────────────────┤
│                    DevOps Stack                              │
├─────────────────────────────────────────────────────────────┤
│  Hosting:          Vercel                                    │
│  CDN:              Vercel Edge Network                       │
│  Analytics:        Vercel Analytics + GA4                    │
│  Monitoring:       Vercel Speed Insights                     │
│  Version Control:  Git + GitHub                              │
└─────────────────────────────────────────────────────────────┘
```

---

*This architecture is designed for scalability, performance, and maintainability.*
