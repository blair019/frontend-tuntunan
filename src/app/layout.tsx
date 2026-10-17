
import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Tuntunan | Discover Your Next Café",
  description:
    "Discover cafés, explore new places, and find your next favorite coffee spot with Tuntunan.",

  icons: {
    icon: [
      {
        url: "/images/tuntunan-favicon.png",
        type: "image/png",
      },
    ],
    shortcut: "/images/tuntunan-favicon.png",
    apple: "/images/tuntunan-favicon.png",
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
