import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/pixelated.css";
import { ThemeProvider } from "@/contexts/ThemeContext";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Trading Guide v2 - AI-Powered Chart Analysis",
  description: "Advanced trading chart analysis using AI vision technology. Analyze multiple timeframes with pixelated retro interface.",
  keywords: "trading, chart analysis, AI, technical analysis, cryptocurrency, forex",
  authors: [{ name: "Trading Guide" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${jetbrainsMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
