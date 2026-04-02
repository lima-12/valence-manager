import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

// Fontes elegantes para a identidade da Valence
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Valence Semijoias | Elegância Atemporal",
  description: "Catálogo exclusivo de semijoias premium com acabamento artesanal.",
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
        {children}
      </body>
    </html>
  );
}