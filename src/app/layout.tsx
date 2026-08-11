import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/lib/theme";
import { THEME_SCRIPT } from "@/lib/theme-script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TaskFlow Pro – Project Management & Team Collaboration",
  description:
    "A modern SaaS project management platform with Kanban boards, sprint planning, real-time analytics, and team collaboration. Built for startups, agencies, and development teams.",
  keywords: [
    "project management",
    "kanban board",
    "sprint planning",
    "team collaboration",
    "task management",
    "SaaS",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${hanken.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col font-(family-name:--font-inter)">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
