"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus, X } from "lucide-react"
import { subirProducto } from "@/lib/actions"

interface FormData {
  nombre: string
  descripcion: string
  descripcionLarga: string
  precio: number
  descuento: number
  categoria: string
  marca: string
  tipoVenta: string
  stock: number
  tiempoEntrega: string
}

interface FormErrors {
  [key: string]: string
}

export default function ProductUploadForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [especificaciones, setEspecificaciones] = useState<string[]>([])
  const [nuevaEspecificacion, setNuevaEspecificacion] = useState("")
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    descripcion: "",
    descripcionLarga: "",
    precio: 0,
    descuento: 0,
    categoria: "",
    marca: "",
    tipoVenta: "",
    stock: 0,
    tiempoEntrega: "",
  })

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImagenFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagenPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const agregarEspecificacion = () => {
    if (nuevaEspecificacion.trim() !== "") {
      setEspecificaciones([...especificaciones, nuevaEspecificacion])
      setNuevaEspecificacion("")
    }
  }

  const eliminarEspecificacion = (index: number) => {
    setEspecificaciones(especificaciones.filter((_, i) => i !== index))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres"
    }

    if (!formData.descripcion || formData.descripcion.length < 10) {
      newErrors.descripcion = "La descripción debe tener al menos 10 caracteres"
    }

    if (!formData.descripcionLarga || formData.descripcionLarga.length < 30) {
      newErrors.descripcionLarga = "La descripción larga debe tener al menos 30 caracteres"
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser un número positivo"
    }

    if (formData.descuento < 0 || formData.descuento > 100) {
      newErrors.descuento = "El descuento debe estar entre 0 y 100"
    }

    if (!formData.categoria) {
      newErrors.categoria = "Por favor selecciona una categoría"
    }

    if (!formData.marca) {
      newErrors.marca = "Por favor selecciona una marca"
    }

    if (!formData.tipoVenta) {
      newErrors.tipoVenta = "Por favor selecciona el tipo de venta"
    }

    if (formData.stock < 0) {
      newErrors.stock = "El stock debe ser un número positivo o cero"
    }

    if (!formData.tiempoEntrega) {
      newErrors.tiempoEntrega = "Por favor especifica el tiempo de entrega"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast({
        title: "Error en el formulario",
        description: "Por favor corrige los errores antes de continuar.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)

      // Simular la subida del producto
      await subirProducto(formData, especificaciones, imagenFile)

      toast({
        title: "Producto subido con éxito",
        description: "Tu producto ha sido publicado correctamente.",
      })

      // Redireccionar a la página principal después de un breve retraso
      setTimeout(() => {
        router.push("/")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error("Error al subir el producto:", error)
      toast({
        title: "Error al subir el producto",
        description: "Ha ocurrido un error al subir el producto. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre del producto</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Smartphone Galaxy S23"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange("nombre", e.target.value)}
                />
                {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción corta</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Breve descripción del producto"
                  className="resize-none"
                  value={formData.descripcion}
                  onChange={(e) => handleInputChange("descripcion", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">Esta descripción aparecerá en las tarjetas de producto.</p>
                {errors.descripcion && <p className="text-sm text-red-500">{errors.descripcion}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="precio">Precio</Label>
                  <Input
                    id="precio"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => handleInputChange("precio", Number.parseFloat(e.target.value) || 0)}
                  />
                  {errors.precio && <p className="text-sm text-red-500">{errors.precio}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descuento">Descuento (%)</Label>
                  <Input
                    id="descuento"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.descuento}
                    onChange={(e) => handleInputChange("descuento", Number.parseInt(e.target.value) || 0)}
                  />
                  {errors.descuento && <p className="text-sm text-red-500">{errors.descuento}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoría</Label>
                  <Select onValueChange={(value) => handleInputChange("categoria", value)} value={formData.categoria}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="electronica">Electrónica</SelectItem>
                      <SelectItem value="ropa">Ropa</SelectItem>
                      <SelectItem value="hogar">Hogar</SelectItem>
                      <SelectItem value="deportes">Deportes</SelectItem>
                      <SelectItem value="belleza">Belleza</SelectItem>
                      <SelectItem value="comida">Comida</SelectItem>
                      <SelectItem value="bebidas">Bebidas</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.categoria && <p className="text-sm text-red-500">{errors.categoria}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca</Label>
                  <Select onValueChange={(value) => handleInputChange("marca", value)} value={formData.marca}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">Apple</SelectItem>
                      <SelectItem value="samsung">Samsung</SelectItem>
                      <SelectItem value="xiaomi">Xiaomi</SelectItem>
                      <SelectItem value="nike">Nike</SelectItem>
                      <SelectItem value="adidas">Adidas</SelectItem>
                      <SelectItem value="sony">Sony</SelectItem>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="otros">Otros</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoVenta">Tipo de venta</Label>
                <Select onValueChange={(value) => handleInputChange("tipoVenta", value)} value={formData.tipoVenta}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de venta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="directa">Compra directa (en stock)</SelectItem>
                    <SelectItem value="pedido">Por pedido (fabricación bajo pedido)</SelectItem>
                    <SelectItem value="delivery">Delivery/Retiro (comida y bebidas)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.tipoVenta === "directa" && "Producto disponible en stock para compra inmediata"}
                  {formData.tipoVenta === "pedido" && "Producto fabricado especialmente bajo pedido"}
                  {formData.tipoVenta === "delivery" && "Producto disponible para delivery o retiro en local"}
                </p>
                {errors.tipoVenta && <p className="text-sm text-red-500">{errors.tipoVenta}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">{formData.tipoVenta === "delivery" ? "Disponibilidad" : "Stock"}</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    disabled={formData.tipoVenta === "delivery"}
                    placeholder={formData.tipoVenta === "delivery" ? "999" : "0"}
                    value={formData.tipoVenta === "delivery" ? 999 : formData.stock}
                    onChange={(e) => handleInputChange("stock", Number.parseInt(e.target.value) || 0)}
                  />
                  <p className="text-sm text-muted-foreground">
                    {formData.tipoVenta === "directa" && "Cantidad disponible en stock"}
                    {formData.tipoVenta === "pedido" && "Dejar en 0 para productos por pedido"}
                    {formData.tipoVenta === "delivery" && "Se establece automáticamente para delivery"}
                  </p>
                  {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tiempoEntrega">Tiempo de entrega</Label>
                  <Input
                    id="tiempoEntrega"
                    placeholder={
                      formData.tipoVenta === "directa"
                        ? "Ej: Inmediato"
                        : formData.tipoVenta === "pedido"
                          ? "Ej: 7-10 días hábiles"
                          : "Ej: 30-45 minutos"
                    }
                    value={formData.tiempoEntrega}
                    onChange={(e) => handleInputChange("tiempoEntrega", e.target.value)}
                  />
                  {errors.tiempoEntrega && <p className="text-sm text-red-500">{errors.tiempoEntrega}</p>}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="descripcionLarga">Descripción detallada</Label>
                <Textarea
                  id="descripcionLarga"
                  placeholder="Descripción completa del producto con todas sus características"
                  className="resize-none h-32"
                  value={formData.descripcionLarga}
                  onChange={(e) => handleInputChange("descripcionLarga", e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Esta descripción aparecerá en la página de detalles del producto.
                </p>
                {errors.descripcionLarga && <p className="text-sm text-red-500">{errors.descripcionLarga}</p>}
              </div>

              <div>
                <div className="mb-2">
                  <Label>Imagen del producto</Label>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={() => document.getElementById("imagen-input")?.click()}
                    style={{ height: "150px", width: "150px" }}
                  >
                    {imagenPreview ? (
                      <img
                        src={imagenPreview || "/placeholder.svg"}
                        alt="Vista previa"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Plus className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">Subir imagen</p>
                      </div>
                    )}
                    <input
                      id="imagen-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImagenChange}
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Formatos: JPG, PNG, GIF</p>
                    <p>Tamaño máximo: 5MB</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-2">
                  <Label>Especificaciones</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={nuevaEspecificacion}
                      onChange={(e) => setNuevaEspecificacion(e.target.value)}
                      placeholder="Ej: Pantalla AMOLED de 6.1 pulgadas"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          agregarEspecificacion()
                        }
                      }}
                    />
                    <Button type="button" onClick={agregarEspecificacion} size="sm">
                      Añadir
                    </Button>
                  </div>

                  <div className="space-y-2 mt-2">
                    {especificaciones.map((spec, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                        <span className="text-sm">{spec}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => eliminarEspecificacion(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo producto...
              </>
            ) : (
              "Publicar producto"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
