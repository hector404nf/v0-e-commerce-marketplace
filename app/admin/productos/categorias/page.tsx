"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Search, Edit, Trash2, MoreHorizontal, Package, Tag, TrendingUp, Eye, Upload } from "lucide-react"
import Image from "next/image"
import { productos } from "@/lib/data"

interface Category {
  id: string
  nombre: string
  descripcion: string
  imagen: string
  activa: boolean
  productCount: number
  createdAt: string
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  })

  // Generar categorías basadas en los productos existentes
  const categoriesFromProducts = Array.from(new Set(productos.map((p) => p.categoria)))
  const [categories, setCategories] = useState<Category[]>(
    categoriesFromProducts.map((cat, index) => ({
      id: `cat-${index + 1}`,
      nombre: cat,
      descripcion: `Productos de ${cat.toLowerCase()}`,
      imagen: `/placeholder.svg?height=200&width=200&text=${cat}`,
      activa: true,
      productCount: productos.filter((p) => p.categoria === cat).length,
      createdAt: "2024-01-15",
    })),
  )

  const filteredCategories = categories.filter((category) =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleCreateCategory = () => {
    if (newCategory.nombre.trim()) {
      const category: Category = {
        id: `cat-${Date.now()}`,
        nombre: newCategory.nombre,
        descripcion: newCategory.descripcion,
        imagen: newCategory.imagen || `/placeholder.svg?height=200&width=200&text=${newCategory.nombre}`,
        activa: true,
        productCount: 0,
        createdAt: new Date().toISOString().split("T")[0],
      }
      setCategories((prev) => [...prev, category])
      setNewCategory({ nombre: "", descripcion: "", imagen: "" })
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditCategory = () => {
    if (selectedCategory && newCategory.nombre.trim()) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === selectedCategory.id
            ? {
                ...cat,
                nombre: newCategory.nombre,
                descripcion: newCategory.descripcion,
                imagen: newCategory.imagen || cat.imagen,
              }
            : cat,
        ),
      )
      setNewCategory({ nombre: "", descripcion: "", imagen: "" })
      setIsEditDialogOpen(false)
      setSelectedCategory(null)
    }
  }

  const handleDeleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))
  }

  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, activa: !cat.activa } : cat)))
  }

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category)
    setNewCategory({
      nombre: category.nombre,
      descripcion: category.descripcion,
      imagen: category.imagen,
    })
    setIsEditDialogOpen(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewCategory((prev) => ({ ...prev, imagen: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.activa).length,
    inactive: categories.filter((c) => !c.activa).length,
    totalProducts: categories.reduce((sum, cat) => sum + cat.productCount, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Organiza tus productos por categorías</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Nueva Categoría</DialogTitle>
              <DialogDescription>Añade una nueva categoría para organizar tus productos</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la categoría *</Label>
                <Input
                  id="nombre"
                  value={newCategory.nombre}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Ej: Electrónicos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={newCategory.descripcion}
                  onChange={(e) => setNewCategory((prev) => ({ ...prev, descripcion: e.target.value }))}
                  placeholder="Describe esta categoría..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imagen">Imagen de la categoría</Label>
                <div className="flex items-center gap-4">
                  {newCategory.imagen && (
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                      <Image
                        src={newCategory.imagen || "/placeholder.svg"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button type="button" variant="outline" asChild>
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir imagen
                      </label>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateCategory}>Crear Categoría</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total categorías</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-xs text-muted-foreground">Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.inactive}</p>
                <p className="text-xs text-muted-foreground">Inactivas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalProducts}</p>
                <p className="text-xs text-muted-foreground">Total productos</p>
              </div>
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
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className={`${!category.activa ? "opacity-60" : ""}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={category.imagen || "/placeholder.svg"}
                      alt={category.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.nombre}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={category.activa ? "default" : "secondary"}>
                        {category.activa ? "Activa" : "Inactiva"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{category.productCount} productos</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => openEditDialog(category)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleCategoryStatus(category.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {category.activa ? "Desactivar" : "Activar"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción eliminará la categoría "{category.nombre}" permanentemente. Los productos en
                            esta categoría quedarán sin categoría.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">{category.descripcion || "Sin descripción"}</CardDescription>
              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                <span>Creada: {category.createdAt}</span>
                <Button variant="outline" size="sm">
                  Ver productos
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Categoría</DialogTitle>
            <DialogDescription>Modifica la información de la categoría</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-nombre">Nombre de la categoría *</Label>
              <Input
                id="edit-nombre"
                value={newCategory.nombre}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, nombre: e.target.value }))}
                placeholder="Ej: Electrónicos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-descripcion">Descripción</Label>
              <Textarea
                id="edit-descripcion"
                value={newCategory.descripcion}
                onChange={(e) => setNewCategory((prev) => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Describe esta categoría..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-imagen">Imagen de la categoría</Label>
              <div className="flex items-center gap-4">
                {newCategory.imagen && (
                  <div className="w-16 h-16 relative rounded-lg overflow-hidden">
                    <Image src={newCategory.imagen || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="edit-image-upload"
                  />
                  <Button type="button" variant="outline" asChild>
                    <label htmlFor="edit-image-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Cambiar imagen
                    </label>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditCategory}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No se encontraron categorías</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza creando tu primera categoría"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Categoría
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
