import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
};

export const metadata: Metadata = {
  title: {
    default: "Alex Chen — Full Stack Developer & Creative Engineer",
    template: "%s | Alex Chen",
  },
  description:
    "Full Stack Developer specializing in React, Next.js, and immersive digital experiences. Building performant, beautiful web applications with 5+ years of experience.",
  keywords: [
    "developer",
    "portfolio",
    "fullstack",
    "react",
    "nextjs",
    "typescript",
    "web developer",
    "frontend",
    "backend",
    "three.js",
    "creative developer",
  ],
  authors: [{ name: "Alex Chen", url: "https://alexchen.dev" }],
  creator: "Alex Chen",
  publisher: "Alex Chen",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL("https://alexchen.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://alexchen.dev",
    siteName: "Alex Chen — Portfolio",
    title: "Alex Chen — Full Stack Developer & Creative Engineer",
    description:
      "Full Stack Developer specializing in React, Next.js, and immersive digital experiences.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Alex Chen — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Chen — Full Stack Developer",
    description:
      "Building performant, beautiful web applications with a cinematic touch.",
    images: ["/og-image.png"],
    creator: "@alexchendev",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ background: "#050505" }}
    >
      <body className="antialiased bg-[#050505] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
