"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Store,
  Package,
  ShoppingCart,
  User,
  Search,
  Heart,
  MapPin,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Plus,
  Eye,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useCartStore } from "@/lib/cart-store"

const menuItems = [
  {
    title: "Inicio",
    icon: Home,
    href: "/",
    badge: null,
  },
  {
    title: "Productos",
    icon: Package,
    href: "/productos",
    badge: null,
    submenu: [
      { title: "Ver todos", icon: Eye, href: "/productos" },
      { title: "Electrónica", icon: Package, href: "/productos?categoria=electronica" },
      { title: "Ropa", icon: Package, href: "/productos?categoria=ropa" },
      { title: "Hogar", icon: Package, href: "/productos?categoria=hogar" },
      { title: "Deportes", icon: Package, href: "/productos?categoria=deportes" },
    ],
  },
  {
    title: "Tiendas",
    icon: Store,
    href: "/tiendas",
    badge: null,
  },
  {
    title: "Búsqueda",
    icon: Search,
    href: "/busqueda-inteligente",
    badge: null,
  },
  {
    title: "Mi Cuenta",
    icon: User,
    href: "/perfil",
    badge: null,
    submenu: [
      { title: "Perfil", icon: User, href: "/perfil" },
      { title: "Mis Pedidos", icon: Package, href: "/perfil/pedidos" },
      { title: "Direcciones", icon: MapPin, href: "/perfil/direcciones" },
      { title: "Lista de Deseos", icon: Heart, href: "/perfil/wishlist" },
    ],
  },
  {
    title: "Mi Tienda",
    icon: Store,
    href: "/dashboard-tienda",
    badge: null,
    submenu: [
      { title: "Dashboard", icon: Eye, href: "/dashboard-tienda" },
      { title: "Productos", icon: Package, href: "/dashboard-tienda/productos" },
      { title: "Pedidos", icon: ShoppingCart, href: "/dashboard-tienda/pedidos" },
      { title: "Clientes", icon: User, href: "/dashboard-tienda/clientes" },
      { title: "Subir Producto", icon: Plus, href: "/subir-producto" },
      { title: "Admin Panel", icon: Settings, href: "/admin" },
    ],
  },
]

interface MainSidebarProps {
  className?: string
}

export default function MainSidebar({ className }: MainSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const pathname = usePathname()
  const { items } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  const toggleSubmenu = (title: string) => {
    if (isCollapsed) return
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname.startsWith(href)
  }

  return (
    <TooltipProvider>
      <aside
        className={`fixed left-0 top-0 z-30 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out hidden lg:flex flex-col ${
          isCollapsed ? "w-16" : "w-64"
        } ${className}`}
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
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Store className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Marketplace</h2>
                <p className="text-xs text-muted-foreground">Tu tienda online</p>
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

        {/* Cart Section */}
        <div className={`p-2 border-t border-gray-200 ${isCollapsed ? "px-1" : ""}`}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="w-full h-10 relative" asChild>
                  <Link href="/carrito">
                    <ShoppingCart className="h-4 w-4" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Carrito ({totalItems})</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Button variant="ghost" className="w-full justify-start h-10 relative" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-4 w-4" />
                <span className="ml-3 text-sm">Carrito</span>
                {totalItems > 0 && (
                  <Badge variant="secondary" className="ml-auto text-xs h-5">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className={`p-2 border-t border-gray-200 ${isCollapsed ? "px-1" : ""}`}>
          {isCollapsed ? (
            <div className="space-y-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Bell className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Notificaciones</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-full h-10">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Configuración</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Usuario</p>
                  <p className="text-[10px] text-muted-foreground truncate">usuario@email.com</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="flex-1 h-8">
                  <Bell className="h-3 w-3 mr-1" />
                  <span className="text-xs">Notif.</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 h-8">
                  <Settings className="h-3 w-3 mr-1" />
                  <span className="text-xs">Config.</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  )
}
