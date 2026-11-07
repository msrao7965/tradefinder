import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stocksi | by Underground Bulls",
  description: "Stocksi by Underground Bulls — live market intelligence, equity scanners and trading tools.",
  applicationName: "Stocksi",
  appleWebApp: { capable: true, title: "Stocksi", statusBarStyle: "black-translucent" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-background font-sans text-foreground">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-[#b6ff69] focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
