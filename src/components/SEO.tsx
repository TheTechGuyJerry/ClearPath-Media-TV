import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
  canonical?: string;
}

const DEFAULTS = {
  siteName: 'ClearPath Media TV',
  title: 'ClearPath Media TV — Africa Explained',
  description: "ClearPath Media TV is Nigeria's election intelligence platform — delivering data-driven analysis of politics, governance, and democratic processes. Africa Explained.",
  image: 'https://www.clearpathmediatv.com/og-clearpath.png',
  type: 'website',
  baseUrl: 'https://www.clearpathmediatv.com'
};

export default function SEO({
  title,
  description,
  image,
  type,
  url,
  canonical
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Title
    const finalTitle = title ? `${title} | ${DEFAULTS.siteName}` : DEFAULTS.title;
    document.title = finalTitle;

    // Helper to find or create meta tag
    const setMeta = (nameOrProperty: string, contentValue: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.head.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', contentValue);
    };

    // Helper to find or create link tag
    const setLink = (relName: string, hrefValue: string) => {
      let element = document.head.querySelector(`link[rel="${relName}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', relName);
        document.head.appendChild(element);
      }
      element.setAttribute('href', hrefValue);
    };

    const finalDescription = description || DEFAULTS.description;
    const finalImage = image || DEFAULTS.image;
    const finalType = type || DEFAULTS.type;
    
    // Support dynamic absolute canonical mapping
    const rawPath = location.pathname;
    const finalUrl = url || `${DEFAULTS.baseUrl}${rawPath}`;
    const finalCanonical = canonical || `${DEFAULTS.baseUrl}${rawPath}`;

    // 2. Standard Meta Tags
    setMeta('description', finalDescription);

    // 3. Canonical Link
    setLink('canonical', finalCanonical);

    // 4. Open Graph Tags
    setMeta('og:title', title || DEFAULTS.title, true);
    setMeta('og:description', finalDescription, true);
    setMeta('og:image', finalImage, true);
    setMeta('og:type', finalType, true);
    setMeta('og:url', finalUrl, true);
    setMeta('og:site_name', DEFAULTS.siteName, true);

    // 5. Twitter Card Tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title || DEFAULTS.title);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', finalImage);

  }, [title, description, image, type, url, canonical, location.pathname]);

  return null;
}
