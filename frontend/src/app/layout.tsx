import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Noel Bryant | Full Stack Software Engineer",
  description:
    "Full stack software engineer specialising in React, Next.js, Node.js and Ruby on Rails. Available for freelance and full-time opportunities.",
  openGraph: {
    type: "website",
    url: "https://noellincoln.github.io/",
    title: "Noel Bryant | Full Stack Software Engineer",
    description:
      "Full stack software engineer specialising in React, Next.js, Node.js and Ruby on Rails.",
    images: [{ url: "https://noellincoln.github.io/assets/images/og-preview.png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Noel_Lincoln",
    title: "Noel Bryant | Full Stack Software Engineer",
    description:
      "Full stack software engineer specialising in React, Next.js, Node.js and Ruby on Rails.",
    images: ["https://noellincoln.github.io/assets/images/og-preview.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
        <Script
          src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
