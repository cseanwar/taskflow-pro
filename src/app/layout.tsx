import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-inter)]">
        {children}
      </body>
    </html>
  );
}
