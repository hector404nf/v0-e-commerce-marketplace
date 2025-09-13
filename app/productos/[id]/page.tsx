"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ArrowLeft, ShoppingCart, Heart, Package, Clock, Truck, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { productos } from "@/lib/data"
import { tiendas } from "@/lib/stores-data"
import { useCart } from "@/lib/cart-store"
import { toast } from "@/components/ui/use-toast"
import ReviewsSection from "@/components/reviews-section"
import { useBehaviorTracking } from "@/hooks/use-behavior-tracking"
import RecommendationsSection from "@/components/recommendations-section"

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const { trackProductView, trackAddToCart } = useBehaviorTracking()
  const [imagenActual, setImagenActual] = useState(0)
  const producto = productos.find((p) => p.id.toString() === params.id)

  // Rastrear vista del producto
  trackProductView(producto?.id || 0)

  if (!producto) {
    return notFound()
  }

  const tienda = tiendas.find((t) => t.id === producto.tiendaId)

  // Manejar compatibilidad con productos que tienen imagen única
  const imagenes = producto.imagenes || (producto.imagen ? [producto.imagen] : [])

  const getTipoVentaInfo = (tipoVenta: string) => {
    switch (tipoVenta) {
      case "directa":
        return {
          icon: Package,
          label: "Compra directa",
          description: "Producto disponible en stock para compra inmediata",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
        }
      case "pedido":
        return {
          icon: Clock,
          label: "Por pedido",
          description: "Producto fabricado bajo pedido",
          color: "bg-orange-500",
          textColor: "text-orange-700",
          bgColor: "bg-orange-50",
        }
      case "delivery":
        return {
          icon: Truck,
          label: "Delivery/Retiro",
          description: "Disponible para delivery o retiro en local",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-50",
        }
      default:
        return {
          icon: Package,
          label: "Disponible",
          description: "Producto disponible",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-50",
        }
    }
  }

  const tipoInfo = getTipoVentaInfo(producto.tipoVenta)
  const IconComponent = tipoInfo.icon

  const handleAddToCart = () => {
    addItem(producto.id)
    trackAddToCart(producto.id)
    toast({
      title: "Producto añadido al carrito",
      description: `${producto.nombre} ha sido añadido a tu carrito.`,
    })
  }

  const siguienteImagen = () => {
    setImagenActual((prev) => (prev + 1) % imagenes.length)
  }

  const anteriorImagen = () => {
    setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galería de imágenes */}
            <div className="space-y-4">
              {/* Imagen principal */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                {imagenes.length > 0 ? (
                  <>
                    <Image
                      src={imagenes[imagenActual] || "/placeholder.svg"}
                      alt={`${producto.nombre} - Imagen ${imagenActual + 1}`}
                      fill
                      className="object-cover"
                    />

                    {/* Controles de navegación para múltiples imágenes */}
                    {imagenes.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                          onClick={anteriorImagen}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90"
                          onClick={siguienteImagen}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>

                        {/* Indicador de imagen actual */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {imagenActual + 1} / {imagenes.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-muted-foreground">
                      <Package className="h-16 w-16 mx-auto mb-4" />
                      <p>Sin imagen disponible</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Miniaturas */}
              {imagenes.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                  {imagenes.map((imagen, index) => (
                    <button
                      key={index}
                      onClick={() => setImagenActual(index)}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                        index === imagenActual
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-muted hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={imagen || "/placeholder.svg"}
                        alt={`${producto.nombre} - Miniatura ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex flex-col gap-4 lg:gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Badge className="w-fit" variant="outline">
                  {producto.categoria}
                </Badge>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full w-fit ${tipoInfo.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${tipoInfo.textColor}`} />
                  <span className={`text-sm font-medium ${tipoInfo.textColor}`}>{tipoInfo.label}</span>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{producto.nombre}</h1>

              <div className="flex items-center gap-4">
                <p className="text-2xl md:text-3xl font-semibold">${producto.precio.toFixed(2)}</p>
                {producto.descuento > 0 && (
                  <Badge variant="destructive" className="text-sm">
                    -{producto.descuento}%
                  </Badge>
                )}
              </div>

              <p className="text-muted-foreground text-base md:text-lg">{producto.descripcion}</p>

              {/* Información específica del tipo de venta */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 ${tipoInfo.textColor} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1">
                      <h3 className="font-medium">{tipoInfo.label}</h3>
                      <p className="text-sm text-muted-foreground">{tipoInfo.description}</p>
                      <div className="mt-2 text-sm">
                        {producto.tipoVenta === "directa" && (
                          <div>
                            <p className="font-medium">Stock disponible: {producto.stock} unidades</p>
                            <p className="text-muted-foreground">Entrega: {producto.tiempoEntrega}</p>
                          </div>
                        )}
                        {producto.tipoVenta === "pedido" && (
                          <div>
                            <p className="font-medium">Tiempo de fabricación: {producto.tiempoEntrega}</p>
                            <p className="text-muted-foreground">Se fabrica especialmente para ti</p>
                          </div>
                        )}
                        {producto.tipoVenta === "delivery" && (
                          <div>
                            <p className="font-medium">Tiempo de entrega: {producto.tiempoEntrega}</p>
                            <p className="text-muted-foreground">También disponible para retiro en local</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Información de la tienda */}
              {tienda && (
                <Card>
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden flex-shrink-0">
                        <Image
                          src={tienda.logo || "/placeholder.svg"}
                          alt={tienda.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">{tienda.nombre}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{tienda.ciudad}</span>
                        </div>
                      </div>
                      <Link href={`/tiendas/${tienda.id}`}>
                        <Button variant="outline" size="sm">
                          Ver tienda
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {producto.tipoVenta === "delivery" ? "Pedir ahora" : "Añadir al carrito"}
                </Button>
                <Button variant="outline" size="icon" className="sm:w-auto bg-transparent">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="descripcion" className="mt-8">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
                  <TabsTrigger value="entrega">Entrega</TabsTrigger>
                </TabsList>
                <TabsContent value="descripcion" className="pt-4">
                  <p className="text-sm md:text-base leading-relaxed">{producto.descripcionLarga}</p>
                </TabsContent>
                <TabsContent value="especificaciones" className="pt-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                    {producto.especificaciones.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="entrega" className="pt-4">
                  <div className="space-y-3 text-sm md:text-base">
                    <div>
                      <h4 className="font-medium">Tiempo de entrega</h4>
                      <p className="text-sm text-muted-foreground">{producto.tiempoEntrega}</p>
                    </div>
                    {producto.tipoVenta === "delivery" && (
                      <div>
                        <h4 className="font-medium">Opciones disponibles</h4>
                        <ul className="text-sm text-muted-foreground list-disc pl-5">
                          <li>Delivery a domicilio</li>
                          <li>Retiro en local</li>
                        </ul>
                      </div>
                    )}
                    {producto.tipoVenta === "directa" && producto.stock > 0 && (
                      <div>
                        <h4 className="font-medium">Disponibilidad</h4>
                        <p className="text-sm text-muted-foreground">
                          {producto.stock} unidades disponibles para entrega inmediata
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Sección de reseñas */}
          <div className="mt-12">
            <ReviewsSection productId={producto.id} type="product" />
          </div>

          {/* Sección de recomendaciones */}
          <div className="mt-16">
            <RecommendationsSection
              currentProductId={producto.id}
              showRecentlyViewed={true}
              showRecommended={true}
              showStores={true}
              maxItems={8}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
