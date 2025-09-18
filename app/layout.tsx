import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { MainSidebar } from "@/components/main-sidebar"
import { MainBottomNav } from "@/components/main-bottom-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Marketplace - Tu tienda online",
  description: "Encuentra los mejores productos en nuestro marketplace",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar para desktop */}
          <MainSidebar />

          {/* Contenido principal */}
          <div className="flex-1 flex flex-col lg:ml-64">
            <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">{children}</main>
          </div>

          {/* Bottom navigation para móviles */}
          <MainBottomNav />
        </div>
      </body>
    </html>
  )
}
