import type { Metadata } from "next";
import { Geist, Geist_Mono, Open_Sans, Ultra } from "next/font/google";
import "./globals.css";
import TopAppBar from "@/components/AppBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const ultra = Ultra({
  variable: "--font-ultra",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "the donuts shop",
  description: "trinh's donut shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} ${ultra.variable} antialiased`}
      >
        <TopAppBar />
        {children}
      </body>
    </html>
  );
}
