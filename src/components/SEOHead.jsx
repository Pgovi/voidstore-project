import { useEffect } from 'react';
import { injectStructuredData, generateOrganizationSchema } from '../utils/seo';

export default function SEOHead({ product, page = 'home' }) {
  useEffect(() => {
    // Inject organization schema on all pages
    injectStructuredData(generateOrganizationSchema());
  }, []);

  return null;
}

export function updateMetaTags({ title, description, image, url }) {
  // Update title
  if (title) document.title = title;
  
  // Update meta description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && description) metaDesc.setAttribute('content', description);
  
  // Update OG tags
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle && title) ogTitle.setAttribute('content', title);
  
  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc && description) ogDesc.setAttribute('content', description);
  
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage && image) ogImage.setAttribute('content', image);
  
  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl && url) ogUrl.setAttribute('content', url);
  
  // Update Twitter tags
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle && title) twitterTitle.setAttribute('content', title);
  
  const twitterDesc = document.querySelector('meta[name="twitter:description"]');
  if (twitterDesc && description) twitterDesc.setAttribute('content', description);
  
  const twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (twitterImage && image) twitterImage.setAttribute('content', image);
}
