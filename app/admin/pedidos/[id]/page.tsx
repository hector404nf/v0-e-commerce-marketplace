"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  FileText,
  Edit,
  Printer,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"

interface OrderDetail {
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
    sku?: string
  }[]
  estado: "pendiente" | "confirmado" | "preparando" | "enviado" | "entregado" | "cancelado"
  tipoEntrega: "delivery" | "pickup"
  metodoPago: "efectivo" | "tarjeta" | "transferencia"
  subtotal: number
  envio: number
  descuento: number
  total: number
  fecha: string
  fechaEntrega?: string
  fechaEstimada?: string
  notas?: string
  notasInternas?: string
  historial: {
    fecha: string
    estado: string
    comentario?: string
  }[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [newStatus, setNewStatus] = useState("")
  const [statusComment, setStatusComment] = useState("")
  const [internalNotes, setInternalNotes] = useState("")
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)

  // Datos simulados del pedido
  useEffect(() => {
    // Simular carga de datos del pedido
    const mockOrder: OrderDetail = {
      id: orderId,
      numero: `ORD-${orderId.padStart(3, "0")}`,
      cliente: {
        nombre: "María García",
        email: "maria@email.com",
        telefono: "+1234567890",
        direccion: "Calle Principal 123, Colonia Centro, Ciudad, CP 12345",
      },
      productos: [
        {
          id: "1",
          nombre: "iPhone 14 Pro Max 256GB",
          cantidad: 1,
          precio: 999,
          imagen: "/placeholder.svg?height=80&width=80&text=iPhone",
          sku: "IPH14PM-256-BLK",
        },
        {
          id: "2",
          nombre: "Funda iPhone 14 Pro Max",
          cantidad: 1,
          precio: 29,
          imagen: "/placeholder.svg?height=80&width=80&text=Case",
          sku: "CASE-IPH14PM-BLK",
        },
      ],
      estado: "confirmado",
      tipoEntrega: "delivery",
      metodoPago: "tarjeta",
      subtotal: 1028,
      envio: 15,
      descuento: 0,
      total: 1043,
      fecha: "2024-01-15T10:30:00",
      fechaEstimada: "2024-01-17T14:00:00",
      notas: "Entregar en horario de oficina, preferiblemente por la tarde",
      notasInternas: "Cliente VIP - Prioridad alta",
      historial: [
        {
          fecha: "2024-01-15T10:30:00",
          estado: "pendiente",
          comentario: "Pedido recibido",
        },
        {
          fecha: "2024-01-15T11:15:00",
          estado: "confirmado",
          comentario: "Pago verificado y pedido confirmado",
        },
      ],
    }
    setOrder(mockOrder)
    setInternalNotes(mockOrder.notasInternas || "")
  }, [orderId])

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleStatusUpdate = () => {
    if (!newStatus || !order) return

    const newHistoryEntry = {
      fecha: new Date().toISOString(),
      estado: newStatus,
      comentario: statusComment || undefined,
    }

    setOrder((prev) =>
      prev
        ? {
            ...prev,
            estado: newStatus as any,
            historial: [...prev.historial, newHistoryEntry],
          }
        : null,
    )

    toast({
      title: "Estado actualizado",
      description: `El pedido ha sido marcado como ${getStatusInfo(newStatus).label}`,
    })

    setIsStatusDialogOpen(false)
    setNewStatus("")
    setStatusComment("")
  }

  const handleSaveNotes = () => {
    if (order) {
      setOrder((prev) => (prev ? { ...prev, notasInternas: internalNotes } : null))
      toast({
        title: "Notas guardadas",
        description: "Las notas internas han sido actualizadas",
      })
    }
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/pedidos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Pedido no encontrado</h1>
            <p className="text-muted-foreground">El pedido que buscas no existe</p>
          </div>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(order.estado)
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/pedidos">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{order.numero}</h1>
            <p className="text-muted-foreground">Detalles del pedido</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Cambiar Estado
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
                <DialogDescription>Cambia el estado del pedido {order.numero}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nuevo estado</Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmado">Confirmado</SelectItem>
                      <SelectItem value="preparando">Preparando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Comentario (opcional)</Label>
                  <Textarea
                    value={statusComment}
                    onChange={(e) => setStatusComment(e.target.value)}
                    placeholder="Añade un comentario sobre este cambio..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleStatusUpdate}>Actualizar Estado</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <StatusIcon className="h-5 w-5" />
                Estado del Pedido
                <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Fecha del pedido
                    </p>
                    <p className="text-muted-foreground">{formatDate(order.fecha)}</p>
                  </div>
                  {order.fechaEstimada && (
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Entrega estimada
                      </p>
                      <p className="text-muted-foreground">{formatDate(order.fechaEstimada)}</p>
                    </div>
                  )}
                  {order.fechaEntrega && (
                    <div>
                      <p className="font-medium flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        Fecha de entrega
                      </p>
                      <p className="text-muted-foreground">{formatDate(order.fechaEntrega)}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Productos ({order.productos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.productos.map((producto) => (
                  <div key={producto.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={producto.imagen || "/placeholder.svg"}
                        alt={producto.nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{producto.nombre}</h3>
                      {producto.sku && <p className="text-sm text-muted-foreground">SKU: {producto.sku}</p>}
                      <p className="text-sm text-muted-foreground">
                        Cantidad: {producto.cantidad} × ${producto.precio}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${(producto.cantidad * producto.precio).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Order Summary */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                {order.descuento > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Descuento:</span>
                    <span>-${order.descuento.toFixed(2)}</span>
                  </div>
                )}
                {order.envio > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Envío:</span>
                    <span>${order.envio.toFixed(2)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order History */}
          <Card>
            <CardHeader>
              <CardTitle>Historial del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.historial.map((entry, index) => {
                  const entryStatusInfo = getStatusInfo(entry.estado)
                  const EntryIcon = entryStatusInfo.icon

                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${entryStatusInfo.color}`}>
                        <EntryIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{entryStatusInfo.label}</span>
                          <span className="text-sm text-muted-foreground">{formatDate(entry.fecha)}</span>
                        </div>
                        {entry.comentario && <p className="text-sm text-muted-foreground mt-1">{entry.comentario}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {order.cliente.nombre}
                </p>
                <p className="text-sm text-muted-foreground">{order.cliente.email}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {order.cliente.telefono}
                </p>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Dirección de entrega
                </p>
                <p className="text-sm text-muted-foreground">{order.cliente.direccion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Payment */}
          <Card>
            <CardHeader>
              <CardTitle>Entrega y Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  Tipo de entrega
                </p>
                <Badge variant="outline">{order.tipoEntrega === "delivery" ? "Delivery" : "Pickup"}</Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="font-medium flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Método de pago
                </p>
                <Badge variant="outline">
                  {order.metodoPago === "efectivo"
                    ? "Efectivo"
                    : order.metodoPago === "tarjeta"
                      ? "Tarjeta"
                      : "Transferencia"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Customer Notes */}
          {order.notas && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Notas del Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.notas}</p>
              </CardContent>
            </Card>
          )}

          {/* Internal Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Notas Internas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Añade notas internas sobre este pedido..."
                rows={4}
              />
              <Button onClick={handleSaveNotes} size="sm" className="w-full">
                Guardar Notas
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
