"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Plus, Edit, Trash2, Eye, Package } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { productos } from "@/lib/data"

export default function ProductosTiendaPage() {
  const [busqueda, setBusqueda] = useState("")

  // Filtrar productos de la tienda (simulamos que es tienda ID 1)
  const productostienda = productos.filter((p) => p.tiendaId === 1)

  const productosFiltrados = productostienda.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  )

  const getTipoVentaBadge = (tipoVenta: string) => {
    switch (tipoVenta) {
      case "directa":
        return <Badge className="bg-green-100 text-green-800">Directa</Badge>
      case "pedido":
        return <Badge className="bg-orange-100 text-orange-800">Por Pedido</Badge>
      case "delivery":
        return <Badge className="bg-blue-100 text-blue-800">Delivery</Badge>
      default:
        return <Badge variant="secondary">{tipoVenta}</Badge>
    }
  }

  const getStockStatus = (stock: number, tipoVenta: string) => {
    if (tipoVenta === "delivery") return "Disponible"
    if (stock === 0) return "Sin stock"
    if (stock < 5) return "Stock bajo"
    return "En stock"
  }

  const getStockBadge = (stock: number, tipoVenta: string) => {
    const status = getStockStatus(stock, tipoVenta)
    switch (status) {
      case "Sin stock":
        return <Badge variant="destructive">Sin stock</Badge>
      case "Stock bajo":
        return <Badge className="bg-yellow-100 text-yellow-800">Stock bajo</Badge>
      case "En stock":
        return <Badge className="bg-green-100 text-green-800">En stock</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Disponible</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard-tienda">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Gestión de Productos</h1>
              <p className="text-muted-foreground">Administra el inventario de tu tienda</p>
            </div>
            <Button asChild>
              <Link href="/subir-producto">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Link>
            </Button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Total Productos</span>
                </div>
                <p className="text-2xl font-bold mt-1">{productostienda.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">En Stock</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {productostienda.filter((p) => p.stock > 0 || p.tipoVenta === "delivery").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Stock Bajo</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {productostienda.filter((p) => p.stock > 0 && p.stock < 5 && p.tipoVenta !== "delivery").length}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-red-600" />
                  <span className="text-sm font-medium">Sin Stock</span>
                </div>
                <p className="text-2xl font-bold mt-1">
                  {productostienda.filter((p) => p.stock === 0 && p.tipoVenta !== "delivery").length}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Búsqueda */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar productos por nombre o categoría..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista de productos */}
          <Card>
            <CardHeader>
              <CardTitle>Productos ({productosFiltrados.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosFiltrados.map((producto) => (
                  <div key={producto.id} className="border rounded-lg p-4">
                    <div className="flex gap-4">
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{producto.nombre}</h3>
                              {getTipoVentaBadge(producto.tipoVenta)}
                              {getStockBadge(producto.stock, producto.tipoVenta)}
                            </div>

                            <p className="text-sm text-muted-foreground mb-2">{producto.descripcion}</p>

                            <div className="grid md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <span className="font-medium">Precio:</span> ${producto.precio.toFixed(2)}
                                {producto.descuento > 0 && (
                                  <span className="text-green-600 ml-1">(-{producto.descuento}%)</span>
                                )}
                              </div>
                              <div>
                                <span className="font-medium">Categoría:</span> {producto.categoria}
                              </div>
                              <div>
                                <span className="font-medium">Stock:</span>{" "}
                                {producto.tipoVenta === "delivery" ? "Disponible" : producto.stock}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/productos/${producto.id}`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Ver
                              </Link>
                            </Button>

                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Editar
                            </Button>

                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-1" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {productosFiltrados.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No se encontraron productos</p>
                  <Button asChild className="mt-4">
                    <Link href="/subir-producto">
                      <Plus className="h-4 w-4 mr-2" />
                      Añadir tu primer producto
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
