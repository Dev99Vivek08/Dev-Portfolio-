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

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://alexchen.dev";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050505",
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: {
    default: "Alex Chen — Full Stack Developer & Creative Engineer",
    template: "%s | Alex Chen",
  },
  description:
    "Full Stack Developer specializing in React, Next.js, and immersive digital experiences. Building performant, beautiful web applications with 5+ years of experience.",
  keywords: [
    "developer", "portfolio", "fullstack", "react", "nextjs",
    "typescript", "web developer", "frontend", "backend",
    "three.js", "creative developer", "san francisco",
  ],
  authors: [{ name: "Alex Chen", url: BASE_URL }],
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
  metadataBase: new URL(BASE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
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
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alex Chen — Full Stack Developer",
    description: "Building performant, beautiful web applications with a cinematic touch.",
    images: ["/og-image.png"],
    creator: "@alexchendev",
    site: "@alexchendev",
  },
  icons: {
    icon: [{ url: "/favicon.ico" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alex Chen",
  url: BASE_URL,
  jobTitle: "Full Stack Developer",
  description:
    "Full Stack Developer specializing in React, Next.js, and immersive digital experiences.",
  sameAs: [
    "https://github.com",
    "https://linkedin.com",
    "https://twitter.com",
  ],
  knowsAbout: [
    "React", "Next.js", "TypeScript", "Node.js",
    "PostgreSQL", "Three.js", "AWS", "Docker",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "San Francisco",
    addressRegion: "CA",
    addressCountry: "US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      style={{ background: "#050505" }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#050505] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
