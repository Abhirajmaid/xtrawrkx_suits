"use client";

import Head from "next/head";

export default function MetaTags({
  title = "Xtrawrkx CRM Portal",
  description = "Comprehensive Customer Relationship Management system for sales, leads, deals, and client management.",
  image = "/images/og-image.png",
  url = "https://crm.xtrawrkx.com",
  type = "website",
  noIndex = true,
}) {
  const fullTitle = title.includes("Xtrawrkx")
    ? title
    : `${title} | Xtrawrkx CRM Portal`;

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Robots Meta Tags - Prevent indexing but allow social media crawlers */}
      {noIndex && (
        <>
          <meta
            name="robots"
            content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
          />
          <meta
            name="googlebot"
            content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
          />
          <meta
            name="bingbot"
            content="noindex, nofollow, nocache, noarchive, nosnippet, noimageindex"
          />
        </>
      )}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Xtrawrkx CRM Portal" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* LinkedIn */}
      <meta property="linkedin:card" content="summary_large_image" />
      <meta property="linkedin:title" content={fullTitle} />
      <meta property="linkedin:description" content={description} />
      <meta property="linkedin:image" content={image} />

      {/* WhatsApp */}
      <meta property="whatsapp:title" content={fullTitle} />
      <meta property="whatsapp:description" content={description} />
      <meta property="whatsapp:image" content={image} />

      {/* Additional Meta Tags */}
      <meta name="application-name" content="Xtrawrkx CRM" />
      <meta name="apple-mobile-web-app-title" content="Xtrawrkx CRM" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="msapplication-TileColor" content="#ffffff" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/favicon.ico" />
    </Head>
  );
}
