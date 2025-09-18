import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductUploadForm from "@/components/product-upload-form"

export default function NuevoProductoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" asChild>
          <Link href="/admin/productos">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a productos
          </Link>
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Nuevo Producto</h1>
        <p className="text-muted-foreground">Añade un nuevo producto a tu catálogo</p>
      </div>

      {/* Formulario */}
      <ProductUploadForm />
    </div>
  )
}
