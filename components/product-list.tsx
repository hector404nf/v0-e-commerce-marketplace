"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Heart, Star, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-store"
import { toast } from "@/components/ui/use-toast"
import { useBehaviorTracking } from "@/hooks/use-behavior-tracking"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  descuento: number
  categoria: string
  marca: string
  imagen?: string
  imagenes?: string[]
  tipoVenta: string
  stock: number
  tiempoEntrega: string
}

interface ProductListProps {
  productos: Producto[]
  showAddToCart?: boolean
  className?: string
}

export default function ProductList({ productos, showAddToCart = true, className = "" }: ProductListProps) {
  const { addItem } = useCart()
  const { trackAddToCart, trackProductView } = useBehaviorTracking()
  const [imagenesActuales, setImagenesActuales] = useState<{ [key: number]: number }>({})

  const handleAddToCart = (producto: Producto, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(producto.id)
    trackAddToCart(producto.id)
    toast({
      title: "Producto añadido",
      description: `${producto.nombre} ha sido añadido al carrito.`,
    })
  }

  const handleProductClick = (productId: number) => {
    trackProductView(productId)
  }

  const cambiarImagen = (productoId: number, direccion: "siguiente" | "anterior", imagenes: string[]) => {
    setImagenesActuales((prev) => {
      const actual = prev[productoId] || 0
      let nueva = actual

      if (direccion === "siguiente") {
        nueva = (actual + 1) % imagenes.length
      } else {
        nueva = (actual - 1 + imagenes.length) % imagenes.length
      }

      return { ...prev, [productoId]: nueva }
    })
  }

  const getImagenPrincipal = (producto: Producto) => {
    // Compatibilidad con productos que tienen imagen única o múltiples imágenes
    const imagenes = producto.imagenes || (producto.imagen ? [producto.imagen] : [])
    const imagenActual = imagenesActuales[producto.id] || 0
    return imagenes[imagenActual] || "/placeholder.svg"
  }

  const getImagenes = (producto: Producto) => {
    return producto.imagenes || (producto.imagen ? [producto.imagen] : [])
  }

  const precioConDescuento = (precio: number, descuento: number) => {
    return precio * (1 - descuento / 100)
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ${className}`}>
      {productos.map((producto) => {
        const imagenes = getImagenes(producto)
        const tieneMultiplesImagenes = imagenes.length > 1

        return (
          <Card key={producto.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <Link href={`/productos/${producto.id}`} onClick={() => handleProductClick(producto.id)}>
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={getImagenPrincipal(producto) || "/placeholder.svg"}
                  alt={producto.nombre}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Controles de navegación para múltiples imágenes */}
                {tieneMultiplesImagenes && (
                  <>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        cambiarImagen(producto.id, "anterior", imagenes)
                      }}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        cambiarImagen(producto.id, "siguiente", imagenes)
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Indicadores de imagen */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                      {imagenes.map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === (imagenesActuales[producto.id] || 0) ? "bg-white" : "bg-white/50"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {producto.descuento > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      -{producto.descuento}%
                    </Badge>
                  )}
                  {producto.tipoVenta === "delivery" && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 text-xs">Delivery</Badge>
                  )}
                  {producto.stock === 0 && producto.tipoVenta !== "delivery" && (
                    <Badge variant="secondary" className="text-xs">
                      Sin stock
                    </Badge>
                  )}
                </div>

                {/* Botón de favoritos */}
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white/90 h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toast({
                      title: "Añadido a favoritos",
                      description: `${producto.nombre} ha sido añadido a tus favoritos.`,
                    })
                  }}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </Link>

            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/productos/${producto.id}`}
                    onClick={() => handleProductClick(producto.id)}
                    className="flex-1"
                  >
                    <h3 className="font-semibold text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                      {producto.nombre}
                    </h3>
                  </Link>
                </div>

                <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">{producto.descripcion}</p>

                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">(4.0)</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    {producto.descuento > 0 ? (
                      <>
                        <span className="text-lg font-bold text-primary">
                          ${precioConDescuento(producto.precio, producto.descuento).toFixed(2)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          ${producto.precio.toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold">${producto.precio.toFixed(2)}</span>
                    )}
                  </div>

                  {showAddToCart && (
                    <Button
                      size="sm"
                      onClick={(e) => handleAddToCart(producto, e)}
                      disabled={producto.stock === 0 && producto.tipoVenta !== "delivery"}
                      className="h-8 px-3"
                    >
                      <ShoppingCart className="h-3 w-3 mr-1" />
                      <span className="hidden sm:inline">{producto.tipoVenta === "delivery" ? "Pedir" : "Añadir"}</span>
                    </Button>
                  )}
                </div>

                {/* Información adicional */}
                <div className="text-xs text-muted-foreground">
                  {producto.tipoVenta === "directa" && producto.stock > 0 && (
                    <span>Stock: {producto.stock} unidades</span>
                  )}
                  {producto.tipoVenta === "delivery" && <span>Entrega: {producto.tiempoEntrega}</span>}
                  {producto.tipoVenta === "pedido" && <span>Por pedido: {producto.tiempoEntrega}</span>}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
