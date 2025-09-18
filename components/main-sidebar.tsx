"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  Store,
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  ChevronRight,
  Monitor,
  Shirt,
  HomeIcon,
  Dumbbell,
  UserCircle,
  MapPin,
  Heart,
  BarChart3,
  Settings,
  Upload,
  Shield,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-store"

interface SidebarProps {
  className?: string
}

export function MainSidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(["productos"])
  const pathname = usePathname()
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const menuItems = [
    {
      id: "inicio",
      title: "Inicio",
      icon: Home,
      href: "/",
      badge: null,
    },
    {
      id: "productos",
      title: "Productos",
      icon: Package,
      href: "/productos",
      badge: null,
      submenu: [
        { title: "Ver todos", href: "/productos", icon: Package },
        { title: "Electrónica", href: "/productos?categoria=electronica", icon: Monitor },
        { title: "Ropa", href: "/productos?categoria=ropa", icon: Shirt },
        { title: "Hogar", href: "/productos?categoria=hogar", icon: HomeIcon },
        { title: "Deportes", href: "/productos?categoria=deportes", icon: Dumbbell },
      ],
    },
    {
      id: "tiendas",
      title: "Tiendas",
      icon: Store,
      href: "/tiendas",
      badge: null,
    },
    {
      id: "buscar",
      title: "Búsqueda Inteligente",
      icon: Search,
      href: "/busqueda-inteligente",
      badge: null,
    },
    {
      id: "carrito",
      title: "Carrito",
      icon: ShoppingCart,
      href: "/carrito",
      badge: totalItems > 0 ? totalItems : null,
    },
    {
      id: "cuenta",
      title: "Mi Cuenta",
      icon: User,
      href: "/perfil",
      badge: null,
      submenu: [
        { title: "Mi Perfil", href: "/perfil", icon: UserCircle },
        { title: "Mis Pedidos", href: "/perfil/pedidos", icon: Package },
        { title: "Direcciones", href: "/perfil/direcciones", icon: MapPin },
        { title: "Lista de Deseos", href: "/perfil/wishlist", icon: Heart },
      ],
    },
    {
      id: "tienda",
      title: "Mi Tienda",
      icon: Store,
      href: "/dashboard-tienda",
      badge: null,
      submenu: [
        { title: "Dashboard", href: "/dashboard-tienda", icon: BarChart3 },
        { title: "Mis Productos", href: "/dashboard-tienda/productos", icon: Package },
        { title: "Pedidos", href: "/dashboard-tienda/pedidos", icon: ShoppingCart },
        { title: "Clientes", href: "/dashboard-tienda/clientes", icon: User },
        { title: "Subir Producto", href: "/subir-producto", icon: Upload },
        { title: "Admin Panel", href: "/admin", icon: Shield },
        { title: "Configuración", href: "/dashboard-tienda/configuracion", icon: Settings },
      ],
    },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Sidebar para desktop */}
      <div
        className={`hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 ${isCollapsed ? "lg:w-16" : "lg:w-64"} transition-all duration-300 ${className}`}
      >
        <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            {!isCollapsed && (
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Marketplace</span>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="ml-auto">
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <div key={item.id}>
                <div className="flex items-center">
                  <Link
                    href={item.href}
                    className={`flex items-center flex-1 px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"} flex-shrink-0`} />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </Link>
                  {!isCollapsed && item.submenu && (
                    <Button variant="ghost" size="icon" onClick={() => toggleSection(item.id)} className="ml-1 w-6 h-6">
                      {expandedSections.includes(item.id) ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </Button>
                  )}
                </div>

                {/* Submenu */}
                {!isCollapsed && item.submenu && expandedSections.includes(item.id) && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className={`flex items-center px-2 py-1.5 text-sm rounded-md transition-colors ${
                          isActive(subitem.href)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                        }`}
                      >
                        <subitem.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        {subitem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Usuario</p>
                  <p className="text-xs text-gray-500 truncate">usuario@email.com</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
