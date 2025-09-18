"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ShoppingCart, User, Search, Bell, Heart, Settings, LogOut, Store, Package, MapPin } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const { items } = useCartStore()

  const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:ml-64">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo para móviles */}
          <Link href="/" className="flex items-center space-x-2 lg:hidden">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl">Marketplace</span>
          </Link>

          {/* Barra de búsqueda */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos, tiendas..."
                className="pl-10 pr-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center space-x-2">
            {/* Búsqueda móvil */}
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
              <Link href="/busqueda-inteligente">
                <Search className="h-5 w-5" />
              </Link>
            </Button>

            {/* Notificaciones */}
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Bell className="h-5 w-5" />
            </Button>

            {/* Lista de deseos */}
            <Button variant="ghost" size="icon" className="hidden lg:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Carrito - Solo desktop */}
            <Button variant="ghost" size="icon" className="relative hidden lg:flex" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Menú de usuario */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil/pedidos">
                    <Package className="mr-2 h-4 w-4" />
                    Mis Pedidos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil/direcciones">
                    <MapPin className="mr-2 h-4 w-4" />
                    Direcciones
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Tienda</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard-tienda">
                    <Store className="mr-2 h-4 w-4" />
                    Dashboard Tienda
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin">
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Panel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subir-producto">
                    <Package className="mr-2 h-4 w-4" />
                    Subir Producto
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
