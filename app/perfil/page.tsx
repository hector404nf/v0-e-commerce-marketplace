import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { User, Package, CreditCard, Settings, LogOut } from "lucide-react"

export default function PerfilPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-6 md:py-10">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 shrink-0">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg" alt="Foto de perfil" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-center mt-4">Juan Pérez</CardTitle>
                  <CardDescription className="text-center">juan.perez@ejemplo.com</CardDescription>
                </CardHeader>
                <CardContent>
                  <nav className="grid gap-2 mt-4">
                    <Button variant="ghost" className="justify-start">
                      <User className="mr-2 h-4 w-4" />
                      Mi perfil
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      Mis pedidos
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Métodos de pago
                    </Button>
                    <Button variant="ghost" className="justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Configuración
                    </Button>
                    <Button variant="ghost" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50">
                      <LogOut className="mr-2 h-4 w-4" />
                      Cerrar sesión
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </aside>

            <div className="flex-1">
              <Tabs defaultValue="perfil">
                <TabsList className="mb-6">
                  <TabsTrigger value="perfil">Perfil</TabsTrigger>
                  <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
                  <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
                </TabsList>

                <TabsContent value="perfil">
                  <Card>
                    <CardHeader>
                      <CardTitle>Información personal</CardTitle>
                      <CardDescription>Actualiza tu información personal y datos de contacto.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre</Label>
                          <Input id="nombre" defaultValue="Juan" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="apellido">Apellido</Label>
                          <Input id="apellido" defaultValue="Pérez" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input id="email" type="email" defaultValue="juan.perez@ejemplo.com" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefono">Teléfono</Label>
                        <Input id="telefono" type="tel" defaultValue="+34 612 345 678" />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Guardar cambios</Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="pedidos">
                  <Card>
                    <CardHeader>
                      <CardTitle>Historial de pedidos</CardTitle>
                      <CardDescription>Revisa tus pedidos anteriores y su estado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { id: "ORD-12345", fecha: "15/05/2023", estado: "Entregado", total: 125.99 },
                          { id: "ORD-12346", fecha: "02/04/2023", estado: "Entregado", total: 89.5 },
                          { id: "ORD-12347", fecha: "18/03/2023", estado: "Entregado", total: 210.75 },
                        ].map((pedido) => (
                          <div key={pedido.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <h3 className="font-medium">{pedido.id}</h3>
                                <p className="text-sm text-muted-foreground">{pedido.fecha}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-block px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  {pedido.estado}
                                </span>
                                <p className="font-medium mt-1">${pedido.total.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="mt-4">
                              <Button variant="outline" size="sm">
                                Ver detalles
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="direcciones">
                  <Card>
                    <CardHeader>
                      <CardTitle>Direcciones guardadas</CardTitle>
                      <CardDescription>Gestiona tus direcciones de envío y facturación.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Casa</h3>
                              <p className="text-sm mt-1">Juan Pérez</p>
                              <p className="text-sm text-muted-foreground">Calle Principal 123</p>
                              <p className="text-sm text-muted-foreground">28001 Madrid, España</p>
                              <p className="text-sm text-muted-foreground">+34 612 345 678</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">Oficina</h3>
                              <p className="text-sm mt-1">Juan Pérez</p>
                              <p className="text-sm text-muted-foreground">Avenida Comercial 456</p>
                              <p className="text-sm text-muted-foreground">28002 Madrid, España</p>
                              <p className="text-sm text-muted-foreground">+34 698 765 432</p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              >
                                Eliminar
                              </Button>
                            </div>
                          </div>
                        </div>

                        <Button className="w-full">Añadir nueva dirección</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
