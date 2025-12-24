import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Todo Master - Organize Your Life with Smart Task Management",
  description:
    "A powerful and intuitive todo app with user authentication, priority management, and cloud sync. Stay organized and boost your productivity with Todo Master.",
  keywords: [
    "todo app",
    "task manager",
    "productivity",
    "task list",
    "todo list",
    "task management",
    "organize tasks",
    "priority tasks",
    "cloud sync",
    "personal planner",
    "project management",
    "daily planner",
  ],
  authors: [{ name: "Todo Master Team" }],
  creator: "Todo Master",
  publisher: "Todo Master",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Todo Master - Smart Task Management App",
    description:
      "Organize your life with our beautiful and powerful todo app. Features include priority management, categories, and cloud sync.",
    url: "/",
    siteName: "Todo Master",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Todo Master - Smart Task Management",
    description:
      "Organize your life with our beautiful todo app. Priority management, categories, and cloud sync included.",
    creator: "@todomaster",
  },
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#1e293b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}
      >
        {children}
      </body>
    </html>
  );
}
