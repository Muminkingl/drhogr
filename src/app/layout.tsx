import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./i18n/LanguageContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dr. Hogr Ghareeb Khidr | Journalist, Scholar & Humanitarian Leader",
  description:
    "Portfolio of Dr. Hogr Ghareeb Khidr — PhD scholar in Sharia & Law, university lecturer, journalist, media founder, and humanitarian organization president based in Kurdistan, Iraq.",
  keywords: [
    "Dr. Hogr Ghareeb",
    "Kurdistan journalist",
    "Judi TV",
    "Islamic scholar",
    "Elia Foundation",
    "Knowledge University",
  ],
  openGraph: {
    title: "Dr. Hogr Ghareeb Khidr",
    description:
      "Journalist, University Lecturer & Humanitarian Leader",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${notoKufi.variable}`}>
      <body className="min-h-screen antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
