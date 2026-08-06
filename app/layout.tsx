import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { LanguageProvider } from "@/lib/language-context"

// Self-hosted (next/font/local) instead of next/font/google — the Google
// fetch was aborting at dev/build time on this machine (Next 14's bundled
// fetcher vs. Node 23), even though the fonts themselves are reachable.
// Self-hosting removes the network dependency entirely. Files are the same
// latin-subset woff2s Google Fonts would have served, downloaded once.
const inter = localFont({
  src: "./fonts/inter/Inter-Variable.woff2",
  weight: "100 900",
  display: "swap",
})

const poppins = localFont({
  src: [
    { path: "./fonts/poppins/Poppins-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/poppins/Poppins-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/poppins/Poppins-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/poppins/Poppins-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/poppins/Poppins-800.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-poppins",
  display: "swap",
})

// Nunito is rounder and more child-friendly than Inter
const nunito = localFont({
  src: "./fonts/nunito/Nunito-Variable.woff2",
  weight: "200 1000",
  variable: "--font-nunito",
  display: "swap",
})

export const metadata: Metadata = {
  title: "MyWayApps - Educational Games for Kids",
  description: "Fun and educational games for children",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${poppins.variable} ${nunito.variable}`}>
        <LanguageProvider>
          <ErrorBoundary>{children}</ErrorBoundary>
        </LanguageProvider>
      </body>
    </html>
  )
}
