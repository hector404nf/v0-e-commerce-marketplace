"use client"

import { useState } from "react"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Star,
  AlertTriangle,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Datos simulados para el dashboard
const dashboardStats = {
  ventas: {
    total: 45280.5,
    cambio: 12.5,
    tendencia: "up" as const,
  },
  pedidos: {
    total: 156,
    cambio: -3.2,
    tendencia: "down" as const,
  },
  productos: {
    total: 45,
    cambio: 8.1,
    tendencia: "up" as const,
  },
  clientes: {
    total: 1247,
    cambio: 15.3,
    tendencia: "up" as const,
  },
}

const pedidosRecientes = [
  {
    id: "ORD-001",
    cliente: "María González",
    producto: "iPhone 15 Pro",
    monto: 1299.99,
    estado: "completado",
    fecha: "2024-01-15 14:30",
  },
  {
    id: "ORD-002",
    cliente: "Carlos Ruiz",
    producto: "MacBook Air M2",
    monto: 1899.99,
    estado: "procesando",
    fecha: "2024-01-15 13:45",
  },
  {
    id: "ORD-003",
    cliente: "Ana López",
    producto: "AirPods Pro",
    monto: 299.99,
    estado: "enviado",
    fecha: "2024-01-15 12:20",
  },
  {
    id: "ORD-004",
    cliente: "Pedro Martín",
    producto: "iPad Air",
    monto: 699.99,
    estado: "pendiente",
    fecha: "2024-01-15 11:15",
  },
]

const productosPopulares = [
  { nombre: "iPhone 15 Pro", ventas: 45, ingresos: 58495, stock: 12, cambio: 15 },
  { nombre: "MacBook Air M2", ventas: 23, ingresos: 43697, stock: 8, cambio: -5 },
  { nombre: "AirPods Pro", ventas: 67, ingresos: 20093, stock: 25, cambio: 22 },
  { nombre: "iPad Air", ventas: 34, ingresos: 23799, stock: 15, cambio: 8 },
]

const alertas = [
  { tipo: "stock", mensaje: "5 productos con stock bajo", urgencia: "media" },
  { tipo: "pedido", mensaje: "12 pedidos pendientes de procesar", urgencia: "alta" },
  { tipo: "review", mensaje: "3 reseñas nuevas requieren respuesta", urgencia: "baja" },
]

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completado":
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>
      case "procesando":
        return <Badge className="bg-yellow-100 text-yellow-800">Procesando</Badge>
      case "enviado":
        return <Badge className="bg-blue-100 text-blue-800">Enviado</Badge>
      case "pendiente":
        return <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case "stock":
        return <Package className="h-4 w-4" />
      case "pedido":
        return <ShoppingCart className="h-4 w-4" />
      case "review":
        return <Star className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getAlertColor = (urgencia: string) => {
    switch (urgencia) {
      case "alta":
        return "text-red-600 bg-red-50 border-red-200"
      case "media":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "baja":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Resumen de tu tienda y métricas principales</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Exportar reporte
          </Button>
          <Button size="sm">Ver análisis completo</Button>
        </div>
      </div>

      {/* Alertas importantes */}
      {alertas.length > 0 && (
        <div className="grid gap-3">
          {alertas.map((alerta, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border ${getAlertColor(alerta.urgencia)}`}
            >
              {getAlertIcon(alerta.tipo)}
              <span className="flex-1 text-sm font-medium">{alerta.mensaje}</span>
              <Button variant="ghost" size="sm">
                Ver detalles
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.ventas.total.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardStats.ventas.tendencia === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={dashboardStats.ventas.tendencia === "up" ? "text-green-600" : "text-red-600"}>
                {dashboardStats.ventas.cambio > 0 ? "+" : ""}
                {dashboardStats.ventas.cambio}%
              </span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.pedidos.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {dashboardStats.pedidos.tendencia === "up" ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={dashboardStats.pedidos.tendencia === "up" ? "text-green-600" : "text-red-600"}>
                {dashboardStats.pedidos.cambio > 0 ? "+" : ""}
                {dashboardStats.pedidos.cambio}%
              </span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.productos.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+{dashboardStats.productos.cambio}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.clientes.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-green-600">+{dashboardStats.clientes.cambio}%</span>
              <span className="ml-1">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contenido principal con tabs */}
      <Tabs defaultValue="pedidos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pedidos">Pedidos Recientes</TabsTrigger>
          <TabsTrigger value="productos">Productos Populares</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
        </TabsList>

        {/* Pedidos recientes */}
        <TabsContent value="pedidos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Pedidos Recientes</CardTitle>
              <Button variant="outline" size="sm">
                Ver todos los pedidos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pedidosRecientes.map((pedido) => (
                  <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium">{pedido.id}</span>
                        {getEstadoBadge(pedido.estado)}
                      </div>
                      <p className="text-sm text-muted-foreground">{pedido.cliente}</p>
                      <p className="text-sm">{pedido.producto}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${pedido.monto.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">{pedido.fecha}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Productos populares */}
        <TabsContent value="productos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Productos Más Vendidos</CardTitle>
              <Button variant="outline" size="sm">
                Gestionar productos
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productosPopulares.map((producto, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{producto.nombre}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">{producto.ventas} ventas</span>
                        <span className="text-sm text-muted-foreground">Stock: {producto.stock}</span>
                        <div className="flex items-center gap-1">
                          {producto.cambio > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={`text-xs ${producto.cambio > 0 ? "text-green-600" : "text-red-600"}`}>
                            {producto.cambio > 0 ? "+" : ""}
                            {producto.cambio}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${producto.ingresos.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Ingresos totales</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analíticas */}
        <TabsContent value="analytics">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento de Ventas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Meta mensual</span>
                  <span className="font-semibold">75%</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-sm text-muted-foreground">$33,960 de $45,280 objetivo</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas Clave</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tasa de conversión</span>
                  <span className="font-semibold">3.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Valor promedio del pedido</span>
                  <span className="font-semibold">$290.26</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tiempo promedio de entrega</span>
                  <span className="font-semibold">2.1 días</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Satisfacción del cliente</span>
                  <span className="font-semibold">4.8/5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
