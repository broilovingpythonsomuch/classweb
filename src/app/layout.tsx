import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClassHub - Modern Class Management System",
  description: "A beautiful and intuitive class management system for students, teachers, and administrators.",
  keywords: ["Class Management", "Education", "Students", "Teachers", "Schedule"],
  authors: [{ name: "ClassHub Team" }],
  icons: {
    icon: "https://api.dicebear.com/7.x/shapes/svg?seed=classhub",
  },
  openGraph: {
    title: "ClassHub - Modern Class Management System",
    description: "A beautiful and intuitive class management system",
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
      <body
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
