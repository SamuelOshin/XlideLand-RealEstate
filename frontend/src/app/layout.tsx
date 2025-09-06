import type { Metadata } from "next";
import { useState } from "react";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";
import { NavigationLoadingProvider } from "@/contexts/NavigationLoadingContext";
import { Toaster } from "sonner";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import LoadingBar from "@/components/ui/LoadingBar";
import InstantLoadingBar from "@/components/ui/InstantLoadingBar";
import LiveChat from "@/components/chat/LiveChat";
import { ReactQueryProvider } from "@/components/providers/ReactQueryProvider";
import ChatProvider from "@/components/providers/ChatProvider";

// Fallback font variables for builds without Google Fonts access
const inter = {
  variable: "--font-inter",
};

const playfair = {
  variable: "--font-playfair",
};

export const metadata: Metadata = {
  title: "XlideLand - Premium Real Estate | Find Your Dream Home",
  description: "Discover luxury properties, expert real estate services, and your perfect home with XlideLand. Lagos's premier real estate agency with 20+ years of experience.",
  keywords: "real estate, luxury homes, Lagos properties, Nigeria properties, buy house, sell house, property investment",
  authors: [{ name: "XlideLand Team" }],
  openGraph: {
    title: "XlideLand - Premium Real Estate",
    description: "Find your dream home with Lagos's #1 real estate agency",
    type: "website",
    locale: "en_NG",
    images: [
      {
        url: "/img/xlidelogo.png",
        width: 400,
        height: 120,
        alt: "XlideLand Logo",
      },
    ],
  },
  icons: {
    icon: "/img/xlidelogo.png",
    shortcut: "/img/xlidelogo.png",
    apple: "/img/xlidelogo.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
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
          <NextAuthProvider>
            <ReactQueryProvider>
              <AuthProvider>
                <ChatProvider>
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
             
                  {/* Live Chat Widget */}
                  <LiveChat 
                    enabled={true}
                    position="bottom-right"
                    primaryColor="#10b981"
                    greetingMessage="Hi! 👋 Welcome to XlideLand. How can we help you find your perfect property today?"
                  />
                </ChatProvider>
              </AuthProvider>
            </ReactQueryProvider>
          </NextAuthProvider>
        </NavigationLoadingProvider>
      </body>
    </html>
  );
}
