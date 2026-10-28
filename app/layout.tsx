import type { Metadata } from "next";
import { Bangers, Cinzel, Rye } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const rye = Rye({
  variable: "--font-rye",
  subsets: ["latin"],
  weight: "400",
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: "400",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Thousand Sunny | Elbaph Adventure",
  description: "A cinematic journey with the Straw Hat Pirates to the legendary land of Elbaph.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rye.variable} ${bangers.variable} ${cinzel.variable} antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
