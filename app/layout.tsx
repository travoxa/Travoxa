import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import { Providers } from './providers'
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import VerticalSidebar from "@/components/ui/VerticalSidebar";
import ChatWidget from "@/components/Chat/ChatWidget";
import PageLoader from "@/components/ui/PageLoader";

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
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans `}
      >
        <Providers>
          <PageLoader />
          <div className="flex min-h-screen w-full">
            <main className="flex-1 min-w-0 relative">
              {children}
            </main>
            {session && session.user?.role === 'user' && <VerticalSidebar />}
            <ChatWidget />
          </div>
        </Providers>
      </body>
    </html>
  );
}
