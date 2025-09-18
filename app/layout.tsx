import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import MainSidebar from "@/components/main-sidebar"
import MainBottomNav from "@/components/main-bottom-nav"
import Footer from "@/components/footer"

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
        <div className="min-h-screen bg-background">
          {/* Sidebar para desktop */}
          <MainSidebar />

          {/* Navbar superior */}
          <Navbar />

          {/* Contenido principal */}
          <main className="lg:ml-64 pb-16 lg:pb-0">
            <div className="container mx-auto px-4 py-6">{children}</div>
          </main>

          {/* Footer */}
          <div className="lg:ml-64">
            <Footer />
          </div>

          {/* Bottom navigation para móviles */}
          <MainBottomNav />
        </div>
      </body>
    </html>
  )
}
