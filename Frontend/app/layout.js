import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TokenProvider from "../context";
import { SettingsProvider } from "../SettingsContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "BackBook | Your Modern Social Circle",
    template: "%s | BackBook",
  },
  description:
    "Connect, share, and explore with BackBook - the next-generation social media platform. Join a respectful community and share your stories with the world.",
  keywords: [
    "Social Media",
    "BackBook",
    "Community",
    "Connect",
    "Arabic Social Media",
    "Safe Networking",
  ],
  authors: [{ name: "BackBook Team" }],
  creator: "BackBook",
  publisher: "BackBook",
  manifest: "/manifest.json",
  themeColor: "#4f46e5",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en",
      "ar-SA": "/ar",
    },
  },
  openGraph: {
    title: "BackBook | Connect with your World",
    description:
      "The most advanced and secure social platform for sharing your moments.",
    url: "https://backbook.com",
    siteName: "BackBook",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BackBook Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BackBook | Your Social Space",
    description:
      "Join BackBook today and experience a cleaner, faster social web.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SettingsProvider>
          <TokenProvider>
            <Toaster position="top-center" reverseOrder={false} />
            {children}
          </TokenProvider>
        </SettingsProvider>
      </body>
    </html>
  );
}
