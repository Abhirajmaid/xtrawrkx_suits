import { Inter } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "./components/ConditionalLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Xtrawrkx Accounts - Admin Panel",
  description:
    "Admin panel for managing users, organizations, and access controls. Streamline your account management with Xtrawrkx Accounts.",
  viewport: "width=device-width, initial-scale=1",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      nocache: true,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
    },
  },
  openGraph: {
    type: "website",
    url: "https://account.xtrawrkx.com",
    title: "Xtrawrkx Accounts - Complete Admin Management Solution",
    description:
      "Powerful admin panel for managing users, organizations, and access controls. Streamline your account management with our comprehensive admin tools.",
    siteName: "Xtrawrkx Accounts",
    locale: "en_US",
    images: [
      {
        url: "https://account.xtrawrkx.com/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Xtrawrkx Accounts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    url: "https://account.xtrawrkx.com",
    title: "Xtrawrkx Accounts - Complete Admin Management Solution",
    description:
      "Powerful admin panel for managing users, organizations, and access controls.",
    images: ["https://account.xtrawrkx.com/images/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
  other: {
    "application-name": "Xtrawrkx Accounts",
    "apple-mobile-web-app-title": "Xtrawrkx Accounts",
    "theme-color": "#ffffff",
    "msapplication-TileColor": "#ffffff",
    bingbot: "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex",
    slurp: "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex",
    duckduckbot:
      "noindex, nofollow, nocache, noarchive, nosnippet, noimageindex",
  },
  alternates: {
    canonical: "https://account.xtrawrkx.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
