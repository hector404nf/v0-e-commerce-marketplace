"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Store,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Plus,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

const menuItems = [
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
    submenu: [
      { title: "Ver todos", icon: Eye, href: "/admin/productos" },
      { title: "Añadir producto", icon: Plus, href: "/admin/productos/nuevo" },
      { title: "Categorías", icon: Package, href: "/admin/productos/categorias" },
    ],
  },
  {
    title: "Pedidos",
    icon: ShoppingCart,
    href: "/admin/pedidos",
    badge: "12",
    submenu: [
      { title: "Todos los pedidos", icon: Eye, href: "/admin/pedidos" },
      { title: "Pendientes", icon: Package, href: "/admin/pedidos?status=pendiente" },
      { title: "Procesando", icon: Package, href: "/admin/pedidos?status=procesando" },
    ],
  },
  {
    title: "Clientes",
    icon: Users,
    href: "/admin/clientes",
    badge: null,
  },
  {
    title: "Analíticas",
    icon: BarChart3,
    href: "/admin/analytics",
    badge: null,
  },
  {
    title: "Configuración",
    icon: Settings,
    href: "/admin/configuracion",
    badge: null,
  },
]

interface AdminSidebarProps {
  storeName?: string
}

export default function AdminSidebar({ storeName = "Mi Tienda" }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Store className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">{storeName}</h2>
                <p className="text-sm text-muted-foreground">Panel Admin</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.title}>
                {item.submenu ? (
                  <Collapsible open={openSubmenu === item.title} onOpenChange={() => toggleSubmenu(item.title)}>
                    <CollapsibleTrigger asChild>
                      <Button variant={isActive(item.href) ? "secondary" : "ghost"} className="w-full justify-between">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                          <ChevronDown className="h-4 w-4" />
                        </div>
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-1 mt-1 ml-4">
                      {item.submenu.map((subItem) => (
                        <Button
                          key={subItem.href}
                          variant={pathname === subItem.href ? "secondary" : "ghost"}
                          size="sm"
                          asChild
                          className="w-full justify-start"
                        >
                          <Link href={subItem.href} onClick={() => setIsOpen(false)}>
                            <subItem.icon className="h-4 w-4 mr-2" />
                            {subItem.title}
                          </Link>
                        </Button>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <Button
                    variant={isActive(item.href) ? "secondary" : "ghost"}
                    asChild
                    className="w-full justify-start"
                  >
                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Admin Usuario</p>
                <p className="text-xs text-muted-foreground">admin@tienda.com</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
