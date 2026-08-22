import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getSiteSettings } from "@/services/site.service";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: site.metaTitle,
    description: site.metaDescription,
  };
}

/**
 * Deliberately bare: the portfolio's fixed navbar, cursor and background
 * effects belong to the public site only, so they live in (site)/layout.tsx.
 * The admin panel renders its own chrome and would otherwise be overlapped by
 * a fixed z-50 header it has no use for.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-background text-foreground min-h-screen antialiased selection:bg-accent-violet selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme={site.defaultTheme}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
