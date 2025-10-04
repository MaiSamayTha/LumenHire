import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lumenhire | Hiring OS for modern teams",
  description: "Design intentional hiring journeys, automate the busywork, and keep every stakeholder aligned.",
  keywords: ["hiring platform", "recruitment", "talent operations", "candidate experience"],
  openGraph: {
    title: "Lumenhire",
    description: "Modern teams run cohesive hiring rituals with Lumenhire.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={[geistSans.variable, geistMono.variable, "antialiased"].join(" ")}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}