import { useEffect } from 'react';
import { SiteSettings } from '@/lib/siteSettings';

const setMeta = (attr: 'name' | 'property', key: string, value: string) => {
  if (!value) return;
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

const setLink = (rel: string, href: string) => {
  if (!href) return;
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const absolute = (url: string, base: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  const origin = (base || window.location.origin).replace(/\/$/, '');
  return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Syncs the document head with the admin-managed SEO settings.
 * Note: social/chat crawlers read the static index.html, so these
 * runtime updates affect browsers and JS-executing crawlers only.
 */
export const useDocumentMeta = (settings: SiteSettings | undefined) => {
  useEffect(() => {
    if (!settings) return;

    const siteUrl = (settings.site_url || window.location.origin).replace(/\/$/, '');
    const title = settings.meta_title || settings.brand_name;
    const description = settings.meta_description || settings.tagline || '';
    const image = absolute(settings.social_image_url || '', siteUrl);
    const pageUrl = `${siteUrl}${window.location.pathname}`;

    if (title) document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', pageUrl);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    if (image) {
      setMeta('property', 'og:image', image);
      setMeta('property', 'og:image:secure_url', image);
      setMeta('name', 'twitter:image', image);
    }
    setLink('canonical', pageUrl);
  }, [settings]);
};
