"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Package,
  CreditCard,
  MapPin,
  Heart,
  Settings,
  HelpCircle,
  Bell,
  Shield,
  Globe,
  Download,
  Trash2,
  Plus,
  Edit,
  Star,
  Clock,
  Truck,
  CheckCircle,
  Search,
  Filter,
  Eye,
  RotateCcw,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PerfilPage() {
  const [activeSection, setActiveSection] = useState("pedidos")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Mock data
  const userInfo = {
    name: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+1 234 567 8900",
    avatar: "/placeholder.svg?height=100&width=100&text=JP",
    memberSince: "Enero 2023",
    totalOrders: 47,
    totalSpent: 1250.5,
  }

  const orders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      time: "14:30",
      store: "Pizzería Don Mario",
      items: 3,
      total: 45.99,
      status: "entregado",
      estimatedDelivery: "30-45 min",
    },
    {
      id: "ORD-002",
      date: "2024-01-12",
      time: "19:15",
      store: "Burger Palace",
      items: 2,
      total: 28.5,
      status: "entregado",
      estimatedDelivery: "25-35 min",
    },
    {
      id: "ORD-003",
      date: "2024-01-10",
      time: "12:00",
      store: "Sushi Express",
      items: 4,
      total: 67.8,
      status: "en_camino",
      estimatedDelivery: "40-50 min",
    },
    {
      id: "ORD-004",
      date: "2024-01-08",
      time: "20:30",
      store: "Tacos El Rey",
      items: 5,
      total: 32.25,
      status: "preparando",
      estimatedDelivery: "20-30 min",
    },
    {
      id: "ORD-005",
      date: "2024-01-05",
      time: "13:45",
      store: "Café Central",
      items: 2,
      total: 15.75,
      status: "cancelado",
      estimatedDelivery: "15-25 min",
    },
  ]

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      last4: "4532",
      brand: "Visa",
      expiryMonth: "12",
      expiryYear: "2026",
      isDefault: true,
    },
    {
      id: 2,
      type: "card",
      last4: "8901",
      brand: "Mastercard",
      expiryMonth: "08",
      expiryYear: "2025",
      isDefault: false,
    },
  ]

  const addresses = [
    {
      id: 1,
      name: "Casa",
      street: "Av. Principal 123",
      city: "Ciudad",
      postalCode: "12345",
      phone: "+1 234 567 8900",
      notes: "Apartamento 4B",
      isDefault: true,
    },
    {
      id: 2,
      name: "Oficina",
      street: "Calle Comercial 456",
      city: "Ciudad",
      postalCode: "12346",
      phone: "+1 234 567 8901",
      notes: "Piso 3, oficina 301",
      isDefault: false,
    },
  ]

  const favoriteProducts = [
    {
      id: 1,
      name: "Pizza Margherita",
      store: "Pizzería Don Mario",
      price: 18.99,
      image: "/placeholder.svg?height=60&width=60&text=Pizza",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Hamburguesa Clásica",
      store: "Burger Palace",
      price: 15.5,
      image: "/placeholder.svg?height=60&width=60&text=Burger",
      rating: 4.6,
    },
  ]

  const favoriteStores = [
    {
      id: 1,
      name: "Pizzería Don Mario",
      category: "Italiana",
      rating: 4.8,
      deliveryTime: "30-45 min",
      image: "/placeholder.svg?height=60&width=60&text=Pizza",
    },
    {
      id: 2,
      name: "Sushi Express",
      category: "Japonesa",
      rating: 4.7,
      deliveryTime: "40-50 min",
      image: "/placeholder.svg?height=60&width=60&text=Sushi",
    },
  ]

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "entregado":
        return { label: "Entregado", color: "bg-green-100 text-green-800", icon: CheckCircle }
      case "en_camino":
        return { label: "En camino", color: "bg-blue-100 text-blue-800", icon: Truck }
      case "preparando":
        return { label: "Preparando", color: "bg-orange-100 text-orange-800", icon: Clock }
      case "cancelado":
        return { label: "Cancelado", color: "bg-red-100 text-red-800", icon: Clock }
      default:
        return { label: "Confirmado", color: "bg-gray-100 text-gray-800", icon: CheckCircle }
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "todos" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const sidebarItems = [
    { id: "pedidos", label: "Mis pedidos", icon: Package },
    { id: "pagos", label: "Métodos de pago", icon: CreditCard },
    { id: "direcciones", label: "Direcciones", icon: MapPin },
    { id: "favoritos", label: "Favoritos", icon: Heart },
    { id: "configuracion", label: "Configuración", icon: Settings },
    { id: "ayuda", label: "Ayuda", icon: HelpCircle },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative h-20 w-20 mx-auto mb-4">
                    <Image
                      src={userInfo.avatar || "/placeholder.svg"}
                      alt={userInfo.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <CardTitle className="text-lg">{userInfo.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{userInfo.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    Cliente Premium
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Miembro desde:</span>
                      <span className="font-medium">{userInfo.memberSince}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total pedidos:</span>
                      <span className="font-medium">{userInfo.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total gastado:</span>
                      <span className="font-medium">${userInfo.totalSpent}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted transition-colors ${
                            activeSection === item.id ? "bg-muted border-r-2 border-primary" : ""
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeSection === "pedidos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Mis pedidos</h1>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar pedidos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos</SelectItem>
                          <SelectItem value="entregado">Entregado</SelectItem>
                          <SelectItem value="en_camino">En camino</SelectItem>
                          <SelectItem value="preparando">Preparando</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {filteredOrders.map((order) => {
                      const statusInfo = getStatusInfo(order.status)
                      const StatusIcon = statusInfo.icon

                      return (
                        <Card key={order.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">{order.store}</h3>
                                    <Badge className={statusInfo.color}>
                                      <StatusIcon className="h-3 w-3 mr-1" />
                                      {statusInfo.label}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Pedido #{order.id} • {order.date} a las {order.time}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {order.items} productos • ${order.total}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/perfil/pedidos/${order.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver detalles
                                  </Link>
                                </Button>
                                {order.status === "entregado" && (
                                  <Button variant="outline" size="sm">
                                    <RotateCcw className="h-4 w-4 mr-2" />
                                    Repetir
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {filteredOrders.length === 0 && (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron pedidos</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || statusFilter !== "todos"
                            ? "Intenta ajustar tus filtros de búsqueda"
                            : "Aún no has realizado ningún pedido"}
                        </p>
                        <Button asChild>
                          <Link href="/">Explorar tiendas</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {activeSection === "pagos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Métodos de pago</h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir método
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Añadir método de pago</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="cardNumber">Número de tarjeta</Label>
                              <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                            </div>
                            <div>
                              <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                              <Input id="cardName" placeholder="Juan Pérez" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Fecha de vencimiento</Label>
                              <Input id="expiry" placeholder="MM/AA" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="default" />
                            <Label htmlFor="default">Establecer como método principal</Label>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Guardar</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <Card key={method.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                                <CreditCard className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">
                                    {method.brand} •••• {method.last4}
                                  </h3>
                                  {method.isDefault && <Badge variant="secondary">Principal</Badge>}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  Vence {method.expiryMonth}/{method.expiryYear}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de transacciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            date: "2024-01-15",
                            description: "Pizzería Don Mario",
                            amount: -45.99,
                            status: "Completado",
                          },
                          { date: "2024-01-12", description: "Burger Palace", amount: -28.5, status: "Completado" },
                          {
                            date: "2024-01-10",
                            description: "Reembolso - Pedido cancelado",
                            amount: 32.25,
                            status: "Completado",
                          },
                        ].map((transaction, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div>
                              <p className="font-medium">{transaction.description}</p>
                              <p className="text-sm text-muted-foreground">{transaction.date}</p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                              </p>
                              <p className="text-sm text-muted-foreground">{transaction.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeSection === "direcciones" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Direcciones</h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Añadir dirección
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Añadir nueva dirección</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="addressName">Nombre de la dirección</Label>
                            <Input id="addressName" placeholder="Casa, Oficina, etc." />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="street">Calle</Label>
                              <Input id="street" placeholder="Av. Principal" />
                            </div>
                            <div>
                              <Label htmlFor="number">Número</Label>
                              <Input id="number" placeholder="123" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="city">Ciudad</Label>
                              <Input id="city" placeholder="Ciudad" />
                            </div>
                            <div>
                              <Label htmlFor="postalCode">Código postal</Label>
                              <Input id="postalCode" placeholder="12345" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="phone">Teléfono de contacto</Label>
                            <Input id="phone" placeholder="+1 234 567 8900" />
                          </div>
                          <div>
                            <Label htmlFor="notes">Instrucciones adicionales</Label>
                            <Textarea id="notes" placeholder="Apartamento, piso, referencias..." />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="defaultAddress" />
                            <Label htmlFor="defaultAddress">Establecer como dirección principal</Label>
                          </div>
                          <div className="flex gap-2 justify-end">
                            <Button variant="outline">Cancelar</Button>
                            <Button>Guardar</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                              <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center">
                                <MapPin className="h-6 w-6" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{address.name}</h3>
                                  {address.isDefault && <Badge variant="secondary">Principal</Badge>}
                                </div>
                                <p className="text-muted-foreground">
                                  {address.street}, {address.city} {address.postalCode}
                                </p>
                                <p className="text-sm text-muted-foreground">Tel: {address.phone}</p>
                                {address.notes && <p className="text-sm text-muted-foreground">{address.notes}</p>}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === "favoritos" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Favoritos</h1>

                  <Tabs defaultValue="productos" className="w-full">
                    <TabsList>
                      <TabsTrigger value="productos">Productos</TabsTrigger>
                      <TabsTrigger value="tiendas">Tiendas</TabsTrigger>
                    </TabsList>

                    <TabsContent value="productos" className="space-y-4">
                      {favoriteProducts.map((product) => (
                        <Card key={product.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{product.name}</h3>
                                  <p className="text-sm text-muted-foreground">{product.store}</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm">{product.rating}</span>
                                    </div>
                                    <span className="font-semibold">${product.price}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm">Añadir al carrito</Button>
                                <Button variant="outline" size="sm">
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>

                    <TabsContent value="tiendas" className="space-y-4">
                      {favoriteStores.map((store) => (
                        <Card key={store.id}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative h-16 w-16">
                                  <Image
                                    src={store.image || "/placeholder.svg"}
                                    alt={store.name}
                                    fill
                                    className="object-cover rounded"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{store.name}</h3>
                                  <p className="text-sm text-muted-foreground">{store.category}</p>
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                      <span>{store.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{store.deliveryTime}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" asChild>
                                  <Link href={`/tiendas/${store.id}`}>Ver tienda</Link>
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {activeSection === "configuracion" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Configuración</h1>

                  <Tabs defaultValue="notificaciones" className="w-full">
                    <TabsList>
                      <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
                      <TabsTrigger value="privacidad">Privacidad</TabsTrigger>
                      <TabsTrigger value="preferencias">Preferencias</TabsTrigger>
                    </TabsList>

                    <TabsContent value="notificaciones" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Notificaciones
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Notificaciones push</h4>
                              <p className="text-sm text-muted-foreground">Recibe notificaciones en tu dispositivo</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Notificaciones por email</h4>
                              <p className="text-sm text-muted-foreground">
                                Recibe actualizaciones por correo electrónico
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">SMS</h4>
                              <p className="text-sm text-muted-foreground">
                                Recibe mensajes de texto sobre tus pedidos
                              </p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Ofertas y promociones</h4>
                              <p className="text-sm text-muted-foreground">
                                Recibe notificaciones sobre ofertas especiales
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Recordatorios de pedidos</h4>
                              <p className="text-sm text-muted-foreground">
                                Te recordamos completar pedidos abandonados
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="privacidad" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Privacidad y seguridad
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Perfil público</h4>
                              <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil</p>
                            </div>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Compartir datos de uso</h4>
                              <p className="text-sm text-muted-foreground">
                                Ayúdanos a mejorar compartiendo datos anónimos
                              </p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Autenticación de dos factores</h4>
                              <p className="text-sm text-muted-foreground">
                                Añade una capa extra de seguridad a tu cuenta
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configurar
                            </Button>
                          </div>
                          <Separator />
                          <div className="space-y-4">
                            <h4 className="font-medium">Gestión de datos</h4>
                            <div className="flex gap-2">
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-2" />
                                Descargar mis datos
                              </Button>
                              <Button variant="outline">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar cuenta
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="preferencias" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Preferencias generales
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="language">Idioma</Label>
                              <Select defaultValue="es">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="es">Español</SelectItem>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="pt">Português</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="currency">Moneda</Label>
                              <Select defaultValue="usd">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="usd">USD ($)</SelectItem>
                                  <SelectItem value="eur">EUR (€)</SelectItem>
                                  <SelectItem value="mxn">MXN ($)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="timezone">Zona horaria</Label>
                            <Select defaultValue="america/mexico_city">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="america/mexico_city">América/Ciudad de México</SelectItem>
                                <SelectItem value="america/new_york">América/Nueva York</SelectItem>
                                <SelectItem value="europe/madrid">Europa/Madrid</SelectItem>
                                <SelectItem value="america/sao_paulo">América/São Paulo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="theme">Tema de la aplicación</Label>
                            <Select defaultValue="system">
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="light">Claro</SelectItem>
                                <SelectItem value="dark">Oscuro</SelectItem>
                                <SelectItem value="system">Sistema</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              {activeSection === "ayuda" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">Centro de ayuda</h1>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Preguntas frecuentes</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">¿Cómo puedo rastrear mi pedido?</h4>
                          <p className="text-sm text-muted-foreground">
                            Puedes rastrear tu pedido en tiempo real desde la sección "Mis pedidos" o haciendo clic en
                            "Ver detalles" en cualquier pedido activo.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">¿Puedo cancelar mi pedido?</h4>
                          <p className="text-sm text-muted-foreground">
                            Sí, puedes cancelar tu pedido antes de que sea confirmado por la tienda. Una vez confirmado,
                            contacta directamente con la tienda.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">¿Cómo funcionan los reembolsos?</h4>
                          <p className="text-sm text-muted-foreground">
                            Los reembolsos se procesan automáticamente al método de pago original en 3-5 días hábiles
                            después de la cancelación.
                          </p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">¿Hay costo de delivery?</h4>
                          <p className="text-sm text-muted-foreground">
                            El costo de delivery varía según la distancia y la tienda. Puedes ver el costo exacto antes
                            de confirmar tu pedido.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Contacto</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <MessageCircle className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Chat en vivo</h4>
                            <p className="text-sm text-muted-foreground">Disponible 24/7</p>
                          </div>
                          <Button size="sm" className="ml-auto">
                            Iniciar chat
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Mail className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Email</h4>
                            <p className="text-sm text-muted-foreground">soporte@marketplace.com</p>
                          </div>
                          <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                            Enviar email
                          </Button>
                        </div>
                        <div className="flex items-center gap-3 p-3 border rounded-lg">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <h4 className="font-medium">Teléfono</h4>
                            <p className="text-sm text-muted-foreground">+1 800 123 4567</p>
                          </div>
                          <Button size="sm" variant="outline" className="ml-auto bg-transparent">
                            Llamar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Guías paso a paso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Cómo hacer un pedido</h4>
                          <p className="text-sm text-muted-foreground">
                            Aprende a navegar por las tiendas, añadir productos al carrito y completar tu pedido.
                          </p>
                          <Button variant="outline" size="sm">
                            Ver guía
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Gestionar métodos de pago</h4>
                          <p className="text-sm text-muted-foreground">
                            Cómo añadir, editar y eliminar métodos de pago de forma segura.
                          </p>
                          <Button variant="outline" size="sm">
                            Ver guía
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Configurar direcciones</h4>
                          <p className="text-sm text-muted-foreground">
                            Aprende a gestionar tus direcciones de entrega para pedidos más rápidos.
                          </p>
                          <Button variant="outline" size="sm">
                            Ver guía
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Programa de fidelización</h4>
                          <p className="text-sm text-muted-foreground">
                            Descubre cómo ganar puntos y obtener recompensas con tus pedidos.
                          </p>
                          <Button variant="outline" size="sm">
                            Ver guía
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
