"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  AlertTriangle,
  Eye,
  Star,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Ventas del Mes",
      value: "$12,450",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Pedidos Totales",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Productos Activos",
      value: "45",
      change: "+3",
      trend: "up",
      icon: Package,
    },
    {
      title: "Clientes",
      value: "1,234",
      change: "+15.3%",
      trend: "up",
      icon: Users,
    },
  ]

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "María García",
      product: "iPhone 14 Pro",
      amount: "$999",
      status: "pendiente",
      time: "Hace 5 min",
    },
    {
      id: "ORD-002",
      customer: "Carlos López",
      product: "MacBook Air M2",
      amount: "$1,299",
      status: "procesando",
      time: "Hace 15 min",
    },
    {
      id: "ORD-003",
      customer: "Ana Martínez",
      product: "AirPods Pro",
      amount: "$249",
      status: "enviado",
      time: "Hace 1 hora",
    },
    {
      id: "ORD-004",
      customer: "Luis Rodríguez",
      product: "iPad Pro",
      amount: "$799",
      status: "entregado",
      time: "Hace 2 horas",
    },
  ]

  const topProducts = [
    {
      name: "iPhone 14 Pro",
      sales: 45,
      revenue: "$44,955",
      trend: "up",
    },
    {
      name: "MacBook Air M2",
      sales: 23,
      revenue: "$29,877",
      trend: "up",
    },
    {
      name: "AirPods Pro",
      sales: 67,
      revenue: "$16,683",
      trend: "down",
    },
    {
      name: "iPad Pro",
      sales: 34,
      revenue: "$27,166",
      trend: "up",
    },
  ]

  const alerts = [
    {
      type: "warning",
      message: "5 productos con stock bajo",
      action: "Ver productos",
      href: "/admin/productos?filter=low-stock",
    },
    {
      type: "info",
      message: "12 pedidos pendientes de procesar",
      action: "Ver pedidos",
      href: "/admin/pedidos?status=pendiente",
    },
    {
      type: "success",
      message: "3 nuevas reseñas positivas",
      action: "Ver reseñas",
      href: "/admin/reviews",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800"
      case "procesando":
        return "bg-blue-100 text-blue-800"
      case "enviado":
        return "bg-purple-100 text-purple-800"
      case "entregado":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tu tienda y métricas importantes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1">desde el mes pasado</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Importantes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <span className="text-sm">{alert.message}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={alert.href}>{alert.action}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Pedidos Recientes</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/pedidos">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver todos
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Últimos pedidos recibidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.product}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>{order.status}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {order.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Productos Populares</span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/productos">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver todos
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Productos con mejor rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center text-xs font-medium">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} ventas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{product.revenue}</p>
                    <div className="flex items-center justify-end">
                      {product.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-500" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen de Analíticas</CardTitle>
          <CardDescription>Métricas clave de rendimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <p className="text-sm text-muted-foreground">Tasa de satisfacción</p>
              <div className="flex items-center justify-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm ml-1">4.7/5</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3.2%</div>
              <p className="text-sm text-muted-foreground">Tasa de conversión</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm ml-1 text-green-500">+0.8%</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">$85.40</div>
              <p className="text-sm text-muted-foreground">Valor promedio pedido</p>
              <div className="flex items-center justify-center mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm ml-1 text-green-500">+$12.30</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
