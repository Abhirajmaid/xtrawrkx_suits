"use client";

import { useEffect } from "react";

export default function SEO({
  title = "Xtrawrkx CRM Portal",
  description = "Comprehensive Customer Relationship Management system for sales, leads, deals, and client management.",
  image = "/images/og-image.png",
  url,
  type = "website",
  noIndex = true,
}) {
  const fullTitle = title.includes("Xtrawrkx")
    ? title
    : `${title} | Xtrawrkx CRM Portal`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://crm.xtrawrkx.com${image}`;
  const currentUrl =
    url ||
    (typeof window !== "undefined"
      ? window.location.href
      : "https://crm.xtrawrkx.com");

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update or create meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property
        ? `meta[property="${name}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector);

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", name);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", description);

    // Robots meta tags
    if (noIndex) {
      updateMetaTag(
        "robots",
        "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
      );
      updateMetaTag(
        "googlebot",
        "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
      );
      updateMetaTag(
        "bingbot",
        "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
      );
    }

    // Open Graph tags
    updateMetaTag("og:type", type, true);
    updateMetaTag("og:url", currentUrl, true);
    updateMetaTag("og:title", fullTitle, true);
    updateMetaTag("og:description", description, true);
    updateMetaTag("og:image", fullImageUrl, true);
    updateMetaTag("og:image:width", "1200", true);
    updateMetaTag("og:image:height", "630", true);
    updateMetaTag("og:image:alt", title, true);
    updateMetaTag("og:site_name", "Xtrawrkx CRM Portal", true);
    updateMetaTag("og:locale", "en_US", true);

    // Twitter tags
    updateMetaTag("twitter:card", "summary_large_image", true);
    updateMetaTag("twitter:url", currentUrl, true);
    updateMetaTag("twitter:title", fullTitle, true);
    updateMetaTag("twitter:description", description, true);
    updateMetaTag("twitter:image", fullImageUrl, true);

    // LinkedIn tags
    updateMetaTag("linkedin:card", "summary_large_image", true);
    updateMetaTag("linkedin:title", fullTitle, true);
    updateMetaTag("linkedin:description", description, true);
    updateMetaTag("linkedin:image", fullImageUrl, true);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", currentUrl);
  }, [fullTitle, description, fullImageUrl, currentUrl, type, noIndex, title]);

  return null; // This component doesn't render anything
}
