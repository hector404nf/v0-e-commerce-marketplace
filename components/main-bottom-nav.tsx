"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, Store, Search, ShoppingCart, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-store"

export function MainBottomNav() {
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const navItems = [
    {
      title: "Inicio",
      href: "/",
      icon: Home,
    },
    {
      title: "Productos",
      href: "/productos",
      icon: Package,
    },
    {
      title: "Tiendas",
      href: "/tiendas",
      icon: Store,
    },
    {
      title: "Buscar",
      href: "/busqueda-inteligente",
      icon: Search,
    },
    {
      title: "Carrito",
      href: "/carrito",
      icon: ShoppingCart,
      badge: totalItems > 0 ? totalItems : null,
    },
    {
      title: "Perfil",
      href: "/perfil",
      icon: User,
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200">
      <div className="grid grid-cols-6 gap-1 px-2 py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-colors relative ${
              isActive(item.href) ? "bg-primary text-white" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className="relative">
              <item.icon className="w-5 h-5 mb-1" />
              {item.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center text-xs"
                >
                  {item.badge}
                </Badge>
              )}
            </div>
            <span className="text-xs font-medium truncate w-full text-center">{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
