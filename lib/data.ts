export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  descuento: number
  categoria: string
  marca: string
  imagen?: string // Mantener para compatibilidad
  imagenes: string[] // Nueva propiedad para múltiples imágenes
  tipoVenta: "directa" | "pedido" | "delivery"
  stock: number
  tiempoEntrega: string
  tiendaId: number
  rating: number
  reviews: number
  tags: string[]
}

export const productos: Producto[] = [
  {
    id: 1,
    nombre: "Smartphone Samsung Galaxy A54",
    descripcion:
      "Teléfono inteligente con cámara de 50MP, pantalla AMOLED de 6.4 pulgadas y batería de larga duración.",
    precio: 299.99,
    descuento: 15,
    categoria: "Electrónicos",
    marca: "Samsung",
    imagen: "/placeholder.svg?height=400&width=400&text=Samsung+Galaxy+A54+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Samsung+Galaxy+A54+Principal",
      "/placeholder.svg?height=400&width=400&text=Samsung+Galaxy+A54+Trasera",
      "/placeholder.svg?height=400&width=400&text=Samsung+Galaxy+A54+Lateral",
      "/placeholder.svg?height=400&width=400&text=Samsung+Galaxy+A54+Pantalla",
    ],
    tipoVenta: "directa",
    stock: 25,
    tiempoEntrega: "Inmediato",
    tiendaId: 1,
    rating: 4.5,
    reviews: 128,
    tags: ["smartphone", "android", "cámara", "5g"],
  },
  {
    id: 2,
    nombre: "Laptop HP Pavilion 15",
    descripcion: "Laptop con procesador Intel Core i5, 8GB RAM, 256GB SSD, perfecta para trabajo y estudio.",
    precio: 649.99,
    descuento: 10,
    categoria: "Electrónicos",
    marca: "HP",
    imagen: "/placeholder.svg?height=400&width=400&text=HP+Pavilion+15+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=HP+Pavilion+15+Principal",
      "/placeholder.svg?height=400&width=400&text=HP+Pavilion+15+Abierta",
      "/placeholder.svg?height=400&width=400&text=HP+Pavilion+15+Teclado",
      "/placeholder.svg?height=400&width=400&text=HP+Pavilion+15+Puertos",
    ],
    tipoVenta: "directa",
    stock: 12,
    tiempoEntrega: "Inmediato",
    tiendaId: 1,
    rating: 4.3,
    reviews: 89,
    tags: ["laptop", "intel", "ssd", "trabajo"],
  },
  {
    id: 3,
    nombre: "Auriculares Sony WH-1000XM4",
    descripcion: "Auriculares inalámbricos con cancelación de ruido activa y hasta 30 horas de batería.",
    precio: 199.99,
    descuento: 20,
    categoria: "Electrónicos",
    marca: "Sony",
    imagen: "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM4+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM4+Principal",
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM4+Plegados",
      "/placeholder.svg?height=400&width=400&text=Sony+WH-1000XM4+Controles",
    ],
    tipoVenta: "delivery",
    stock: 0,
    tiempoEntrega: "2-3 días",
    tiendaId: 2,
    rating: 4.8,
    reviews: 256,
    tags: ["auriculares", "inalámbrico", "cancelación ruido", "sony"],
  },
  {
    id: 4,
    nombre: "Camiseta Polo Ralph Lauren",
    descripcion: "Camiseta polo clásica de algodón 100%, disponible en varios colores y tallas.",
    precio: 89.99,
    descuento: 0,
    categoria: "Ropa",
    marca: "Ralph Lauren",
    imagen: "/placeholder.svg?height=400&width=400&text=Polo+Ralph+Lauren+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Polo+Ralph+Lauren+Principal",
      "/placeholder.svg?height=400&width=400&text=Polo+Ralph+Lauren+Detalle",
      "/placeholder.svg?height=400&width=400&text=Polo+Ralph+Lauren+Colores",
      "/placeholder.svg?height=400&width=400&text=Polo+Ralph+Lauren+Tallas",
    ],
    tipoVenta: "directa",
    stock: 45,
    tiempoEntrega: "Inmediato",
    tiendaId: 3,
    rating: 4.2,
    reviews: 67,
    tags: ["polo", "algodón", "clásico", "casual"],
  },
  {
    id: 5,
    nombre: "Zapatillas Nike Air Max 270",
    descripcion: "Zapatillas deportivas con tecnología Air Max para máxima comodidad y estilo urbano.",
    precio: 129.99,
    descuento: 25,
    categoria: "Calzado",
    marca: "Nike",
    imagen: "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+270+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+270+Principal",
      "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+270+Lateral",
      "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+270+Suela",
      "/placeholder.svg?height=400&width=400&text=Nike+Air+Max+270+Detalle",
    ],
    tipoVenta: "pedido",
    stock: 8,
    tiempoEntrega: "5-7 días",
    tiendaId: 1,
    rating: 4.6,
    reviews: 194,
    tags: ["zapatillas", "deportivo", "air max", "urbano"],
  },
  {
    id: 6,
    nombre: "Cafetera Nespresso Vertuo",
    descripción: "Cafetera de cápsulas con tecnología Centrifusion para el café perfecto.",
    precio: 179.99,
    descuento: 15,
    categoria: "Hogar",
    marca: "Nespresso",
    imagen: "/placeholder.svg?height=400&width=400&text=Nespresso+Vertuo+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Nespresso+Vertuo+Principal",
      "/placeholder.svg?height=400&width=400&text=Nespresso+Vertuo+Abierta",
      "/placeholder.svg?height=400&width=400&text=Nespresso+Vertuo+Cápsulas",
    ],
    tipoVenta: "delivery",
    stock: 0,
    tiempoEntrega: "1-2 días",
    tiendaId: 2,
    rating: 4.4,
    reviews: 112,
    tags: ["cafetera", "nespresso", "cápsulas", "automática"],
  },
  {
    id: 7,
    nombre: "Tablet iPad Air 5ta Gen",
    descripcion: "Tablet con chip M1, pantalla Liquid Retina de 10.9 pulgadas y compatibilidad con Apple Pencil.",
    precio: 599.99,
    descuento: 8,
    categoria: "Electrónicos",
    marca: "Apple",
    imagen: "/placeholder.svg?height=400&width=400&text=iPad+Air+5+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=iPad+Air+5+Principal",
      "/placeholder.svg?height=400&width=400&text=iPad+Air+5+Trasera",
      "/placeholder.svg?height=400&width=400&text=iPad+Air+5+Pencil",
      "/placeholder.svg?height=400&width=400&text=iPad+Air+5+Colores",
    ],
    tipoVenta: "directa",
    stock: 18,
    tiempoEntrega: "Inmediato",
    tiendaId: 1,
    rating: 4.7,
    reviews: 203,
    tags: ["tablet", "ipad", "apple", "m1", "pencil"],
  },
  {
    id: 8,
    nombre: "Perfume Chanel No. 5",
    descripcion: "Fragancia icónica y atemporal, eau de parfum de 100ml.",
    precio: 149.99,
    descuento: 0,
    categoria: "Belleza",
    marca: "Chanel",
    imagen: "/placeholder.svg?height=400&width=400&text=Chanel+No5+Principal",
    imagenes: [
      "/placeholder.svg?height=400&width=400&text=Chanel+No5+Principal",
      "/placeholder.svg?height=400&width=400&text=Chanel+No5+Botella",
      "/placeholder.svg?height=400&width=400&text=Chanel+No5+Caja",
    ],
    tipoVenta: "delivery",
    stock: 0,
    tiempoEntrega: "3-5 días",
    tiendaId: 3,
    rating: 4.9,
    reviews: 89,
    tags: ["perfume", "chanel", "clásico", "elegante"],
  },
]

export const categorias = ["Electrónicos", "Ropa", "Calzado", "Hogar", "Belleza", "Deportes", "Libros", "Juguetes"]

export const marcas = ["Samsung", "Apple", "Nike", "Adidas", "Sony", "HP", "Dell", "Zara", "H&M", "Ralph Lauren"]
