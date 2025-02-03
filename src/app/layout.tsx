import "./globals.css";
import type { Metadata } from "next";
import { Fredoka, Quicksand } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const fredoka = Fredoka({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-fredoka",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
});

export const metadata: Metadata = {
  title: "Lechem Cuizine | Premium Catering Services",
  description:
    "Experience exceptional catering services with Lechem Cuizine. We bring culinary excellence to your special events.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${fredoka.variable} ${quicksand.variable} font-sans`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
