"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingCart, Package, Clock, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { productos } from "@/lib/data"
import { useCart } from "@/lib/cart-store"
import { useBehaviorTracking } from "@/hooks/use-behavior-tracking"

export default function ProductList() {
  const searchParams = useSearchParams()
  const categoriaParam = searchParams.get("categoria")
  const busquedaParam = searchParams.get("busqueda")
  const tipoVentaParam = searchParams.get("tipoVenta")

  const [productosFiltrados, setProductosFiltrados] = useState(productos)
  const { addItem } = useCart()
  const { trackProductClick } = useBehaviorTracking()

  useEffect(() => {
    let resultado = [...productos]

    if (categoriaParam) {
      resultado = resultado.filter((p) => p.categoria.toLowerCase() === categoriaParam.toLowerCase())
    }

    if (busquedaParam) {
      const termino = busquedaParam.toLowerCase()
      resultado = resultado.filter(
        (p) => p.nombre.toLowerCase().includes(termino) || p.descripcion.toLowerCase().includes(termino),
      )
    }

    if (tipoVentaParam) {
      resultado = resultado.filter((p) => p.tipoVenta === tipoVentaParam)
    }

    setProductosFiltrados(resultado)
  }, [categoriaParam, busquedaParam, tipoVentaParam])

  const getTipoVentaInfo = (tipoVenta: string) => {
    switch (tipoVenta) {
      case "directa":
        return {
          icon: Package,
          label: "Compra directa",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        }
      case "pedido":
        return {
          icon: Clock,
          label: "Por pedido",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
        }
      case "delivery":
        return {
          icon: Truck,
          label: "Delivery/Retiro",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
        }
      default:
        return {
          icon: Package,
          label: "Disponible",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        }
    }
  }

  const handleProductClick = (productId: number) => {
    trackProductClick(productId, "product-list")
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {productosFiltrados.map((producto) => {
          const tipoInfo = getTipoVentaInfo(producto.tipoVenta)
          const IconComponent = tipoInfo.icon

          return (
            <div
              key={producto.id}
              className="group relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {producto.descuento > 0 && (
                <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">-{producto.descuento}%</Badge>
              )}

              <div className="absolute top-2 right-2 z-10 flex flex-col gap-2">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/80 hover:bg-white">
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <Link
                href={`/productos/${producto.id}`}
                className="block"
                onClick={() => handleProductClick(producto.id)}
              >
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={producto.imagen || "/placeholder.svg"}
                    alt={producto.nombre}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${tipoInfo.bgColor}`}>
                      <IconComponent className={`h-3 w-3 ${tipoInfo.textColor}`} />
                      <span className={`text-xs font-medium ${tipoInfo.textColor}`}>{tipoInfo.label}</span>
                    </div>
                  </div>

                  <h3 className="font-medium line-clamp-1">{producto.nombre}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{producto.descripcion}</p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between">
                      <div>
                        {producto.descuento > 0 ? (
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              ${(producto.precio * (1 - producto.descuento / 100)).toFixed(2)}
                            </p>
                            <p className="text-sm text-muted-foreground line-through">${producto.precio.toFixed(2)}</p>
                          </div>
                        ) : (
                          <p className="font-semibold">${producto.precio.toFixed(2)}</p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          addItem(producto.id)
                        }}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      {producto.tipoVenta === "directa" && producto.stock > 0 && (
                        <span>Stock: {producto.stock} unidades</span>
                      )}
                      {producto.tipoVenta === "pedido" && <span>Entrega: {producto.tiempoEntrega}</span>}
                      {producto.tipoVenta === "delivery" && <span>Entrega: {producto.tiempoEntrega}</span>}
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">No se encontraron productos</h3>
          <p className="text-muted-foreground mt-2">Intenta con otra búsqueda o categoría</p>
        </div>
      )}
    </div>
  )
}
