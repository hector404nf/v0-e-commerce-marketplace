"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  MoreHorizontal,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  UserCheck,
  UserX,
  Download,
} from "lucide-react"
import Link from "next/link"

interface Customer {
  id: string
  nombre: string
  email: string
  telefono: string
  direccion: string
  fechaRegistro: string
  ultimaCompra: string
  totalPedidos: number
  totalGastado: number
  estado: "activo" | "inactivo" | "bloqueado"
  avatar?: string
  notas?: string
}

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [activeTab, setActiveTab] = useState("todos")

  // Datos simulados de clientes
  const [customers] = useState<Customer[]>([
    {
      id: "1",
      nombre: "María García",
      email: "maria@email.com",
      telefono: "+1234567890",
      direccion: "Calle Principal 123, Ciudad",
      fechaRegistro: "2023-06-15",
      ultimaCompra: "2024-01-15",
      totalPedidos: 12,
      totalGastado: 2450.5,
      estado: "activo",
      avatar: "/placeholder.svg?height=40&width=40&text=MG",
    },
    {
      id: "2",
      nombre: "Carlos López",
      email: "carlos@email.com",
      telefono: "+1234567891",
      direccion: "Avenida Central 456, Ciudad",
      fechaRegistro: "2023-08-22",
      ultimaCompra: "2024-01-10",
      totalPedidos: 8,
      totalGastado: 1890.25,
      estado: "activo",
      avatar: "/placeholder.svg?height=40&width=40&text=CL",
    },
    {
      id: "3",
      nombre: "Ana Martínez",
      email: "ana@email.com",
      telefono: "+1234567892",
      direccion: "Plaza Mayor 789, Ciudad",
      fechaRegistro: "2023-03-10",
      ultimaCompra: "2023-12-20",
      totalPedidos: 25,
      totalGastado: 4250.75,
      estado: "activo",
      avatar: "/placeholder.svg?height=40&width=40&text=AM",
    },
    {
      id: "4",
      nombre: "Pedro Ruiz",
      email: "pedro@email.com",
      telefono: "+1234567893",
      direccion: "Barrio Norte 321, Ciudad",
      fechaRegistro: "2023-11-05",
      ultimaCompra: "2023-11-15",
      totalPedidos: 2,
      totalGastado: 150.0,
      estado: "inactivo",
      avatar: "/placeholder.svg?height=40&width=40&text=PR",
    },
    {
      id: "5",
      nombre: "Laura Sánchez",
      email: "laura@email.com",
      telefono: "+1234567894",
      direccion: "Zona Sur 654, Ciudad",
      fechaRegistro: "2023-09-18",
      ultimaCompra: "2024-01-12",
      totalPedidos: 15,
      totalGastado: 3200.4,
      estado: "activo",
      avatar: "/placeholder.svg?height=40&width=40&text=LS",
    },
  ])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "activo":
        return { label: "Activo", color: "bg-green-100 text-green-800", icon: UserCheck }
      case "inactivo":
        return { label: "Inactivo", color: "bg-yellow-100 text-yellow-800", icon: UserX }
      case "bloqueado":
        return { label: "Bloqueado", color: "bg-red-100 text-red-800", icon: UserX }
      default:
        return { label: status, color: "bg-gray-100 text-gray-800", icon: Users }
    }
  }

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.telefono.includes(searchTerm)

    const matchesStatus = statusFilter === "todos" || customer.estado === statusFilter
    const matchesTab = activeTab === "todos" || customer.estado === activeTab

    return matchesSearch && matchesStatus && matchesTab
  })

  const stats = {
    total: customers.length,
    activos: customers.filter((c) => c.estado === "activo").length,
    inactivos: customers.filter((c) => c.estado === "inactivo").length,
    bloqueados: customers.filter((c) => c.estado === "bloqueado").length,
    ingresosTotales: customers.reduce((sum, c) => sum + c.totalGastado, 0),
    promedioGasto: customers.length > 0 ? customers.reduce((sum, c) => sum + c.totalGastado, 0) / customers.length : 0,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const getCustomerSegment = (totalGastado: number) => {
    if (totalGastado >= 3000) return { label: "VIP", color: "bg-purple-100 text-purple-800" }
    if (totalGastado >= 1500) return { label: "Premium", color: "bg-blue-100 text-blue-800" }
    if (totalGastado >= 500) return { label: "Regular", color: "bg-green-100 text-green-800" }
    return { label: "Nuevo", color: "bg-gray-100 text-gray-800" }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Clientes</h1>
          <p className="text-muted-foreground">Administra tu base de clientes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <p className="text-2xl font-bold text-green-600">{stats.activos}</p>
              <p className="text-xs text-muted-foreground">Activos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.inactivos}</p>
              <p className="text-xs text-muted-foreground">Inactivos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.bloqueados}</p>
              <p className="text-xs text-muted-foreground">Bloqueados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">${stats.ingresosTotales.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Ingresos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">${stats.promedioGasto.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">Promedio</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="activo">Activos</TabsTrigger>
          <TabsTrigger value="inactivo">Inactivos</TabsTrigger>
          <TabsTrigger value="bloqueado">Bloqueados</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clientes ({filteredCustomers.length})</CardTitle>
              <CardDescription>Lista de clientes registrados</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredCustomers.map((customer) => {
                  const statusInfo = getStatusInfo(customer.estado)
                  const segment = getCustomerSegment(customer.totalGastado)
                  const StatusIcon = statusInfo.icon

                  return (
                    <div key={customer.id} className="border-b border-gray-200 p-6 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={customer.avatar || "/placeholder.svg"} alt={customer.nombre} />
                          <AvatarFallback>
                            {customer.nombre
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        {/* Customer Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{customer.nombre}</h3>
                            <Badge className={statusInfo.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusInfo.label}
                            </Badge>
                            <Badge className={segment.color}>{segment.label}</Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.email}
                              </p>
                              <p className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {customer.telefono}
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span className="text-muted-foreground text-xs truncate">{customer.direccion}</span>
                              </p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-muted-foreground">
                                  Registro: {formatDate(customer.fechaRegistro)}
                                </span>
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <ShoppingBag className="h-3 w-3" />
                                <span className="font-medium">{customer.totalPedidos} pedidos</span>
                              </p>
                              <p className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span className="text-muted-foreground">
                                  Última: {formatDate(customer.ultimaCompra)}
                                </span>
                              </p>
                            </div>

                            <div className="space-y-1">
                              <p className="flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                <span className="font-semibold text-green-600">
                                  ${customer.totalGastado.toFixed(2)}
                                </span>
                              </p>
                              <p className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                <span className="text-muted-foreground">
                                  ${(customer.totalGastado / customer.totalPedidos).toFixed(2)} promedio
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/clientes/${customer.id}`}>
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
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/clientes/${customer.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver perfil
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="h-4 w-4 mr-2" />
                                Enviar email
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <ShoppingBag className="h-4 w-4 mr-2" />
                                Ver pedidos
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {customer.estado === "activo" ? (
                                <DropdownMenuItem className="text-yellow-600">
                                  <UserX className="h-4 w-4 mr-2" />
                                  Desactivar
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-green-600">
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Activar
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <UserX className="h-4 w-4 mr-2" />
                                Bloquear
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {filteredCustomers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron clientes</h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda"
                    : "Los clientes aparecerán aquí cuando se registren"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
