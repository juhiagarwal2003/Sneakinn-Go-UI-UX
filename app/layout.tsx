import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { PickupProvider } from "@/context/pickup-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sneaker Cleaning Service",
  description: "Get your sneakers professionally cleaned",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <PickupProvider>{children}</PickupProvider>
      </body>
    </html>
  )
}


import './globals.css'