import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Zukkoma — O'quv markazi platformasi",
    template: "%s | Zukkoma",
  },
  description: "Zukkoma — o'quvchilar uchun zamonaviy LMS platforma. Davomat, imtihonlar, darslar va ko'proq.",
  keywords: ["zukkoma", "lms", "o'quv markazi", "davomat", "imtihon", "darslar"],
  authors: [{ name: "Zukkoma" }],
  creator: "Zukkoma",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    siteName: "Zukkoma",
    title: "Zukkoma — O'quv markazi platformasi",
    description: "O'quvchilar uchun zamonaviy LMS platforma. Davomat, imtihonlar, darslar va ko'proq.",
  },
  twitter: {
    card: "summary",
    title: "Zukkoma — O'quv markazi platformasi",
    description: "O'quvchilar uchun zamonaviy LMS platforma.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
