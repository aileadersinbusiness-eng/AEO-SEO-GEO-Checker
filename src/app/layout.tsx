import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AEO Visibility Analyzer — Will AI Search Recommend Your Content?",
  description: "Analyze your blog posts, LinkedIn articles, and website content for AI visibility, answer engine optimization, and citation potential across Google AI Mode, ChatGPT, Claude, Perplexity, and Gemini.",
  keywords: "AEO, answer engine optimization, AI search, content optimization, Google AI Mode, ChatGPT, Perplexity, AI visibility",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${interTight.variable} font-sans bg-background text-slate-200 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
