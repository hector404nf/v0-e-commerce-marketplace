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
  ChevronDown,
  Plus,
  Eye,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleSubmenu = (title: string) => {
    if (isCollapsed) return
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider>
      <aside
        className={`fixed left-0 top-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden lg:flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Header */}
        <div className={`p-4 border-b border-gray-200 ${isCollapsed ? "px-2" : ""}`}>
          {isCollapsed ? (
            <div className="flex justify-center">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">{storeName}</h2>
                  <p className="text-xs text-muted-foreground">Panel Admin</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="absolute -right-3 top-20 z-10">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6 rounded-full bg-white shadow-md"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.submenu && !isCollapsed ? (
                <Collapsible open={openSubmenu === item.title} onOpenChange={() => toggleSubmenu(item.title)}>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      className="w-full justify-between h-10"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs h-5">
                            {item.badge}
                          </Badge>
                        )}
                        <ChevronDown className="h-3 w-3" />
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
                        className="w-full justify-start h-8"
                      >
                        <Link href={subItem.href}>
                          <subItem.icon className="h-3 w-3 mr-2" />
                          <span className="text-xs">{subItem.title}</span>
                        </Link>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive(item.href) ? "secondary" : "ghost"}
                      asChild
                      className={`w-full h-10 ${isCollapsed ? "justify-center px-0" : "justify-start"}`}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        {!isCollapsed && (
                          <>
                            <span className="ml-3 text-sm">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs h-5">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  {isCollapsed && (
                    <TooltipContent side="right">
                      <p>{item.title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={`p-2 border-t border-gray-200 ${isCollapsed ? "px-1" : ""}`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10">
                  <LogOut className="h-4 w-4 text-red-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Cerrar sesión</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 px-2">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Admin Usuario</p>
                  <p className="text-[10px] text-muted-foreground truncate">admin@tienda.com</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-red-600 hover:text-red-700 h-8">
                <LogOut className="h-3 w-3 mr-2" />
                <span className="text-xs">Cerrar sesión</span>
              </Button>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
