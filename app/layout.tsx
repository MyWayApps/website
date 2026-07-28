import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins, Nunito } from "next/font/google"
import "./globals.css"
import { ErrorBoundary } from "@/components/error-boundary"
import { LanguageProvider } from "@/lib/language-context"

const inter = Inter({ subsets: ["latin"] })

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
})

// Nunito is rounder and more child-friendly than Inter
const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
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
