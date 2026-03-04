// Image optimization utilities

export function getOptimizedImageUrl(url, options = {}) {
  const { width, quality = 80, format = 'webp' } = options;
  
  // If using a CDN service like Cloudinary or imgix, construct optimized URL
  // For now, return original URL with loading strategy
  return url;
}

export function generateSrcSet(url, widths = [320, 640, 960, 1280]) {
  return widths.map(w => `${getOptimizedImageUrl(url, { width: w })} ${w}w`).join(', ');
}

export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export function lazyLoadImages() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
  }
}
