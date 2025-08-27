"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Package,
  Clock,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Star,
  MessageCircle,
  RotateCcw,
  Download,
} from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface OrderData {
  id: string
  customerInfo: {
    name: string
    email: string
    phone: string
  }
  paymentMethod: string
  deliveryMethod: string
  address?: {
    street: string
    number: string
    city: string
    postalCode: string
    notes: string
    coordinates?: [number, number]
  }
  total: number
  items: any[]
  status: string
  estimatedDelivery: string
  orderDate: string
  deliveryDate?: string
  store: {
    name: string
    id: string
    rating: number
    phone: string
  }
  tracking?: {
    confirmado: { date: string; time: string }
    preparando?: { date: string; time: string }
    en_camino?: { date: string; time: string }
    entregado?: { date: string; time: string }
  }
  rating?: number
  review?: string
}

export default function PedidoDetallesPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  useEffect(() => {
    // Simular carga de datos del pedido
    const mockOrder: OrderData = {
      id: params.id,
      customerInfo: {
        name: "Juan Pérez",
        email: "juan.perez@email.com",
        phone: "+1 234 567 8900",
      },
      paymentMethod: "card",
      deliveryMethod: "delivery",
      address: {
        street: "Av. Principal",
        number: "123",
        city: "Ciudad",
        postalCode: "12345",
        notes: "Apartamento 4B, timbre azul",
      },
      total: 45.99,
      items: [
        {
          id: 1,
          producto: {
            nombre: "Pizza Margherita",
            precio: 18.99,
            imagen: "/placeholder.svg?height=80&width=80&text=Pizza",
            descuento: 0,
          },
          cantidad: 1,
        },
        {
          id: 2,
          producto: {
            nombre: "Coca Cola 500ml",
            precio: 3.5,
            imagen: "/placeholder.svg?height=80&width=80&text=Coca",
            descuento: 10,
          },
          cantidad: 2,
        },
        {
          id: 3,
          producto: {
            nombre: "Papas Fritas",
            precio: 8.99,
            imagen: "/placeholder.svg?height=80&width=80&text=Papas",
            descuento: 0,
          },
          cantidad: 1,
        },
      ],
      status: "entregado",
      estimatedDelivery: "30-45 minutos",
      orderDate: "2024-01-15 14:30",
      deliveryDate: "2024-01-15 15:15",
      store: {
        name: "Pizzería Don Mario",
        id: "store-123",
        rating: 4.8,
        phone: "+1 234 567 8901",
      },
      tracking: {
        confirmado: { date: "2024-01-15", time: "14:32" },
        preparando: { date: "2024-01-15", time: "14:45" },
        en_camino: { date: "2024-01-15", time: "15:00" },
        entregado: { date: "2024-01-15", time: "15:15" },
      },
      rating: 5,
      review: "Excelente servicio, la pizza llegó caliente y el delivery fue muy rápido.",
    }

    setOrderData(mockOrder)
  }, [params.id])

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "confirmado":
        return {
          label: "Pedido confirmado",
          description: "Tu pedido ha sido confirmado y está siendo procesado",
          icon: CheckCircle,
          color: "text-blue-600",
          bgColor: "bg-blue-100",
        }
      case "preparando":
        return {
          label: "Preparando",
          description: "Estamos preparando tu pedido",
          icon: Package,
          color: "text-orange-600",
          bgColor: "bg-orange-100",
        }
      case "en_camino":
        return {
          label: "En camino",
          description: "Tu pedido está en camino",
          icon: Truck,
          color: "text-purple-600",
          bgColor: "bg-purple-100",
        }
      case "entregado":
        return {
          label: "Entregado",
          description: "Tu pedido ha sido entregado exitosamente",
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-100",
        }
      case "cancelado":
        return {
          label: "Cancelado",
          description: "El pedido ha sido cancelado",
          icon: Clock,
          color: "text-red-600",
          bgColor: "bg-red-100",
        }
      default:
        return {
          label: "Procesando",
          description: "Procesando tu pedido",
          icon: Clock,
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        }
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "card":
        return "Tarjeta de crédito/débito"
      case "paypal":
        return "PayPal"
      case "transfer":
        return "Transferencia bancaria"
      case "cash":
        return "Efectivo al recibir"
      default:
        return method
    }
  }

  const getDeliveryMethodLabel = (method: string) => {
    switch (method) {
      case "delivery":
        return "Delivery a domicilio"
      case "pickup":
        return "Retiro en local"
      case "shipping":
        return "Envío a domicilio"
      default:
        return method
    }
  }

  const handleReorderItems = () => {
    // Simular agregar items al carrito
    console.log("Reordenando items:", orderData?.items)
    // Aquí iría la lógica para agregar los items al carrito
    router.push("/carrito")
  }

  const handleSubmitReview = () => {
    if (rating === 0) return

    // Simular envío de reseña
    console.log("Enviando reseña:", { rating, review })
    setShowReviewDialog(false)

    // Actualizar el pedido con la nueva reseña
    if (orderData) {
      setOrderData({
        ...orderData,
        rating,
        review,
      })
    }
  }

  const handleDownloadReceipt = () => {
    // Simular descarga de comprobante
    console.log("Descargando comprobante del pedido:", params.id)
  }

  if (!orderData) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Cargando pedido...</h1>
            <p className="text-muted-foreground">Por favor espera un momento</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const statusInfo = getStatusInfo(orderData.status)
  const StatusIcon = statusInfo.icon
  const deliveryCost =
    orderData.deliveryMethod === "delivery" ? 3.99 : orderData.deliveryMethod === "shipping" ? 5.99 : 0
  const subtotal = orderData.items.reduce((sum, item) => {
    const precio =
      item.producto.descuento > 0 ? item.producto.precio * (1 - item.producto.descuento / 100) : item.producto.precio
    return sum + precio * item.cantidad
  }, 0)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" asChild>
              <Link href="/perfil">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al perfil
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Estado del pedido */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${statusInfo.bgColor}`}>
                        <StatusIcon className={`h-6 w-6 ${statusInfo.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{statusInfo.label}</CardTitle>
                        <p className="text-muted-foreground">{statusInfo.description}</p>
                      </div>
                    </div>
                    <Badge variant="outline">#{orderData.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pedido realizado: <span className="font-medium">{orderData.orderDate}</span>
                      </p>
                      {orderData.deliveryDate && (
                        <p className="text-sm text-muted-foreground">
                          Entregado: <span className="font-medium">{orderData.deliveryDate}</span>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
                        <Download className="h-4 w-4 mr-2" />
                        Comprobante
                      </Button>
                      {orderData.status === "entregado" && (
                        <Button variant="outline" size="sm" onClick={handleReorderItems}>
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Repetir pedido
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seguimiento del pedido */}
              {orderData.tracking && (
                <Card>
                  <CardHeader>
                    <CardTitle>Seguimiento del pedido</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { key: "confirmado", label: "Pedido confirmado", data: orderData.tracking.confirmado },
                        { key: "preparando", label: "Preparando pedido", data: orderData.tracking.preparando },
                        { key: "en_camino", label: "En camino", data: orderData.tracking.en_camino },
                        { key: "entregado", label: "Entregado", data: orderData.tracking.entregado },
                      ].map((step, index) => {
                        const isCompleted = step.data !== undefined
                        const isCurrent = orderData.status === step.key

                        return (
                          <div key={step.key} className="flex items-center gap-4">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                isCompleted ? "bg-primary border-primary" : "bg-background border-muted-foreground"
                              }`}
                            />
                            <div className="flex-1">
                              <p className={`font-medium ${isCurrent ? "text-primary" : ""}`}>{step.label}</p>
                              {step.data && (
                                <p className="text-sm text-muted-foreground">
                                  {step.data.date} a las {step.data.time}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Información de la tienda */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Información de la tienda</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{orderData.store.rating}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">{orderData.store.name}</h4>
                      <p className="text-sm text-muted-foreground">ID: {orderData.store.id}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-3 w-3" />
                      {orderData.store.phone}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/tiendas/${orderData.store.id}`}>Ver tienda</Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Productos del pedido */}
              <Card>
                <CardHeader>
                  <CardTitle>Productos ({orderData.items.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orderData.items.map((item, index) => {
                      const { producto } = item
                      if (!producto) return null

                      const precioOriginal = producto.precio
                      const precioFinal =
                        producto.descuento > 0 ? precioOriginal * (1 - producto.descuento / 100) : precioOriginal

                      return (
                        <div key={index} className="flex gap-4 p-4 border rounded-lg">
                          <div className="relative h-16 w-16 flex-shrink-0">
                            <Image
                              src={producto.imagen || "/placeholder.svg"}
                              alt={producto.nombre}
                              fill
                              className="object-cover rounded"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{producto.nombre}</h3>
                            <p className="text-sm text-muted-foreground">Cantidad: {item.cantidad}</p>
                            <div className="flex items-center gap-2">
                              {producto.descuento > 0 && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ${precioOriginal.toFixed(2)}
                                </span>
                              )}
                              <span className="font-semibold">${precioFinal.toFixed(2)} c/u</span>
                              {producto.descuento > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  -{producto.descuento}%
                                </Badge>
                              )}
                            </div>
                            <p className="font-semibold text-primary">
                              Total: ${(precioFinal * item.cantidad).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Dirección de entrega */}
              {orderData.address && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Dirección de entrega
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">
                        {orderData.address.street} {orderData.address.number}
                      </p>
                      <p className="text-muted-foreground">
                        {orderData.address.postalCode} {orderData.address.city}
                      </p>
                      {orderData.address.notes && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Notas:</strong> {orderData.address.notes}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Reseña del pedido */}
              {orderData.status === "entregado" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Tu reseña</span>
                      {!orderData.rating && (
                        <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Escribir reseña
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Califica tu experiencia</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Calificación</Label>
                                <div className="flex gap-1 mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button key={star} onClick={() => setRating(star)} className="p-1">
                                      <Star
                                        className={`h-6 w-6 ${
                                          star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="review">Comentario (opcional)</Label>
                                <Textarea
                                  id="review"
                                  placeholder="Cuéntanos sobre tu experiencia..."
                                  value={review}
                                  onChange={(e) => setReview(e.target.value)}
                                  className="mt-2"
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button variant="outline" onClick={() => setShowReviewDialog(false)}>
                                  Cancelar
                                </Button>
                                <Button onClick={handleSubmitReview} disabled={rating === 0}>
                                  Enviar reseña
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orderData.rating ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= orderData.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{orderData.rating}/5</span>
                        </div>
                        {orderData.review && <p className="text-muted-foreground">{orderData.review}</p>}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">
                        ¿Cómo fue tu experiencia? Ayuda a otros usuarios compartiendo tu opinión.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Información del pedido */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Información de contacto</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        {orderData.customerInfo.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        {orderData.customerInfo.email}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Método de pago</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <CreditCard className="h-3 w-3" />
                      {getPaymentMethodLabel(orderData.paymentMethod)}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-2">Método de entrega</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Truck className="h-3 w-3" />
                      {getDeliveryMethodLabel(orderData.deliveryMethod)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Resumen de pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {deliveryCost > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>{orderData.deliveryMethod === "delivery" ? "Delivery" : "Envío"}</span>
                      <span>${deliveryCost.toFixed(2)}</span>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${orderData.total.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button className="w-full" onClick={handleReorderItems}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Repetir pedido
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/">Seguir comprando</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
