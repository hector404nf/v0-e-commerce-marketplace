"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Store, Package, ShoppingCart, User, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/cart-store"

const navItems = [
  {
    title: "Inicio",
    icon: Home,
    href: "/",
  },
  {
    title: "Productos",
    icon: Package,
    href: "/productos",
  },
  {
    title: "Tiendas",
    icon: Store,
    href: "/tiendas",
  },
  {
    title: "Buscar",
    icon: Search,
    href: "/busqueda-inteligente",
  },
  {
    title: "Carrito",
    icon: ShoppingCart,
    href: "/carrito",
    showBadge: true,
  },
  {
    title: "Perfil",
    icon: User,
    href: "/perfil",
  },
]

export default function MainBottomNav() {
  const pathname = usePathname()
  const { items } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-6 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-1 py-2 text-xs font-medium transition-colors relative ${
              isActive(item.href)
                ? "text-primary bg-primary/5"
                : "text-muted-foreground hover:text-primary hover:bg-primary/5"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate">{item.title}</span>
            {item.showBadge && totalItems > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]">
                {totalItems}
              </Badge>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
