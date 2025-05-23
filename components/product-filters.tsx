"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ProductFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [precioMin, setPrecioMin] = useState(0)
  const [precioMax, setPrecioMax] = useState(1000)
  const [categorias, setCategorias] = useState<string[]>([])
  const [marcas, setMarcas] = useState<string[]>([])
  const [tiposVenta, setTiposVenta] = useState<string[]>([])

  // Inicializar filtros desde URL
  useEffect(() => {
    const categoriaParam = searchParams.get("categoria")
    if (categoriaParam) {
      setCategorias([categoriaParam])
    }

    const tipoVentaParam = searchParams.get("tipoVenta")
    if (tipoVentaParam) {
      setTiposVenta([tipoVentaParam])
    }
  }, [searchParams])

  // Aplicar filtros
  const aplicarFiltros = () => {
    const params = new URLSearchParams()

    if (categorias.length === 1) {
      params.set("categoria", categorias[0])
    }

    if (marcas.length > 0) {
      params.set("marcas", marcas.join(","))
    }

    if (tiposVenta.length === 1) {
      params.set("tipoVenta", tiposVenta[0])
    }

    if (precioMin > 0 || precioMax < 1000) {
      params.set("precio_min", precioMin.toString())
      params.set("precio_max", precioMax.toString())
    }

    const busqueda = searchParams.get("busqueda")
    if (busqueda) {
      params.set("busqueda", busqueda)
    }

    router.push(`/?${params.toString()}`)

    // Cerrar el Sheet en móvil si existe
    const closeButton = document.querySelector("[data-radix-collection-item]")
    if (closeButton && window.innerWidth < 768) {
      ;(closeButton as HTMLButtonElement).click()
    }
  }

  // Limpiar filtros
  const limpiarFiltros = () => {
    setPrecioMin(0)
    setPrecioMax(1000)
    setCategorias([])
    setMarcas([])
    setTiposVenta([])

    const busqueda = searchParams.get("busqueda")
    if (busqueda) {
      router.push(`/?busqueda=${busqueda}`)
    } else {
      router.push("/")
    }

    // Cerrar el Sheet en móvil si existe
    const closeButton = document.querySelector("[data-radix-collection-item]")
    if (closeButton && window.innerWidth < 768) {
      ;(closeButton as HTMLButtonElement).click()
    }
  }

  // Manejar cambio de categoría
  const toggleCategoria = (categoria: string) => {
    if (categorias.includes(categoria)) {
      setCategorias(categorias.filter((c) => c !== categoria))
    } else {
      setCategorias([...categorias, categoria])
    }
  }

  // Manejar cambio de marca
  const toggleMarca = (marca: string) => {
    if (marcas.includes(marca)) {
      setMarcas(marcas.filter((m) => m !== marca))
    } else {
      setMarcas([...marcas, marca])
    }
  }

  // Manejar cambio de tipo de venta
  const toggleTipoVenta = (tipo: string) => {
    if (tiposVenta.includes(tipo)) {
      setTiposVenta(tiposVenta.filter((t) => t !== tipo))
    } else {
      setTiposVenta([...tiposVenta, tipo])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={limpiarFiltros}>
          Limpiar
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={["categorias", "tipoVenta", "precio", "marcas"]} className="w-full">
        <AccordionItem value="tipoVenta">
          <AccordionTrigger>Tipo de venta</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {[
                { value: "directa", label: "Compra directa" },
                { value: "pedido", label: "Por pedido" },
                { value: "delivery", label: "Delivery/Retiro" },
              ].map((tipo) => (
                <div key={tipo.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tipo-${tipo.value}`}
                    checked={tiposVenta.includes(tipo.value)}
                    onCheckedChange={() => toggleTipoVenta(tipo.value)}
                  />
                  <Label htmlFor={`tipo-${tipo.value}`}>{tipo.label}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="categorias">
          <AccordionTrigger>Categorías</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Electrónica", "Ropa", "Hogar", "Deportes", "Belleza", "Comida", "Bebidas"].map((categoria) => (
                <div key={categoria} className="flex items-center space-x-2">
                  <Checkbox
                    id={`categoria-${categoria}`}
                    checked={categorias.includes(categoria.toLowerCase())}
                    onCheckedChange={() => toggleCategoria(categoria.toLowerCase())}
                  />
                  <Label htmlFor={`categoria-${categoria}`}>{categoria}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="precio">
          <AccordionTrigger>Precio</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[precioMin, precioMax]}
                max={1000}
                step={10}
                onValueChange={(values) => {
                  setPrecioMin(values[0])
                  setPrecioMax(values[1])
                }}
              />
              <div className="flex items-center justify-between">
                <p className="text-sm">${precioMin}</p>
                <p className="text-sm">${precioMax}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="marcas">
          <AccordionTrigger>Marcas</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {["Apple", "Samsung", "Nike", "Adidas", "Sony", "Casa"].map((marca) => (
                <div key={marca} className="flex items-center space-x-2">
                  <Checkbox
                    id={`marca-${marca}`}
                    checked={marcas.includes(marca.toLowerCase())}
                    onCheckedChange={() => toggleMarca(marca.toLowerCase())}
                  />
                  <Label htmlFor={`marca-${marca}`}>{marca}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button className="w-full" onClick={aplicarFiltros}>
        Aplicar filtros
      </Button>
    </div>
  )
}
