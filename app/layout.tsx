import type { Metadata } from "next";
import { Providers } from './providers'
import "./globals.css";

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
        className="font-Inter"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
