import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavigationLoadingProvider } from "@/contexts/NavigationLoadingContext";
import { Toaster } from "sonner";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import LoadingBar from "@/components/ui/LoadingBar";
import InstantLoadingBar from "@/components/ui/InstantLoadingBar";
import { ChatBubble } from "@/components/chat/LiveChat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "XlideLand - Premium Real Estate | Find Your Dream Home",
  description: "Discover luxury properties, expert real estate services, and your perfect home with XlideLand. Lagos's premier real estate agency with 20+ years of experience.",
  keywords: "real estate, luxury homes, Lagos properties, Nigeria properties, buy house, sell house, property investment",
  authors: [{ name: "XlideLand Team" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "XlideLand - Premium Real Estate",
    description: "Find your dream home with Lagos's #1 real estate agency",
    type: "website",
    locale: "en_NG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
      >
        <NavigationLoadingProvider>
          <LoadingBar />
          <InstantLoadingBar />
          <AuthProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster 
              position="top-right" 
              toastOptions={{
                style: {
                  background: 'white',
                  border: '1px solid #d1fae5',
                  color: '#065f46',
                },
              }}
            />
            <ChatBubble />
          </AuthProvider>
        </NavigationLoadingProvider>
      </body>
    </html>
  );
}
