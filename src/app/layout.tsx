import type { Metadata } from "next";
import { Manrope, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";
import OfflineProvider from "@/components/OfflineProvider";
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
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
        className={`${manrope.variable} ${inter.variable} ${geistMono.variable} antialiased`}
      >
    <OfflineProvider>
          <Providers>
          {children}
          <Toaster />
        </Providers>
    </OfflineProvider>
      </body>
    </html>
  );
}
