import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Navbar } from "@/components/layout/Navbar";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { BackgroundEffects } from "@/components/ui/BackgroundEffects";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Chaitanya Krishna | Full Stack Developer",
  description: "Portfolio of Paruchuri Chaitanya Krishna, a Full Stack Developer building premium, scalable web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} bg-noise bg-background text-foreground min-h-screen antialiased selection:bg-accent-violet selection:text-white`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <BackgroundEffects />
          <CustomCursor />
          <Navbar />
          <main className="relative z-10 flex min-h-screen flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
