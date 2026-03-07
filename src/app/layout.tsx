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
  title: "Class 7.3 - Class Website",
  description:
    "Official website for Class 7.3 - students, schedule, announcements, teachers, and class structure.",
  keywords: [
    "Class 7.3",
    "Education",
    "Students",
    "Teachers",
    "Schedule",
  ],
  authors: [{ name: "Class 7.3" }],
  icons: {
    icon: "https://api.dicebear.com/7.x/shapes/svg?seed=class73",
  },
  openGraph: {
    title: "Class 7.3 - Class Website",
    description: "Official website for Class 7.3",
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
