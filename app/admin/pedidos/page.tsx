"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  RefreshCw,
  MapPin,
  Phone,
  Mail,
  Calendar,
} from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  numero: string
  cliente: {
    nombre: string
    email: string
    telefono: string
    direccion: string
  }
  productos: {
    id: string
    nombre: string
    cantidad: number
    precio: number
    imagen: string
  }[]
  estado: "pendiente" | "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado"
  tipoEntrega: "delivery" | "pickup"
  metodoPago: "efectivo" | "tarjeta" | "transferencia"
  subtotal: number
  envio: number
  total: number
  fecha: string
  fechaEntrega?: string
  notas?: string
}

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("todos")

  // Datos simulados de pedidos
  const [orders] = useState<Order[]>([
    {
      id: "1",
      numero: "ORD-001",
      cliente: {
        nombre: "María García",
        email: "maria@email.com",
        telefono: "+1234567890",
        direccion: "Calle Principal 123, Ciudad",
      },
      productos: [
        {
          id: "1",
          nombre: "iPhone 14 Pro",
          cantidad: 1,
          precio: 999,
          imagen: "/placeholder.svg?height=60&width=60&text=iPhone",
        },
      ],
      estado: "pendiente",
      tipoEntrega: "delivery",
      metodoPago: "tarjeta",
      subtotal: 999,
      envio: 10,
      total: 1009,
      fecha: "2024-01-15T10:30:00",
      notas: "Entregar en horario de oficina",
    },
    {
      id: "2",
      numero: "ORD-002",
      cliente: {
        nombre: "Carlos López",
        email: "carlos@email.com",
        telefono: "+1234567891",
        direccion: "Avenida Central 456, Ciudad",
      },
      productos: [
        {
          id: "2",
          nombre: "MacBook Air M2",
          cantidad: 1,
          precio: 1299,
          imagen: "/placeholder.svg?height=60&width=60&text=MacBook",
        },
        {
          id: "3",
          nombre: "AirPods Pro",
          cantidad: 1,
          precio: 249,
          imagen: "/placeholder.svg?height=60&width=60&text=AirPods",
        },
      ],
      estado: "confirmado",
      tipoEntrega: "pickup",
      metodoPago: "efectivo",
      subtotal: 1548,
      envio: 0,
      total: 1548,
      fecha: "2024-01-15T09:15:00",
    },
    {
      id: "3",
      numero: "ORD-003",
      cliente: {
        nombre: "Ana Martínez",
        email: "ana@email.com",
        telefono: "+1234567892",
        direccion: "Plaza Mayor 789, Ciudad",
      },
      productos: [
        {
          id: "4",
          nombre: "iPad Pro",
          cantidad: 1,
          precio: 799,
          imagen: "/placeholder.svg?height=60&width=60&text=iPad",
        },
      ],
      estado: "enviado",
      tipoEntrega: "delivery",
      metodoPago: "transferencia",
      subtotal: 799,
      envio: 15,
      total: 814,
      fecha: "2024-01-14T16:45:00",
      fechaEntrega: "2024-01-16T14:00:00",
    },
    {
      id: "4",
      numero: "ORD-004",
      cliente: {
        nombre: "Pedro Ruiz",
        email: "pedro@email.com",
        telefono: "+1234567893",
        direccion: "Barrio Norte 321, Ciudad",
      },
      productos: [
        {
          id: "5",
          nombre: "Apple Watch Series 9",
          cantidad: 2,
          precio: 399,
          imagen: "/placeholder.svg?height=60&width=60&text=Watch",
        },
      ],
      estado: "entregado",
      tipoEntrega: "delivery",
      metodoPago: "tarjeta",
      subtotal: 798,
      envio: 10,
      total: 808,
      fecha: "2024-01-13T11:20:00",
      fechaEntrega: "2024-01-14T15:30:00",
    },
  ])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pendiente":
        return { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock }
      case "confirmado":
        return { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle }
      case "preparando":
        return { label: "Preparando", color: "bg-orange-100 text-orange-800", icon: Package }
      case "enviado":
        return { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck }
      case "entregado":
        return { label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle }
      case "cancelado":
        return { label: "Cancelado", color: "bg-red-100 text-red-800", icon: AlertCircle }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800", icon: Clock }
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cliente.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "todos" || order.estado === statusFilter

    const matchesTab = activeTab === "todos" || order.estado === activeTab

    return matchesSearch && matchesStatus && matchesTab
  })

  const stats = {
    total: orders.length,
    pendientes: orders.filter((o) => o.estado === "pendiente").length,
    confirmados: orders.filter((o) => o.estado === "confirmado").length,
    enviados: orders.filter((o) => o.estado === "enviado").length,
    entregados: orders.filter((o) => o.estado === "entregado").length,
    cancelados: orders.filter((o) => o.estado === "cancelado").length,
    ingresos: orders.filter((o) => o.estado === "entregado").reduce((sum, o) => sum + o.total, 0),
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // Aquí iría la lógica para actualizar el estado del pedido
    console.log(`Actualizando pedido ${orderId} a estado ${newStatus}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
          <p className="text-muted-foreground">Administra todos los pedidos de tu tienda</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.pendientes}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.confirmados}</p>
              <p className="text-xs text-muted-foreground">Confirmados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.enviados}</p>
              <p className="text-xs text-muted-foreground">Enviados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.entregados}</p>
              <p className="text-xs text-muted-foreground">Entregados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.cancelados}</p>
              <p className="text-xs text-muted-foreground">Cancelados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${stats.ingresos}</p>
              <p className="text-xs text-muted-foreground">Ingresos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, cliente o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="preparando">Preparando</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Fecha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas las fechas</SelectItem>
                <SelectItem value="hoy">Hoy</SelectItem>
                <SelectItem value="ayer">Ayer</SelectItem>
                <SelectItem value="semana">Esta semana</SelectItem>
                <SelectItem value="mes">Este mes</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Más filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="confirmado">Confirmados</TabsTrigger>
          <TabsTrigger value="enviado">Enviados</TabsTrigger>
          <TabsTrigger value="entregado">Entregados</TabsTrigger>
          <TabsTrigger value="cancelado">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos ({filteredOrders.length})</CardTitle>
              <CardDescription>Lista de pedidos filtrados</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredOrders.map((order) => {
                  const statusInfo = getStatusInfo(order.estado)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={order.id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                        {/* Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{order.numero}</h3>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            <Badge variant="outline">{order.tipoEntrega === "delivery" ? "Delivery" : "Pickup"}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="font-medium flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {order.cliente.nombre}
                              </p>
                              <p className="text-muted-foreground">{order.cliente.email}</p>
                              <p className="text-muted-foreground flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {order.cliente.telefono}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                Dirección
                              </p>
                              <p className="text-muted-foreground text-xs">{order.cliente.direccion}</p>
                              <p className="text-muted-foreground">Pago: {order.metodoPago}</p>
                            </div>

                            <div className="space-y-1">
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Fechas
                              </p>
                              <p className="text-muted-foreground text-xs">Pedido: {formatDate(order.fecha)}</p>
                              {order.fechaEntrega && (
                                <p className="text-muted-foreground text-xs">
                                  Entrega: {formatDate(order.fechaEntrega)}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Products */}
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Productos:</p>
                            <div className="flex flex-wrap gap-2">
                              {order.productos.map((producto) => (
                                <Badge key={producto.id} variant="secondary" className="text-xs">
                                  {producto.cantidad}x {producto.nombre}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {order.notas && (
                            <div className="mt-2">
                              <p className="text-sm font-medium">Notas:</p>
                              <p className="text-sm text-muted-foreground">{order.notas}</p>
                            </div>
                          )}
                        </div>

                        {/* Order Total and Actions */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold">${order.total}</p>
                            <p className="text-sm text-muted-foreground">Subtotal: ${order.subtotal}</p>
                            {order.envio > 0 && <p className="text-sm text-muted-foreground">Envío: ${order.envio}</p>}
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/admin/pedidos/${order.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Cambiar estado</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {order.estado === "pendiente" && (
                                  <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "confirmado")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Confirmar
                                  </DropdownMenuItem>
                                )}
                                {order.estado === "confirmado" && (
                                  <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "preparando")}>
                                    <Package className="h-4 w-4 mr-2" />
                                    Preparar
                                  </DropdownMenuItem>
                                )}
                                {order.estado === "preparando" && (
                                  <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "enviado")}>
                                    <Truck className="h-4 w-4 mr-2" />
                                    Enviar
                                  </DropdownMenuItem>
                                )}
                                {order.estado === "enviado" && (
                                  <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "entregado")}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Marcar entregado
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <AlertCircle className="h-4 w-4 mr-2" />
                                  Cancelar pedido
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron pedidos</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "todos"
                    ? "Intenta ajustar los filtros de búsqueda"
                    : "Los pedidos aparecerán aquí cuando los clientes realicen compras"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
