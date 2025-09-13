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
import { Loader2, X, Upload } from "lucide-react"
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

interface ImagePreview {
  file: File
  preview: string
  id: string
}

export default function ProductUploadForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [especificaciones, setEspecificaciones] = useState<string[]>([])
  const [nuevaEspecificacion, setNuevaEspecificacion] = useState("")
  const [imagenesPreview, setImagenesPreview] = useState<ImagePreview[]>([])
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

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    // Validar que no se excedan las 8 imágenes
    if (imagenesPreview.length + files.length > 8) {
      toast({
        title: "Límite de imágenes",
        description: "Puedes subir máximo 8 imágenes por producto.",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño de archivos (máximo 5MB cada uno)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const invalidFiles = files.filter((file) => file.size > maxSize)

    if (invalidFiles.length > 0) {
      toast({
        title: "Archivos muy grandes",
        description: "Cada imagen debe ser menor a 5MB.",
        variant: "destructive",
      })
      return
    }

    // Procesar archivos válidos
    const validFiles = files.filter((file) => file.size <= maxSize)

    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const newImage: ImagePreview = {
          file,
          preview: reader.result as string,
          id: Math.random().toString(36).substr(2, 9),
        }

        setImagenesPreview((prev) => [...prev, newImage])
      }
      reader.readAsDataURL(file)
    })

    // Limpiar el input
    e.target.value = ""
  }

  const eliminarImagen = (id: string) => {
    setImagenesPreview((prev) => prev.filter((img) => img.id !== id))
  }

  const reordenarImagenes = (fromIndex: number, toIndex: number) => {
    setImagenesPreview((prev) => {
      const newArray = [...prev]
      const [removed] = newArray.splice(fromIndex, 1)
      newArray.splice(toIndex, 0, removed)
      return newArray
    })
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

    if (imagenesPreview.length === 0) {
      newErrors.imagenes = "Debes subir al menos una imagen del producto"
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

      // Simular la subida del producto con múltiples imágenes
      const imagenes = imagenesPreview.map((img) => img.file)
      await subirProducto(formData, especificaciones, imagenes)

      toast({
        title: "Producto subido con éxito",
        description: `${formData.nombre} ha sido publicado con ${imagenesPreview.length} imagen${imagenesPreview.length > 1 ? "es" : ""}.`,
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Sección de imágenes mejorada */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Imágenes del producto</Label>
                  <span className="text-sm text-muted-foreground">{imagenesPreview.length}/8 imágenes</span>
                </div>

                {/* Botón para subir imágenes */}
                <div className="flex flex-col gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-20 border-2 border-dashed hover:border-primary/50 transition-colors bg-transparent"
                    onClick={() => document.getElementById("imagenes-input")?.click()}
                    disabled={imagenesPreview.length >= 8}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-sm">
                        {imagenesPreview.length >= 8 ? "Máximo 8 imágenes alcanzado" : "Subir imágenes (máx. 8)"}
                      </span>
                    </div>
                  </Button>

                  <input
                    id="imagenes-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImagenesChange}
                  />

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Formatos: JPG, PNG, GIF</p>
                    <p>• Tamaño máximo: 5MB por imagen</p>
                    <p>• La primera imagen será la principal</p>
                  </div>
                </div>

                {errors.imagenes && <p className="text-sm text-red-500">{errors.imagenes}</p>}

                {/* Grid de imágenes preview */}
                {imagenesPreview.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                      {imagenesPreview.map((imagen, index) => (
                        <div key={imagen.id} className="relative group">
                          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary/20 transition-colors">
                            <img
                              src={imagen.preview || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />

                            {/* Overlay con controles */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => eliminarImagen(imagen.id)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Indicador de imagen principal */}
                            {index === 0 && (
                              <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                Principal
                              </div>
                            )}

                            {/* Número de imagen */}
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {imagenesPreview.length > 1 && (
                      <p className="text-xs text-muted-foreground">
                        💡 Arrastra las imágenes para reordenarlas. La primera imagen será la principal.
                      </p>
                    )}
                  </div>
                )}
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
