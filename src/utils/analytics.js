// Analytics tracking utilities

export const trackEvent = (eventName, properties = {}) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  // Vercel Analytics (already integrated via @vercel/analytics)
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Event:', eventName, properties);
  }
};

export const trackPageView = (path, title) => {
  trackEvent('page_view', {
    page_path: path,
    page_title: title,
  });
};

export const trackProductView = (product) => {
  trackEvent('view_item', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    }]
  });
};

export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity,
    }]
  });
};

export const trackRemoveFromCart = (product, quantity = 1) => {
  trackEvent('remove_from_cart', {
    currency: 'INR',
    value: product.price * quantity,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
      quantity: quantity,
    }]
  });
};

export const trackBeginCheckout = (cart, total) => {
  trackEvent('begin_checkout', {
    currency: 'INR',
    value: total,
    items: cart.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.qty,
    }))
  });
};

export const trackPurchase = (orderId, cart, total, discount = 0) => {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: total,
    tax: 0,
    shipping: 0,
    discount: discount,
    items: cart.map(item => ({
      item_id: item.id,
      item_name: item.name,
      item_category: item.category,
      price: item.price,
      quantity: item.qty,
    }))
  });
};

export const trackSearch = (searchTerm, resultsCount) => {
  trackEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount,
  });
};

export const trackWishlistAdd = (product) => {
  trackEvent('add_to_wishlist', {
    currency: 'INR',
    value: product.price,
    items: [{
      item_id: product.id,
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    }]
  });
};

export const trackShare = (method, contentType, itemId) => {
  trackEvent('share', {
    method: method,
    content_type: contentType,
    item_id: itemId,
  });
};

export const trackSignUp = (method) => {
  trackEvent('sign_up', {
    method: method,
  });
};

export const trackLogin = (method) => {
  trackEvent('login', {
    method: method,
  });
};
