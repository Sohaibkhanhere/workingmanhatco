import type { Metadata } from "next";
import { Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Workin' Man Hat Co. | Premium Hats & Apparel — Made in Texas",
  description:
    "Premium hats & apparel for the everyday workin' man. Handmade in Texas, USA. Free shipping over $75. Shop limited drops now.",
  keywords:
    "workin man hats, cowboy hats, trucker hats, blue collar apparel, Texas hats, handmade caps, American made hats",
  openGraph: {
    title: "Workin' Man Hat Co. | Premium Hats — Made in Texas",
    description:
      "Premium hats & apparel for the everyday workin' man. Handmade in Texas.",
    url: "https://workinmanhatco.com",
    siteName: "Workin' Man Hat Co.",
    images: [
      {
        url: "https://images.squarespace-cdn.com/content/v1/6890bae40faa362f5af230e2/1754520881053-GITP2B476NHFI441CJ5Y/IMG_3617.jpeg?format=1500w",
        width: 1500,
        height: 1500,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Workin' Man Hat Co.",
    description: "Premium hats & apparel for the everyday workin' man.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://workinmanhatco.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={sourceSans.variable} data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:ital,wght@0,300..700;1,300..700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Workin' Man Hat Co.",
              url: "https://workinmanhatco.com",
              email: "workinmanhatco@gmail.com",
              address: { "@type": "PostalAddress", addressLocality: "Texas", addressRegion: "TX", addressCountry: "US" },
              geo: { "@type": "GeoCoordinates", latitude: 31.0, longitude: -100.0 },
              priceRange: "$30-$50",
              areaServed: { "@type": "Country", name: "United States" },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-cream text-brand antialiased">
        <Providers>
          {children}
        </Providers>
        <div className="grain-overlay" />
      </body>
    </html>
  );
}
