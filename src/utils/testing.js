// Testing and debugging utilities

export const mockProducts = [
  {
    id: 1,
    productId: "1",
    name: "Nandi Basavanna Wall Frame — Silver Inlay",
    category: "Wall Art",
    price: 4500,
    originalPrice: 6000,
    rating: 4.8,
    reviews: 127,
    stock: 8,
    badge: "Bestseller",
    image: "https://via.placeholder.com/400",
    description: "Handcrafted Nandi Basavanna wall frame with intricate silver inlay work"
  },
  {
    id: 2,
    productId: "2",
    name: "Peacock Figurine — Pure Silver",
    category: "Figurines",
    price: 3200,
    originalPrice: null,
    rating: 4.9,
    reviews: 89,
    stock: 3,
    badge: "New",
    image: "https://via.placeholder.com/400",
    description: "Elegant peacock figurine with detailed silver inlay"
  }
];

export const mockUser = {
  name: "Test User",
  email: "test@example.com",
  phone: "9876543210",
  userId: "test-123"
};

export const mockCart = [
  {
    ...mockProducts[0],
    qty: 2
  }
];

export const logPerformance = () => {
  if (typeof window === 'undefined') return;
  
  const perfData = window.performance.timing;
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
  const connectTime = perfData.responseEnd - perfData.requestStart;
  const renderTime = perfData.domComplete - perfData.domLoading;
  
  console.group('⚡ Performance Metrics');
  console.log('Page Load Time:', pageLoadTime + 'ms');
  console.log('Connect Time:', connectTime + 'ms');
  console.log('Render Time:', renderTime + 'ms');
  console.groupEnd();
  
  return {
    pageLoadTime,
    connectTime,
    renderTime
  };
};

export const checkAccessibility = () => {
  const issues = [];
  
  // Check for images without alt text
  const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
  if (imagesWithoutAlt.length > 0) {
    issues.push(`${imagesWithoutAlt.length} images missing alt text`);
  }
  
  // Check for buttons without labels
  const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):not(:has(text))');
  if (buttonsWithoutLabel.length > 0) {
    issues.push(`${buttonsWithoutLabel.length} buttons missing labels`);
  }
  
  // Check for links without text
  const linksWithoutText = Array.from(document.querySelectorAll('a')).filter(
    link => !link.textContent.trim() && !link.getAttribute('aria-label')
  );
  if (linksWithoutText.length > 0) {
    issues.push(`${linksWithoutText.length} links missing text or labels`);
  }
  
  // Check for form inputs without labels
  const inputsWithoutLabel = Array.from(document.querySelectorAll('input')).filter(
    input => !input.getAttribute('aria-label') && !document.querySelector(`label[for="${input.id}"]`)
  );
  if (inputsWithoutLabel.length > 0) {
    issues.push(`${inputsWithoutLabel.length} inputs missing labels`);
  }
  
  if (issues.length > 0) {
    console.group('♿ Accessibility Issues');
    issues.forEach(issue => console.warn(issue));
    console.groupEnd();
  } else {
    console.log('✅ No accessibility issues found');
  }
  
  return issues;
};

export const simulateSlowNetwork = (delay = 2000) => {
  const originalFetch = window.fetch;
  
  window.fetch = (...args) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(originalFetch(...args));
      }, delay);
    });
  };
  
  console.log(`🐌 Simulating slow network (${delay}ms delay)`);
  
  return () => {
    window.fetch = originalFetch;
    console.log('✅ Network simulation disabled');
  };
};

export const testResponsiveness = () => {
  const breakpoints = {
    mobile: 375,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  };
  
  console.group('📱 Responsive Design Test');
  Object.entries(breakpoints).forEach(([name, width]) => {
    console.log(`${name}: ${width}px`);
  });
  console.groupEnd();
  
  return breakpoints;
};

export const measureComponentRender = (componentName, renderFn) => {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  console.log(`⏱️ ${componentName} rendered in ${(end - start).toFixed(2)}ms`);
  
  return result;
};

export const debugState = (stateName, stateValue) => {
  console.group(`🔍 State: ${stateName}`);
  console.log('Value:', stateValue);
  console.log('Type:', typeof stateValue);
  if (Array.isArray(stateValue)) {
    console.log('Length:', stateValue.length);
  } else if (typeof stateValue === 'object' && stateValue !== null) {
    console.log('Keys:', Object.keys(stateValue));
  }
  console.groupEnd();
};

export const validateProductData = (product) => {
  const required = ['id', 'name', 'price', 'category', 'image'];
  const missing = required.filter(field => !product[field]);
  
  if (missing.length > 0) {
    console.error('❌ Product validation failed. Missing fields:', missing);
    return false;
  }
  
  if (product.price <= 0) {
    console.error('❌ Product price must be greater than 0');
    return false;
  }
  
  if (product.stock < 0) {
    console.error('❌ Product stock cannot be negative');
    return false;
  }
  
  console.log('✅ Product data valid');
  return true;
};

export const testLocalStorage = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    console.log('✅ LocalStorage available');
    return true;
  } catch (e) {
    console.error('❌ LocalStorage not available:', e);
    return false;
  }
};

export const clearAllData = () => {
  if (confirm('Clear all local data? This will reset cart, wishlist, and user session.')) {
    localStorage.clear();
    sessionStorage.clear();
    console.log('🗑️ All local data cleared');
    window.location.reload();
  }
};

// Development helper - add to window object
if (process.env.NODE_ENV === 'development') {
  window.BidriKalaDebug = {
    logPerformance,
    checkAccessibility,
    simulateSlowNetwork,
    testResponsiveness,
    debugState,
    validateProductData,
    testLocalStorage,
    clearAllData,
    mockProducts,
    mockUser,
    mockCart
  };
  
  console.log('🛠️ Debug tools available at window.BidriKalaDebug');
}
