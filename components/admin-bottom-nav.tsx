"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const bottomNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    badge: null,
  },
  {
    title: "Productos",
    icon: Package,
    href: "/admin/productos",
    badge: "45",
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/pedidos",
    badge: "12",
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/admin/clientes",
    badge: null,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/admin/analytics",
    badge: null,
  },
  {
    title: "Config",
    icon: Settings,
    href: "/admin/configuracion",
    badge: null,
  },
]

export default function AdminBottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-6 h-16">
        {bottomNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center space-y-1 relative ${
              isActive(item.href) ? "text-primary bg-primary/5" : "text-gray-600 hover:text-primary hover:bg-gray-50"
            }`}
          >
            <div className="relative">
              <item.icon className="h-5 w-5" />
              {item.badge && (
                <Badge className="absolute -top-2 -right-2 h-4 w-4 text-[10px] p-0 flex items-center justify-center">
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-[10px] font-medium truncate w-full text-center">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
