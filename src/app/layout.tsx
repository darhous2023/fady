import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "sonner";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "@/components/store/ScrollToTop";
import CartDrawer from "@/components/store/CartDrawer";
import PageViewTracker from "@/components/store/PageViewTracker";
import "@/styles/globals.css";

const SITE_URL = "https://fady-delta.vercel.app"
const OG_IMAGE = `${SITE_URL}/opengraph-image`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ELFADY — معرض سيارات",
    template: "%s — ELFADY",
  },
  description: "معرض الفادي لتجارة السيارات — سيارات جديدة ومستعملة، بثقة وشفافية، وتواصل فوري عبر واتساب",
  keywords: ["سيارات مستعملة", "سيارات جديدة", "معرض سيارات", "معرض الفادي", "elfady", "شراء سيارة مصر", "بيع سيارات"],
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  authors: [{ name: "ELFADY" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: SITE_URL,
    siteName: "ELFADY",
    title: "ELFADY — معرض سيارات",
    description: "معرض الفادي لتجارة السيارات — سيارات جديدة ومستعملة، بثقة وشفافية",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "ELFADY" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ELFADY — معرض سيارات",
    description: "معرض الفادي لتجارة السيارات — سيارات جديدة ومستعملة",
    images: [OG_IMAGE],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon-192.png", sizes: "192x192" }],
    apple: "/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#9BA3AA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;600;700;800;900&family=Space+Mono:wght@400;700&family=Cinzel:wght@400;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
          }
        `}} />
        {/* Belt-and-suspenders alongside the service-worker fix: a stale JS
            chunk (from a page open across a redeploy) can fail to load as a
            plain async event outside React's render cycle, which error.tsx's
            boundary never sees. Catch it here, as early and globally as
            possible, and force a full reload -- once per tab session, to
            avoid a reload loop if a deploy is genuinely still in progress. */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function () {
            function isChunkError(msg) {
              return typeof msg === 'string' && /ChunkLoadError|Loading chunk|Failed to load chunk|Loading CSS chunk/i.test(msg);
            }
            function handle(e) {
              var msg = (e && e.message) || (e && e.reason && e.reason.message) || (e && e.reason) || '';
              var name = (e && e.error && e.error.name) || (e && e.reason && e.reason.name) || '';
              if (name === 'ChunkLoadError' || isChunkError(msg)) {
                if (!sessionStorage.getItem('elfady-chunk-reload')) {
                  sessionStorage.setItem('elfady-chunk-reload', '1');
                  window.location.reload();
                }
              }
            }
            window.addEventListener('error', handle);
            window.addEventListener('unhandledrejection', handle);
          })();
        `}} />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{ __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
            `}} />
          </>
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["AutoDealer", "Organization"],
              "@id": `${SITE_URL}/#org`,
              "name": "ELFADY",
              "url": SITE_URL,
              "logo": `${SITE_URL}/icon-192.png`,
              "address": { "@type": "PostalAddress", "streetAddress": "شارع أحمد عرابي، المهندسين", "addressLocality": "الجيزة", "addressCountry": "EG" },
              "contactPoint": { "@type": "ContactPoint", "contactType": "customer service", "telephone": "+201555557745", "availableLanguage": "Arabic" },
              "sameAs": [
                "https://www.facebook.com/elfadywaelmeladcars",
                "https://www.instagram.com/el_fady_car_trading/",
              ],
            },
            {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              "url": SITE_URL,
              "name": "ELFADY",
              "publisher": { "@id": `${SITE_URL}/#org` },
              "potentialAction": { "@type": "SearchAction", "target": `${SITE_URL}/?q={search_term_string}`, "query-input": "required name=search_term_string" }
            }
          ]
        })}} />
      </head>
      <body className={GeistSans.className}>
        <CartProvider>
          {children}
          <ScrollToTop />
          <CartDrawer />
          <PageViewTracker />
        </CartProvider>
        <Toaster position="bottom-left" richColors />
      </body>
    </html>
  );
}
