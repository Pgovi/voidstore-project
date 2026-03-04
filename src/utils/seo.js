// SEO utility functions for structured data and meta tags

export function generateProductSchema(product) {
  return {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.image,
    "description": product.description || `Handcrafted ${product.name} - Pure silver inlay Bidriware from Bidar, Karnataka`,
    "sku": product.productId || product.id,
    "brand": {
      "@type": "Brand",
      "name": "BidriKala"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://bidrikalastore.vercel.app/product/${product.id}`,
      "priceCurrency": "INR",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviews
    }
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "BidriKala",
    "url": "https://bidrikalastore.vercel.app",
    "logo": "https://bidrikalastore.vercel.app/logo/bidrikala-logo-full.png",
    "description": "Handcrafted Bidriware — direct from Bidar's artisan families. 600 years of tradition.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mangalpet Road",
      "addressLocality": "Bidar",
      "addressRegion": "Karnataka",
      "postalCode": "585401",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-86604-46406",
      "contactType": "Customer Service",
      "email": "namaste@bidrikala.in"
    },
    "sameAs": [
      "https://instagram.com/bidrikala",
      "https://wa.me/918660446406"
    ]
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function injectStructuredData(schema) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(schema);
  
  // Remove existing schema if present
  const existing = document.querySelector('script[type="application/ld+json"]');
  if (existing) existing.remove();
  
  document.head.appendChild(script);
}
