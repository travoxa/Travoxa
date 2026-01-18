import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Providers } from './providers'
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Travoxa - Explore India Like Never Before",
  description: "Discover the soul of India with Travoxa, your ultimate guide",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans `}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
