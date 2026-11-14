import type { Metadata } from "next";
import { Geist, Sora } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/providers/ReduxProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumina Studio — Cinematic AI Video, Image & Audio Generation",
  description:
    "Turn a single line of text into studio-grade video, images and sound. Lumina Studio is the creative engine for filmmakers, marketers and storytellers.",
  keywords: [
    "AI video generator",
    "text to video",
    "AI image generator",
    "Lumina Studio",
  ],
  openGraph: {
    title: "Lumina Studio — Cinematic AI Generation",
    description: "Turn text into studio-grade video, images and sound.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${sora.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
