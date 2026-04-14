import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import JsonLd from "@/components/JsonLd";
import { getSiteUrl } from "@/lib/site-url";

// Fontes elegantes para a identidade da Valence
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Valence Semijoias | Elegância Atemporal",
    template: "%s | Valence Semijoias",
  },
  description:
    "Catálogo exclusivo de semijoias premium com acabamento artesanal.",
  applicationName: "Valence Semijoias",
  authors: [{ name: "Valence Semijoias" }],
  creator: "Valence Semijoias",
  publisher: "Valence Semijoias",
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "Valence Semijoias",
    title: "Valence Semijoias | Elegância Atemporal",
    description:
      "Catálogo exclusivo de semijoias premium com acabamento artesanal.",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Valence Semijoias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Valence Semijoias | Elegância Atemporal",
    description:
      "Catálogo exclusivo de semijoias premium com acabamento artesanal.",
    images: ["/android-chrome-512x512.png"],
  },
  verification: {
    google: "Lw2Yhnv9JA5dMz5HJCZKapN511lhV3jOCXG3zSng5g4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background`}
      >
        <JsonLd />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}