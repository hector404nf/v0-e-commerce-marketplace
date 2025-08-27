"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import {
  User,
  Package,
  CreditCard,
  Settings,
  LogOut,
  MapPin,
  Bell,
  Shield,
  Eye,
  Trash2,
  Plus,
  Edit,
  Star,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Calendar,
  Download,
  Heart,
  Gift,
  HelpCircle,
} from "lucide-react"

export default function PerfilPage() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("perfil")
  const [orderFilter, setOrderFilter] = useState("todos")
  const [searchOrder, setSearchOrder] = useState("")

  useEffect(() => {
    // Cargar perfil del usuario
    const profile = localStorage.getItem("userProfile")
    if (profile) {
      const parsedProfile = JSON.parse(profile)
      setUserProfile(parsedProfile)

      // Si es una tienda, redirigir al dashboard de tienda
      if (parsedProfile.type === "store") {
        router.push("/dashboard-tienda")
        return
      }
    }
  }, [router])

  if (!userProfile) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Perfil no configurado</h1>
            <p className="text-muted-foreground mb-4">Configura tu perfil para comenzar</p>
            <Button asChild>
              <Link href="/onboarding">Configurar Perfil</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Si es tienda, no mostrar esta página (ya se redirigió)
  if (userProfile.type === "store") {
    return null
  }

  const pedidos = [
    {
      id: "ORD-12345",
      fecha: "2024-01-15",
      estado: "entregado",
      total: 125.99,
      tienda: "Supermercado Central",
      productos: ["Leche", "Pan", "Huevos", "Queso"],
      direccion: "Calle Principal 123",
      tiempoEntrega: "45 min",
    },
    {
      id: "ORD-12346",
      fecha: "2024-01-10",
      estado: "cancelado",
      total: 89.5,
      tienda: "Farmacia San Juan",
      productos: ["Ibuprofeno", "Vitaminas"],
      direccion: "Av. Libertad 456",
      tiempoEntrega: "30 min",
    },
    {
      id: "ORD-12347",
      fecha: "2024-01-08",
      estado: "entregado",
      total: 210.75,
      tienda: "Restaurante Italiano",
      productos: ["Pizza Margherita", "Lasaña", "Tiramisu"],
      direccion: "Calle Principal 123",
      tiempoEntrega: "60 min",
    },
    {
      id: "ORD-12348",
      fecha: "2024-01-05",
      estado: "en_camino",
      total: 45.25,
      tienda: "Cafetería Aroma",
      productos: ["Café Americano", "Croissant"],
      direccion: "Oficina - Av. Empresarial 789",
      tiempoEntrega: "25 min",
    },
  ]

  const metodosPago = [
    {
      id: "card-1",
      tipo: "visa",
      numero: "**** **** **** 4532",
      nombre: "Juan Pérez",
      expiracion: "12/26",
      principal: true,
    },
    {
      id: "card-2",
      tipo: "mastercard",
      numero: "**** **** **** 8901",
      nombre: "Juan Pérez",
      expiracion: "08/25",
      principal: false,
    },
  ]

  const direcciones = [
    {
      id: "addr-1",
      nombre: "Casa",
      direccion: "Calle Principal 123",
      ciudad: "Madrid",
      codigoPostal: "28001",
      telefono: "+34 600 123 456",
      principal: true,
      instrucciones: "Portero automático, piso 3B",
    },
    {
      id: "addr-2",
      nombre: "Oficina",
      direccion: "Av. Empresarial 789",
      ciudad: "Madrid",
      codigoPostal: "28020",
      telefono: "+34 600 123 456",
      principal: false,
      instrucciones: "Recepción en planta baja",
    },
  ]

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "entregado":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Entregado
          </Badge>
        )
      case "en_camino":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Truck className="w-3 h-3 mr-1" />
            En camino
          </Badge>
        )
      case "preparando":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Preparando
          </Badge>
        )
      case "cancelado":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelado
          </Badge>
        )
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const filteredOrders = pedidos.filter((pedido) => {
    const matchesFilter = orderFilter === "todos" || pedido.estado === orderFilter
    const matchesSearch =
      pedido.id.toLowerCase().includes(searchOrder.toLowerCase()) ||
      pedido.tienda.toLowerCase().includes(searchOrder.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-80 shrink-0">
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt="Foto de perfil" />
                      <AvatarFallback className="text-lg">
                        {userProfile.personalInfo.firstName?.[0]}
                        {userProfile.personalInfo.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-center mt-4">
                    {userProfile.personalInfo.firstName} {userProfile.personalInfo.lastName}
                  </CardTitle>
                  <CardDescription className="text-center">{userProfile.personalInfo.email}</CardDescription>
                  <div className="flex justify-center mt-2">
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Cliente Premium
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <nav className="grid gap-1">
                    <Button
                      variant={activeTab === "perfil" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("perfil")}
                    >
                      <User className="mr-3 h-4 w-4" />
                      Mi perfil
                    </Button>
                    <Button
                      variant={activeTab === "pedidos" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("pedidos")}
                    >
                      <Package className="mr-3 h-4 w-4" />
                      Mis pedidos
                    </Button>
                    <Button
                      variant={activeTab === "pagos" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("pagos")}
                    >
                      <CreditCard className="mr-3 h-4 w-4" />
                      Métodos de pago
                    </Button>
                    <Button
                      variant={activeTab === "direcciones" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("direcciones")}
                    >
                      <MapPin className="mr-3 h-4 w-4" />
                      Direcciones
                    </Button>
                    <Button
                      variant={activeTab === "favoritos" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("favoritos")}
                    >
                      <Heart className="mr-3 h-4 w-4" />
                      Favoritos
                    </Button>
                    <Button
                      variant={activeTab === "configuracion" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("configuracion")}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Configuración
                    </Button>
                    <Button
                      variant={activeTab === "ayuda" ? "secondary" : "ghost"}
                      className="justify-start"
                      onClick={() => setActiveTab("ayuda")}
                    >
                      <HelpCircle className="mr-3 h-4 w-4" />
                      Ayuda
                    </Button>

                    <Separator className="my-2" />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Cerrar sesión
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
                          <AlertDialogDescription>
                            ¿Estás seguro de que quieres cerrar sesión? Tendrás que volver a iniciar sesión para acceder
                            a tu cuenta.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction className="bg-red-500 hover:bg-red-600">Cerrar sesión</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mi Perfil */}
              {activeTab === "perfil" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información personal</CardTitle>
                    <CardDescription>Actualiza tu información personal y datos de contacto.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre</Label>
                        <Input id="nombre" defaultValue={userProfile.personalInfo.firstName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="apellido">Apellido</Label>
                        <Input id="apellido" defaultValue={userProfile.personalInfo.lastName} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input id="email" type="email" defaultValue={userProfile.personalInfo.email} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefono">Teléfono</Label>
                      <Input id="telefono" type="tel" defaultValue={userProfile.personalInfo.phone} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fechaNacimiento">Fecha de nacimiento</Label>
                      <Input id="fechaNacimiento" type="date" />
                    </div>

                    <div className="space-y-2">
                      <Label>Intereses</Label>
                      <div className="flex flex-wrap gap-2">
                        {userProfile.personalInfo.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-sm">
                            {interest}
                            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-2">
                              <XCircle className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3 mr-1" />
                          Añadir interés
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Estadísticas de cuenta</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">24</div>
                          <div className="text-sm text-muted-foreground">Pedidos realizados</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">€1,247</div>
                          <div className="text-sm text-muted-foreground">Total gastado</div>
                        </div>
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-primary">4.8</div>
                          <div className="text-sm text-muted-foreground">Valoración promedio</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Guardar cambios</Button>
                  </CardFooter>
                </Card>
              )}

              {/* Mis Pedidos */}
              {activeTab === "pedidos" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de pedidos</CardTitle>
                      <CardDescription>Revisa tus pedidos anteriores y su estado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {/* Filtros y búsqueda */}
                      <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="flex-1">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                              placeholder="Buscar por ID o tienda..."
                              value={searchOrder}
                              onChange={(e) => setSearchOrder(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <Select value={orderFilter} onValueChange={setOrderFilter}>
                          <SelectTrigger className="w-full sm:w-48">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filtrar por estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos los pedidos</SelectItem>
                            <SelectItem value="entregado">Entregados</SelectItem>
                            <SelectItem value="en_camino">En camino</SelectItem>
                            <SelectItem value="preparando">Preparando</SelectItem>
                            <SelectItem value="cancelado">Cancelados</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Exportar
                        </Button>
                      </div>

                      {/* Lista de pedidos */}
                      <div className="space-y-4">
                        {filteredOrders.map((pedido) => (
                          <Card key={pedido.id} className="border-l-4 border-l-primary/20">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="font-semibold text-lg">{pedido.id}</h3>
                                    {getEstadoBadge(pedido.estado)}
                                  </div>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(pedido.fecha).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <p className="font-medium text-primary">{pedido.tienda}</p>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {pedido.direccion}
                                  </p>
                                  <p className="text-sm text-muted-foreground flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    Tiempo de entrega: {pedido.tiempoEntrega}
                                  </p>
                                </div>

                                <div className="text-right space-y-2">
                                  <div className="text-2xl font-bold">€{pedido.total.toFixed(2)}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {pedido.productos.length} producto{pedido.productos.length !== 1 ? "s" : ""}
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button variant="outline" size="sm" asChild>
                                      <Link href={`/pedidos/${pedido.id}`}>
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver detalles
                                      </Link>
                                    </Button>
                                    {pedido.estado === "entregado" && (
                                      <Button variant="outline" size="sm">
                                        <Package className="h-4 w-4 mr-1" />
                                        Repetir pedido
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>

                              <Separator className="my-4" />

                              <div>
                                <p className="text-sm font-medium mb-2">Productos:</p>
                                <div className="flex flex-wrap gap-1">
                                  {pedido.productos.map((producto, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {producto}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      {filteredOrders.length === 0 && (
                        <div className="text-center py-12">
                          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium mb-2">No se encontraron pedidos</h3>
                          <p className="text-muted-foreground">
                            {searchOrder || orderFilter !== "todos"
                              ? "Intenta cambiar los filtros de búsqueda"
                              : "Aún no has realizado ningún pedido"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Métodos de Pago */}
              {activeTab === "pagos" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Métodos de pago</CardTitle>
                      <CardDescription>Gestiona tus tarjetas y métodos de pago guardados.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {metodosPago.map((metodo) => (
                          <Card
                            key={metodo.id}
                            className={`border-2 ${metodo.principal ? "border-primary" : "border-border"}`}
                          >
                            <CardContent className="p-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                                    <CreditCard className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium">{metodo.numero}</p>
                                      {metodo.principal && (
                                        <Badge variant="default" className="text-xs">
                                          Principal
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{metodo.nombre}</p>
                                    <p className="text-sm text-muted-foreground">Expira: {metodo.expiracion}</p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                  {!metodo.principal && (
                                    <Button variant="outline" size="sm">
                                      Hacer principal
                                    </Button>
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 hover:text-red-600 bg-transparent"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar método de pago?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. La tarjeta será eliminada permanentemente.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors">
                              <CardContent className="p-6">
                                <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                                  <Plus className="h-5 w-5" />
                                  <span>Añadir nuevo método de pago</span>
                                </div>
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Añadir tarjeta</DialogTitle>
                              <DialogDescription>
                                Añade una nueva tarjeta de crédito o débito a tu cuenta.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="cardNumber">Número de tarjeta</Label>
                                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="expiry">Fecha de expiración</Label>
                                  <Input id="expiry" placeholder="MM/AA" />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="cvv">CVV</Label>
                                  <Input id="cvv" placeholder="123" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="cardName">Nombre en la tarjeta</Label>
                                <Input id="cardName" placeholder="Juan Pérez" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="makePrimary" />
                                <Label htmlFor="makePrimary">Hacer método principal</Label>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancelar</Button>
                              <Button>Añadir tarjeta</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Historial de transacciones */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de transacciones</CardTitle>
                      <CardDescription>Últimas transacciones realizadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            id: "TXN-001",
                            fecha: "2024-01-15",
                            concepto: "Pedido ORD-12345",
                            importe: -125.99,
                            estado: "completado",
                          },
                          {
                            id: "TXN-002",
                            fecha: "2024-01-10",
                            concepto: "Reembolso ORD-12346",
                            importe: 89.5,
                            estado: "completado",
                          },
                          {
                            id: "TXN-003",
                            fecha: "2024-01-08",
                            concepto: "Pedido ORD-12347",
                            importe: -210.75,
                            estado: "completado",
                          },
                        ].map((transaccion) => (
                          <div key={transaccion.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium">{transaccion.concepto}</p>
                              <p className="text-sm text-muted-foreground">{transaccion.fecha}</p>
                            </div>
                            <div className="text-right">
                              <p
                                className={`font-medium ${transaccion.importe > 0 ? "text-green-600" : "text-red-600"}`}
                              >
                                {transaccion.importe > 0 ? "+" : ""}€{Math.abs(transaccion.importe).toFixed(2)}
                              </p>
                              <Badge variant="secondary" className="text-xs">
                                {transaccion.estado}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Direcciones */}
              {activeTab === "direcciones" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Direcciones guardadas</CardTitle>
                    <CardDescription>Gestiona tus direcciones de envío y facturación.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {direcciones.map((direccion) => (
                        <Card
                          key={direccion.id}
                          className={`border-2 ${direccion.principal ? "border-primary" : "border-border"}`}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-medium text-lg">{direccion.nombre}</h3>
                                  {direccion.principal && (
                                    <Badge variant="default" className="text-xs">
                                      Principal
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm">
                                  {userProfile.personalInfo.firstName} {userProfile.personalInfo.lastName}
                                </p>
                                <p className="text-sm text-muted-foreground">{direccion.direccion}</p>
                                <p className="text-sm text-muted-foreground">
                                  {direccion.codigoPostal} {direccion.ciudad}
                                </p>
                                <p className="text-sm text-muted-foreground">{direccion.telefono}</p>
                                {direccion.instrucciones && (
                                  <p className="text-sm text-muted-foreground italic">"{direccion.instrucciones}"</p>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                {!direccion.principal && (
                                  <Button variant="outline" size="sm">
                                    Hacer principal
                                  </Button>
                                )}
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-red-500 hover:text-red-600 bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>¿Eliminar dirección?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Esta acción no se puede deshacer. La dirección será eliminada permanentemente.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                        Eliminar
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 cursor-pointer transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-center justify-center space-x-2 text-muted-foreground">
                                <Plus className="h-5 w-5" />
                                <span>Añadir nueva dirección</span>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Añadir dirección</DialogTitle>
                            <DialogDescription>Añade una nueva dirección de envío a tu cuenta.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="addressName">Nombre de la dirección</Label>
                              <Input id="addressName" placeholder="Casa, Oficina, etc." />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="street">Dirección</Label>
                              <Input id="street" placeholder="Calle, número, piso..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city">Ciudad</Label>
                                <Input id="city" placeholder="Madrid" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="postalCode">Código postal</Label>
                                <Input id="postalCode" placeholder="28001" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="phone">Teléfono</Label>
                              <Input id="phone" placeholder="+34 600 123 456" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="instructions">Instrucciones de entrega (opcional)</Label>
                              <Input id="instructions" placeholder="Portero automático, piso 3B..." />
                            </div>
                            <div className="flex items-center space-x-2">
                              <Switch id="makePrimaryAddress" />
                              <Label htmlFor="makePrimaryAddress">Hacer dirección principal</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline">Cancelar</Button>
                            <Button>Añadir dirección</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Favoritos */}
              {activeTab === "favoritos" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Productos favoritos</CardTitle>
                      <CardDescription>Tus productos guardados para comprar más tarde.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          {
                            id: 1,
                            nombre: "Leche Entera",
                            precio: 1.25,
                            tienda: "Supermercado Central",
                            imagen: "/placeholder.svg",
                          },
                          {
                            id: 2,
                            nombre: "Pan Integral",
                            precio: 2.5,
                            tienda: "Panadería Artesanal",
                            imagen: "/placeholder.svg",
                          },
                          {
                            id: 3,
                            nombre: "Queso Manchego",
                            precio: 8.99,
                            tienda: "Delicatessen Gourmet",
                            imagen: "/placeholder.svg",
                          },
                        ].map((producto) => (
                          <Card key={producto.id}>
                            <CardContent className="p-4">
                              <div className="aspect-square bg-muted rounded-lg mb-3"></div>
                              <h3 className="font-medium mb-1">{producto.nombre}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{producto.tienda}</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold">€{producto.precio}</span>
                                <div className="flex gap-2">
                                  <Button size="sm">Añadir al carrito</Button>
                                  <Button variant="outline" size="sm">
                                    <Heart className="h-4 w-4 fill-current text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Tiendas favoritas</CardTitle>
                      <CardDescription>Tus tiendas preferidas para pedidos rápidos.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            id: 1,
                            nombre: "Supermercado Central",
                            categoria: "Supermercado",
                            rating: 4.8,
                            tiempoEntrega: "30-45 min",
                          },
                          {
                            id: 2,
                            nombre: "Restaurante Italiano",
                            categoria: "Restaurante",
                            rating: 4.9,
                            tiempoEntrega: "45-60 min",
                          },
                          {
                            id: 3,
                            nombre: "Farmacia San Juan",
                            categoria: "Farmacia",
                            rating: 4.7,
                            tiempoEntrega: "20-30 min",
                          },
                        ].map((tienda) => (
                          <Card key={tienda.id}>
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                                  <div>
                                    <h3 className="font-medium">{tienda.nombre}</h3>
                                    <p className="text-sm text-muted-foreground">{tienda.categoria}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <div className="flex items-center">
                                        <Star className="h-4 w-4 fill-current text-yellow-400" />
                                        <span className="text-sm ml-1">{tienda.rating}</span>
                                      </div>
                                      <span className="text-sm text-muted-foreground">•</span>
                                      <span className="text-sm text-muted-foreground">{tienda.tiempoEntrega}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" asChild>
                                    <Link href={`/tiendas/${tienda.id}`}>Ver tienda</Link>
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Heart className="h-4 w-4 fill-current text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Configuración */}
              {activeTab === "configuracion" && (
                <div className="space-y-6">
                  {/* Notificaciones */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notificaciones
                      </CardTitle>
                      <CardDescription>Configura cómo y cuándo quieres recibir notificaciones.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones push</p>
                            <p className="text-sm text-muted-foreground">Recibe notificaciones en tu dispositivo</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Notificaciones por email</p>
                            <p className="text-sm text-muted-foreground">
                              Recibe actualizaciones por correo electrónico
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS de pedidos</p>
                            <p className="text-sm text-muted-foreground">Recibe SMS sobre el estado de tus pedidos</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Ofertas y promociones</p>
                            <p className="text-sm text-muted-foreground">
                              Recibe notificaciones sobre ofertas especiales
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Recordatorios de carrito</p>
                            <p className="text-sm text-muted-foreground">
                              Te recordamos si tienes productos en el carrito
                            </p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Privacidad */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Privacidad y seguridad
                      </CardTitle>
                      <CardDescription>Controla tu privacidad y la seguridad de tu cuenta.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Perfil público</p>
                            <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil</p>
                          </div>
                          <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Compartir datos de actividad</p>
                            <p className="text-sm text-muted-foreground">Ayuda a mejorar las recomendaciones</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Autenticación de dos factores</p>
                            <p className="text-sm text-muted-foreground">Añade una capa extra de seguridad</p>
                          </div>
                          <Button variant="outline" size="sm">
                            Configurar
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="font-medium">Gestión de datos</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Button variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Descargar mis datos
                          </Button>
                          <Button variant="outline" className="text-red-500 hover:text-red-600 bg-transparent">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar cuenta
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Preferencias */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Preferencias
                      </CardTitle>
                      <CardDescription>Personaliza tu experiencia en la plataforma.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Idioma</Label>
                          <Select defaultValue="es">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="es">Español</SelectItem>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="fr">Français</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Moneda</Label>
                          <Select defaultValue="eur">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="eur">Euro (€)</SelectItem>
                              <SelectItem value="usd">Dólar ($)</SelectItem>
                              <SelectItem value="gbp">Libra (£)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Zona horaria</Label>
                          <Select defaultValue="madrid">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="madrid">Madrid (GMT+1)</SelectItem>
                              <SelectItem value="london">Londres (GMT+0)</SelectItem>
                              <SelectItem value="paris">París (GMT+1)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Modo oscuro</p>
                            <p className="text-sm text-muted-foreground">Cambia la apariencia de la interfaz</p>
                          </div>
                          <Switch />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Animaciones reducidas</p>
                            <p className="text-sm text-muted-foreground">
                              Reduce las animaciones para mejor rendimiento
                            </p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Ayuda */}
              {activeTab === "ayuda" && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Centro de ayuda
                      </CardTitle>
                      <CardDescription>Encuentra respuestas a tus preguntas más frecuentes.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-2">¿Cómo realizar un pedido?</h3>
                            <p className="text-sm text-muted-foreground">
                              Aprende a navegar por la plataforma y realizar tu primer pedido.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-2">Métodos de pago</h3>
                            <p className="text-sm text-muted-foreground">
                              Información sobre los métodos de pago aceptados.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-2">Tiempos de entrega</h3>
                            <p className="text-sm text-muted-foreground">
                              Conoce los tiempos estimados de entrega en tu zona.
                            </p>
                          </CardContent>
                        </Card>

                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-4">
                            <h3 className="font-medium mb-2">Política de devoluciones</h3>
                            <p className="text-sm text-muted-foreground">
                              Información sobre devoluciones y reembolsos.
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Contacto</CardTitle>
                      <CardDescription>¿No encuentras lo que buscas? Contáctanos directamente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <HelpCircle className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-medium mb-2">Chat en vivo</h3>
                          <p className="text-sm text-muted-foreground mb-3">Disponible 24/7</p>
                          <Button size="sm">Iniciar chat</Button>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-medium mb-2">Email</h3>
                          <p className="text-sm text-muted-foreground mb-3">soporte@marketplace.com</p>
                          <Button size="sm" variant="outline">
                            Enviar email
                          </Button>
                        </div>

                        <div className="text-center p-4 border rounded-lg">
                          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Gift className="h-6 w-6 text-primary" />
                          </div>
                          <h3 className="font-medium mb-2">Teléfono</h3>
                          <p className="text-sm text-muted-foreground mb-3">+34 900 123 456</p>
                          <Button size="sm" variant="outline">
                            Llamar
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
