"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  Package,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { productos } from "@/lib/data"

export default function AdminProductosPage() {
  const [busqueda, setBusqueda] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroStock, setFiltroStock] = useState("todos")
  const [productosSeleccionados, setProductosSeleccionados] = useState<number[]>([])
  const [imagenesActuales, setImagenesActuales] = useState<{ [key: number]: number }>({})

  // Filtrar productos de la tienda (simulamos que es tienda ID 1)
  const productostienda = productos.filter((p) => p.tiendaId === 1)

  const productosFiltrados = productostienda.filter((producto) => {
    const coincideBusqueda =
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase())

    const coincideCategoria = filtroCategoria === "todas" || producto.categoria === filtroCategoria

    const coincideStock =
      filtroStock === "todos" ||
      (filtroStock === "disponible" && producto.stock > 0) ||
      (filtroStock === "bajo" && producto.stock > 0 && producto.stock < 10) ||
      (filtroStock === "agotado" && producto.stock === 0)

    return coincideBusqueda && coincideCategoria && coincideStock
  })

  const categorias = [...new Set(productostienda.map((p) => p.categoria))]

  const getStockStatus = (stock: number, tipoVenta: string) => {
    if (tipoVenta === "delivery") return { status: "Disponible", color: "bg-blue-100 text-blue-800" }
    if (stock === 0) return { status: "Agotado", color: "bg-red-100 text-red-800" }
    if (stock < 10) return { status: "Stock bajo", color: "bg-yellow-100 text-yellow-800" }
    return { status: "Disponible", color: "bg-green-100 text-green-800" }
  }

  const getImagenPrincipal = (producto: any) => {
    const imagenes = producto.imagenes || (producto.imagen ? [producto.imagen] : [])
    const imagenActual = imagenesActuales[producto.id] || 0
    return imagenes[imagenActual] || "/placeholder.svg"
  }

  const getImagenes = (producto: any) => {
    return producto.imagenes || (producto.imagen ? [producto.imagen] : [])
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

  const toggleProductoSeleccionado = (id: number) => {
    setProductosSeleccionados((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  const seleccionarTodos = () => {
    if (productosSeleccionados.length === productosFiltrados.length) {
      setProductosSeleccionados([])
    } else {
      setProductosSeleccionados(productosFiltrados.map((p) => p.id))
    }
  }

  const estadisticas = {
    total: productostienda.length,
    disponibles: productostienda.filter((p) => p.stock > 0 || p.tipoVenta === "delivery").length,
    stockBajo: productostienda.filter((p) => p.stock > 0 && p.stock < 10 && p.tipoVenta !== "delivery").length,
    agotados: productostienda.filter((p) => p.stock === 0 && p.tipoVenta !== "delivery").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Productos</h1>
          <p className="text-muted-foreground">Administra tu inventario y catálogo de productos</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button asChild>
            <Link href="/admin/productos/nuevo">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Total</span>
            </div>
            <p className="text-2xl font-bold mt-1">{estadisticas.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Disponibles</span>
            </div>
            <p className="text-2xl font-bold mt-1">{estadisticas.disponibles}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium">Stock Bajo</span>
            </div>
            <p className="text-2xl font-bold mt-1">{estadisticas.stockBajo}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Agotados</span>
            </div>
            <p className="text-2xl font-bold mt-1">{estadisticas.agotados}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos por nombre, categoría o marca..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las categorías</SelectItem>
                {categorias.map((categoria) => (
                  <SelectItem key={categoria} value={categoria}>
                    {categoria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStock} onValueChange={setFiltroStock}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Estado del stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="bajo">Stock bajo</SelectItem>
                <SelectItem value="agotado">Agotado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Acciones masivas */}
      {productosSeleccionados.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{productosSeleccionados.length} producto(s) seleccionado(s)</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  Editar masivo
                </Button>
                <Button variant="outline" size="sm">
                  Cambiar estado
                </Button>
                <Button variant="destructive" size="sm">
                  Eliminar seleccionados
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de productos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Productos ({productosFiltrados.length})</CardTitle>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={productosSeleccionados.length === productosFiltrados.length && productosFiltrados.length > 0}
              onCheckedChange={seleccionarTodos}
            />
            <span className="text-sm text-muted-foreground">Seleccionar todos</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {productosFiltrados.map((producto) => {
              const imagenes = getImagenes(producto)
              const tieneMultiplesImagenes = imagenes.length > 1
              const stockInfo = getStockStatus(producto.stock, producto.tipoVenta)

              return (
                <div key={producto.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {/* Checkbox de selección */}
                    <Checkbox
                      checked={productosSeleccionados.includes(producto.id)}
                      onCheckedChange={() => toggleProductoSeleccionado(producto.id)}
                      className="mt-2"
                    />

                    {/* Imagen del producto */}
                    <div className="relative h-20 w-20 lg:h-24 lg:w-24 flex-shrink-0">
                      <Image
                        src={getImagenPrincipal(producto) || "/placeholder.svg"}
                        alt={producto.nombre}
                        fill
                        className="object-cover rounded-md"
                      />

                      {/* Controles para múltiples imágenes */}
                      {tieneMultiplesImagenes && (
                        <>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute -left-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white/80 hover:bg-white/90"
                            onClick={() => cambiarImagen(producto.id, "anterior", imagenes)}
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="secondary"
                            size="icon"
                            className="absolute -right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 bg-white/80 hover:bg-white/90"
                            onClick={() => cambiarImagen(producto.id, "siguiente", imagenes)}
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>

                          {/* Indicador de imagen */}
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-1 rounded">
                            {(imagenesActuales[producto.id] || 0) + 1}/{imagenes.length}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Información del producto */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg truncate">{producto.nombre}</h3>
                            <Badge className={stockInfo.color}>{stockInfo.status}</Badge>
                            {imagenes.length > 1 && (
                              <Badge variant="outline" className="text-xs">
                                {imagenes.length} fotos
                              </Badge>
                            )}
                            {producto.descuento > 0 && (
                              <Badge className="bg-green-100 text-green-800">-{producto.descuento}%</Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{producto.descripcion}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="font-medium">Precio:</span> ${producto.precio.toFixed(2)}
                            </div>
                            <div>
                              <span className="font-medium">Categoría:</span> {producto.categoria}
                            </div>
                            <div>
                              <span className="font-medium">Marca:</span> {producto.marca}
                            </div>
                            <div>
                              <span className="font-medium">Stock:</span>{" "}
                              {producto.tipoVenta === "delivery" ? "∞" : producto.stock}
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/productos/${producto.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>

                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Duplicar producto</DropdownMenuItem>
                              <DropdownMenuItem>Cambiar estado</DropdownMenuItem>
                              <DropdownMenuItem>Ver estadísticas</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {productosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                {busqueda || filtroCategoria !== "todas" || filtroStock !== "todos"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "Comienza añadiendo tu primer producto"}
              </p>
              <Button asChild>
                <Link href="/admin/productos/nuevo">
                  <Plus className="h-4 w-4 mr-2" />
                  Añadir producto
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
