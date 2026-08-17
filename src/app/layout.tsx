import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sireta — Ethiopian & African Film",
  description:
    "Ratings, reviews and cast pages for Ethiopian and African cinema — built by the people who watch it.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} font-body`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-coffee-600/50 mt-24 py-10 text-center text-sm text-cream/50">
            Sireta — built for Ethiopian &amp; African cinema. V1.
          </footer>
        </Providers>
      </body>
    </html>
  );
}
