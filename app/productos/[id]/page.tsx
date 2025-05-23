"use client"

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, Heart, Package, Clock, Truck, MapPin } from "lucide-react"
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

export default function ProductPage({ params }: { params: { id: string } }) {
  const { addItem } = useCart()
  const producto = productos.find((p) => p.id.toString() === params.id)

  if (!producto) {
    return notFound()
  }

  const tienda = tiendas.find((t) => t.id === producto.tiendaId)

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
    toast({
      title: "Producto añadido al carrito",
      description: `${producto.nombre} ha sido añadido a tu carrito.`,
    })
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

          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <Image src={producto.imagen || "/placeholder.svg"} alt={producto.nombre} fill className="object-cover" />
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Badge className="w-fit" variant="outline">
                  {producto.categoria}
                </Badge>
                <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${tipoInfo.bgColor}`}>
                  <IconComponent className={`h-4 w-4 ${tipoInfo.textColor}`} />
                  <span className={`text-sm font-medium ${tipoInfo.textColor}`}>{tipoInfo.label}</span>
                </div>
              </div>

              <h1 className="text-3xl font-bold">{producto.nombre}</h1>
              <p className="text-2xl font-semibold">${producto.precio.toFixed(2)}</p>
              <p className="text-muted-foreground">{producto.descripcion}</p>

              {/* Información específica del tipo de venta */}
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <IconComponent className={`h-5 w-5 ${tipoInfo.textColor} mt-0.5`} />
                    <div>
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
                      <div className="relative h-10 w-10 rounded-full bg-muted overflow-hidden">
                        <Image
                          src={tienda.logo || "/placeholder.svg"}
                          alt={tienda.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{tienda.nombre}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{tienda.ciudad}</span>
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

              <div className="flex gap-4 mt-6">
                <Button className="flex-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {producto.tipoVenta === "delivery" ? "Pedir ahora" : "Añadir al carrito"}
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="descripcion" className="mt-8">
                <TabsList>
                  <TabsTrigger value="descripcion">Descripción</TabsTrigger>
                  <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
                  <TabsTrigger value="entrega">Entrega</TabsTrigger>
                </TabsList>
                <TabsContent value="descripcion" className="pt-4">
                  <p>{producto.descripcionLarga}</p>
                </TabsContent>
                <TabsContent value="especificaciones" className="pt-4">
                  <ul className="list-disc pl-5 space-y-2">
                    {producto.especificaciones.map((spec, index) => (
                      <li key={index}>{spec}</li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="entrega" className="pt-4">
                  <div className="space-y-3">
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

          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {productos
                .filter((p) => p.categoria === producto.categoria && p.id !== producto.id)
                .slice(0, 4)
                .map((p) => {
                  const relatedTipoInfo = getTipoVentaInfo(p.tipoVenta)
                  const RelatedIconComponent = relatedTipoInfo.icon

                  return (
                    <Link
                      key={p.id}
                      href={`/productos/${p.id}`}
                      className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="aspect-square relative bg-muted">
                        <Image
                          src={p.imagen || "/placeholder.svg"}
                          alt={p.nombre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-1 mb-2">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${relatedTipoInfo.bgColor}`}>
                            <RelatedIconComponent className={`h-3 w-3 ${relatedTipoInfo.textColor}`} />
                            <span className={`text-xs font-medium ${relatedTipoInfo.textColor}`}>
                              {relatedTipoInfo.label}
                            </span>
                          </div>
                        </div>
                        <h3 className="font-medium truncate">{p.nombre}</h3>
                        <p className="text-muted-foreground text-sm truncate">{p.descripcion}</p>
                        <p className="font-semibold mt-2">${p.precio.toFixed(2)}</p>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
