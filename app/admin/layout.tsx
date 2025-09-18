import type React from "react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminBottomNav from "@/components/admin-bottom-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar para desktop */}
      <AdminSidebar />

      {/* Contenido principal */}
      <main className="lg:ml-64 pb-16 lg:pb-0">
        <div className="p-4 lg:p-6">{children}</div>
      </main>

      {/* Bottom navigation para móviles */}
      <AdminBottomNav />
    </div>
  )
}
