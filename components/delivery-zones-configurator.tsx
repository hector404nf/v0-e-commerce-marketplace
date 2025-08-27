"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Save, X, Plus, MapPin, Palette, Pipette } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import GoogleMapsLoader from "@/lib/google-maps-loader"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DeliveryZone {
  id: string
  name: string
  price: number
  estimatedTime: string
  coordinates: Array<{ lat: number; lng: number }>
  color: string
}

interface DeliveryZonesConfiguratorProps {
  storeLocation: [number, number]
  zones: DeliveryZone[]
  onZonesChange: (zones: DeliveryZone[]) => void
}

const PRESET_COLORS = [
  { name: "Rojo", light: "#FF6B6B", dark: "#FF5252" },
  { name: "Turquesa", light: "#4ECDC4", dark: "#26A69A" },
  { name: "Azul", light: "#45B7D1", dark: "#42A5F5" },
  { name: "Verde", light: "#96CEB4", dark: "#66BB6A" },
  { name: "Amarillo", light: "#FFEAA7", dark: "#FFEE58" },
  { name: "Púrpura", light: "#DDA0DD", dark: "#BA68C8" },
  { name: "Verde Agua", light: "#98D8C8", dark: "#4DB6AC" },
  { name: "Dorado", light: "#F7DC6F", dark: "#FFD54F" },
  { name: "Lavanda", light: "#BB8FCE", dark: "#9575CD" },
  { name: "Celeste", light: "#85C1E9", dark: "#64B5F6" },
  { name: "Coral", light: "#F8BBD9", dark: "#F48FB1" },
  { name: "Menta", light: "#A8E6CF", dark: "#81C784" },
  { name: "Durazno", light: "#FFD3A5", dark: "#FFAB91" },
  { name: "Lila", light: "#C7CEEA", dark: "#9FA8DA" },
  { name: "Rosa", light: "#FFAAA5", dark: "#EF5350" },
  { name: "Esmeralda", light: "#50C878", dark: "#4CAF50" },
  { name: "Naranja", light: "#FFA726", dark: "#FF9800" },
  { name: "Índigo", light: "#7986CB", dark: "#5C6BC0" },
]

export default function DeliveryZonesConfigurator({
  storeLocation,
  zones,
  onZonesChange,
}: DeliveryZonesConfiguratorProps) {
  const { theme } = useTheme()
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZonePrice, setNewZonePrice] = useState("")
  const [newZoneTime, setNewZoneTime] = useState("")
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0])
  const [customColor, setCustomColor] = useState("#FF6B6B")
  const [colorMode, setColorMode] = useState<"preset" | "custom">("preset")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState(false)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const drawingManagerRef = useRef<any>(null)
  const polygonsRef = useRef<Map<string, any>>(new Map())
  const storeMarkerRef = useRef<any>(null)
  const mapInitializedRef = useRef(false)

  // Get current color based on theme and mode
  const getCurrentColor = (colorObj?: (typeof PRESET_COLORS)[0]) => {
    if (colorMode === "custom") {
      return customColor
    }
    if (!colorObj) return customColor
    return theme === "dark" ? colorObj.dark : colorObj.light
  }

  // Get the final color to use
  const getFinalColor = () => {
    return colorMode === "custom" ? customColor : getCurrentColor(selectedColor)
  }

  // Effect para inicializar el mapa cuando se abre el modal
  useEffect(() => {
    if (isModalOpen && !mapInitializedRef.current) {
      initializeMapInModal()
    }
  }, [isModalOpen])

  // Update selected color when zones change
  useEffect(() => {
    if (colorMode === "preset") {
      const availableColors = PRESET_COLORS.filter(
        (color) => !zones.some((zone) => zone.color === getCurrentColor(color)),
      )
      if (availableColors.length > 0) {
        setSelectedColor(availableColors[0])
      }
    }
  }, [zones, theme, colorMode])

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup map instances when component unmounts
      if (mapInstanceRef.current) {
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setMap(null)
          drawingManagerRef.current = null
        }

        polygonsRef.current.forEach((polygon) => {
          polygon.setMap(null)
        })
        polygonsRef.current.clear()

        if (storeMarkerRef.current) {
          storeMarkerRef.current.setMap(null)
          storeMarkerRef.current = null
        }

        mapInstanceRef.current = null
      }
      mapInitializedRef.current = false
    }
  }, [])

  const initializeMapInModal = () => {
    const loader = GoogleMapsLoader.getInstance()

    // Check if API key is configured
    if (!loader.isApiKeyConfigured()) {
      setMapError("Google Maps API key not configured")
      setIsLoadingMap(false)
      return
    }

    setIsLoadingMap(true)
    setMapError(null)

    // Small delay to ensure DOM is ready
    setTimeout(() => {
      loader.load(() => {
        try {
          if (mapRef.current && !mapInitializedRef.current) {
            initializeMap()
            mapInitializedRef.current = true
          }
          setIsLoadingMap(false)
        } catch (error) {
          console.error("Error initializing map:", error)
          setMapError("Error initializing map")
          setIsLoadingMap(false)
        }
      })
    }, 100)
  }

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps || !window.google.maps.drawing) {
      console.error("Google Maps or Drawing library not loaded")
      throw new Error("Google Maps not available")
    }

    // Clear any existing map instance
    if (mapInstanceRef.current) {
      if (drawingManagerRef.current) {
        drawingManagerRef.current.setMap(null)
      }
      polygonsRef.current.forEach((polygon) => {
        polygon.setMap(null)
      })
      if (storeMarkerRef.current) {
        storeMarkerRef.current.setMap(null)
      }
    }

    const mapOptions = {
      center: { lat: storeLocation[0], lng: storeLocation[1] },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      styles:
        theme === "dark"
          ? [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [{ color: "#263c3f" }],
              },
              {
                featureType: "poi.park",
                elementType: "labels.text.fill",
                stylers: [{ color: "#6b9a76" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry",
                stylers: [{ color: "#746855" }],
              },
              {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [{ color: "#1f2835" }],
              },
              {
                featureType: "road.highway",
                elementType: "labels.text.fill",
                stylers: [{ color: "#f3d19c" }],
              },
              {
                featureType: "transit",
                elementType: "geometry",
                stylers: [{ color: "#2f3948" }],
              },
              {
                featureType: "transit.station",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.stroke",
                stylers: [{ color: "#17263c" }],
              },
            ]
          : undefined,
    }

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions)

    // Marcador de la tienda
    storeMarkerRef.current = new window.google.maps.Marker({
      position: { lat: storeLocation[0], lng: storeLocation[1] },
      map: mapInstanceRef.current,
      title: "Ubicación de la tienda",
      icon: {
        url:
          "data:image/svg+xml;charset=UTF-8," +
          encodeURIComponent(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#FF4444" stroke="#FFF" strokeWidth="2"/>
          <text x="20" y="26" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">🏪</text>
        </svg>
      `),
        scaledSize: new window.google.maps.Size(40, 40),
      },
    })

    // Drawing Manager
    const currentColor = getFinalColor()
    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON, window.google.maps.drawing.OverlayType.CIRCLE],
      },
      polygonOptions: {
        fillColor: currentColor,
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: currentColor,
        clickable: true,
        editable: true,
        draggable: false,
      },
      circleOptions: {
        fillColor: currentColor,
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: currentColor,
        clickable: true,
        editable: true,
        draggable: false,
      },
    })

    drawingManagerRef.current.setMap(mapInstanceRef.current)

    // Evento cuando se completa un polígono
    drawingManagerRef.current.addListener("polygoncomplete", (polygon: any) => {
      setCurrentDrawing({ type: "polygon", shape: polygon })
    })

    // Evento cuando se completa un círculo
    drawingManagerRef.current.addListener("circlecomplete", (circle: any) => {
      setCurrentDrawing({ type: "circle", shape: circle })
    })

    // Render existing zones
    renderExistingZones()
    setIsMapLoaded(true)
  }

  // Update drawing manager colors when selected color changes
  useEffect(() => {
    if (drawingManagerRef.current) {
      const currentColor = getFinalColor()
      drawingManagerRef.current.setOptions({
        polygonOptions: {
          fillColor: currentColor,
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: currentColor,
          clickable: true,
          editable: true,
          draggable: false,
        },
        circleOptions: {
          fillColor: currentColor,
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: currentColor,
          clickable: true,
          editable: true,
          draggable: false,
        },
      })
    }
  }, [selectedColor, customColor, colorMode, theme])

  const renderExistingZones = () => {
    if (!mapInstanceRef.current) return

    zones.forEach((zone) => {
      if (!polygonsRef.current.has(zone.id)) {
        const polygon = new window.google.maps.Polygon({
          paths: zone.coordinates,
          fillColor: zone.color,
          fillOpacity: 0.3,
          strokeWeight: 2,
          strokeColor: zone.color,
          clickable: true,
          editable: true,
        })

        polygon.setMap(mapInstanceRef.current)
        polygonsRef.current.set(zone.id, polygon)

        polygon.addListener("click", () => {
          setEditingZone(zone.id)
        })
      }
    })
  }

  const deleteZone = (zoneId: string) => {
    const polygon = polygonsRef.current.get(zoneId)
    if (polygon) {
      polygon.setMap(null)
      polygonsRef.current.delete(zoneId)
    }

    const updatedZones = zones.filter((zone) => zone.id !== zoneId)
    onZonesChange(updatedZones)

    toast({
      title: "Zona eliminada",
      description: "La zona ha sido eliminada correctamente",
    })
  }

  const updateZone = (zoneId: string, updates: Partial<DeliveryZone>) => {
    const updatedZones = zones.map((zone) => (zone.id === zoneId ? { ...zone, ...updates } : zone))
    onZonesChange(updatedZones)
    setEditingZone(null)

    toast({
      title: "Zona actualizada",
      description: "Los cambios han sido guardados",
    })
  }

  const handleSaveZone = () => {
    if (!currentDrawing) {
      toast({
        title: "Error",
        description: "Debes dibujar una zona primero",
        variant: "destructive",
      })
      return
    }

    const coordinates: Array<{ lat: number; lng: number }> = []

    if (currentDrawing.type === "polygon") {
      const path = currentDrawing.shape.getPath()
      for (let i = 0; i < path.getLength(); i++) {
        const point = path.getAt(i)
        coordinates.push({ lat: point.lat(), lng: point.lng() })
      }
    } else if (currentDrawing.type === "circle") {
      const center = currentDrawing.shape.getCenter()
      const radius = currentDrawing.shape.getRadius()

      // Convertir círculo a polígono para almacenamiento
      const numPoints = 32
      for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * 2 * Math.PI
        const lat = center.lat() + (radius / 111320) * Math.cos(angle)
        const lng = center.lng() + (radius / (111320 * Math.cos((center.lat() * Math.PI) / 180))) * Math.sin(angle)
        coordinates.push({ lat, lng })
      }
    }

    // Crear nueva zona
    const newZone: DeliveryZone = {
      id: `zone_${Date.now()}`,
      name: newZoneName || `Zona ${zones.length + 1}`,
      price: Number.parseFloat(newZonePrice) || 5000,
      estimatedTime: newZoneTime || "30-45 min",
      coordinates,
      color: getFinalColor(),
    }

    // Guardar referencia del shape
    polygonsRef.current.set(newZone.id, currentDrawing.shape)

    // Agregar evento de clic al shape
    currentDrawing.shape.addListener("click", () => {
      setEditingZone(newZone.id)
    })

    // Actualizar zonas
    const updatedZones = [...zones, newZone]
    onZonesChange(updatedZones)

    // Limpiar formulario y cerrar modal
    setNewZoneName("")
    setNewZonePrice("")
    setNewZoneTime("")
    setCurrentDrawing(null)
    setIsModalOpen(false)

    // Desactivar modo de dibujo
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null)
    }

    toast({
      title: "Zona creada",
      description: `Zona "${newZone.name}" agregada correctamente`,
    })
  }

  const resetDrawing = () => {
    if (currentDrawing) {
      currentDrawing.shape.setMap(null)
      setCurrentDrawing(null)
    }
    if (drawingManagerRef.current) {
      drawingManagerRef.current.setDrawingMode(null)
    }
  }

  const handleOpenModal = () => {
    setIsLoadingMap(true)
    setMapError(null)
    setIsModalOpen(true)
  }

  const editingZoneData = zones.find((zone) => zone.id === editingZone)

  // Get color name from color value
  const getColorName = (colorValue: string) => {
    const colorObj = PRESET_COLORS.find((c) => c.light === colorValue || c.dark === colorValue)
    return colorObj?.name || "Color personalizado"
  }

  // Generate random custom color
  const generateRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E9",
      "#F8BBD9",
      "#A8E6CF",
      "#FFD3A5",
      "#C7CEEA",
      "#FFAAA5",
      "#50C878",
      "#FFA726",
      "#7986CB",
    ]
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    setCustomColor(randomColor)
  }

  return (
    <div className="space-y-6">
      {/* Botón para crear nueva zona */}
      <div className="flex justify-center">
        <Button size="lg" onClick={handleOpenModal}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Nueva Zona de Delivery
        </Button>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configurar Nueva Zona de Delivery
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Formulario básico */}
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="zoneName">Nombre de la zona</Label>
                  <Input
                    id="zoneName"
                    value={newZoneName}
                    onChange={(e) => setNewZoneName(e.target.value)}
                    placeholder="Centro, Norte, Sur..."
                  />
                </div>
                <div>
                  <Label htmlFor="zonePrice">Precio de delivery ($)</Label>
                  <Input
                    id="zonePrice"
                    type="number"
                    value={newZonePrice}
                    onChange={(e) => setNewZonePrice(e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="zoneTime">Tiempo estimado</Label>
                  <Input
                    id="zoneTime"
                    value={newZoneTime}
                    onChange={(e) => setNewZoneTime(e.target.value)}
                    placeholder="30-45 min"
                  />
                </div>
              </div>

              {/* Selector de colores */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5" />
                  <Label className="text-base font-medium">Selecciona el color de la zona</Label>
                  <div
                    className="w-8 h-8 rounded-full border-2 border-border shadow-sm"
                    style={{ backgroundColor: getFinalColor() }}
                  />
                </div>

                <Tabs value={colorMode} onValueChange={(value) => setColorMode(value as "preset" | "custom")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preset" className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Colores Predefinidos
                    </TabsTrigger>
                    <TabsTrigger value="custom" className="flex items-center gap-2">
                      <Pipette className="h-4 w-4" />
                      Color Personalizado
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="preset" className="space-y-4">
                    <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-12 gap-3">
                      {PRESET_COLORS.map((color, index) => {
                        const currentColor = getCurrentColor(color)
                        const isUsed = zones.some((zone) => zone.color === currentColor)
                        const isSelected = selectedColor.name === color.name

                        return (
                          <button
                            key={index}
                            type="button"
                            disabled={isUsed}
                            onClick={() => setSelectedColor(color)}
                            className={cn(
                              "relative w-12 h-12 rounded-lg border-2 transition-all duration-200",
                              "hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                              isSelected && "ring-2 ring-primary ring-offset-2 scale-110",
                              isUsed && "opacity-50 cursor-not-allowed hover:scale-100",
                            )}
                            style={{
                              backgroundColor: currentColor,
                              borderColor: theme === "dark" ? "#374151" : "#d1d5db",
                            }}
                            title={`${color.name}${isUsed ? " (En uso)" : ""}`}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                              </div>
                            )}
                            {isUsed && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <X className="w-4 h-4 text-white drop-shadow-sm" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Los colores marcados con ✕ ya están en uso. Los colores se adaptan automáticamente al modo
                      claro/oscuro.
                    </p>
                  </TabsContent>

                  <TabsContent value="custom" className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="space-y-2">
                        <Label htmlFor="customColorPicker">Selector de Color</Label>
                        <div className="flex items-center gap-3">
                          <input
                            id="customColorPicker"
                            type="color"
                            value={customColor}
                            onChange={(e) => setCustomColor(e.target.value)}
                            className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
                            title="Selecciona un color personalizado"
                          />
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Label htmlFor="customColorInput" className="text-sm">
                                Código Hex:
                              </Label>
                              <Input
                                id="customColorInput"
                                type="text"
                                value={customColor}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                    setCustomColor(value)
                                  }
                                }}
                                className="w-24 h-8 text-sm"
                                placeholder="#FF6B6B"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generateRandomColor}
                              className="text-xs bg-transparent"
                            >
                              Color Aleatorio
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Vista Previa</Label>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-16 h-16 rounded-lg border-2 border-border shadow-sm"
                            style={{ backgroundColor: customColor }}
                          />
                          <div className="text-sm space-y-1">
                            <p className="font-medium">Color seleccionado</p>
                            <p className="text-muted-foreground">{customColor.toUpperCase()}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Colores Sugeridos</h4>
                      <div className="grid grid-cols-8 gap-2">
                        {[
                          "#FF6B6B",
                          "#4ECDC4",
                          "#45B7D1",
                          "#96CEB4",
                          "#FFEAA7",
                          "#DDA0DD",
                          "#98D8C8",
                          "#F7DC6F",
                          "#BB8FCE",
                          "#85C1E9",
                          "#F8BBD9",
                          "#A8E6CF",
                          "#FFD3A5",
                          "#C7CEEA",
                          "#FFAAA5",
                          "#50C878",
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setCustomColor(color)}
                            className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Mapa */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-medium">Dibuja la zona en el mapa</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={resetDrawing} disabled={!currentDrawing}>
                      <X className="h-4 w-4 mr-2" />
                      Resetear Dibujo
                    </Button>
                  </div>
                </div>

                {mapError ? (
                  <div className="flex flex-col items-center justify-center h-96 bg-muted rounded-lg border-2 border-dashed">
                    <div className="text-center space-y-2">
                      <p className="text-destructive font-medium">Error cargando el mapa</p>
                      <p className="text-sm text-muted-foreground">{mapError}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setMapError(null)
                          mapInitializedRef.current = false
                          initializeMapInModal()
                        }}
                      >
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-96">
                    <div ref={mapRef} className="w-full h-96 rounded-lg border" />
                    {isLoadingMap && (
                      <div className="flex items-center justify-center absolute inset-0 bg-background/80 rounded-lg">
                        <div className="text-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p>Cargando mapa...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-sm text-muted-foreground">
                  Usa las herramientas del mapa para dibujar polígonos o círculos que representen tu zona de delivery.
                  El color seleccionado se aplicará automáticamente a la zona.
                </p>
              </div>

              {/* Botones de acción */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetDrawing()
                    setIsModalOpen(false)
                    setNewZoneName("")
                    setNewZonePrice("")
                    setNewZoneTime("")
                  }}
                >
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSaveZone} disabled={!currentDrawing || !newZoneName.trim()}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Zona
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lista de zonas */}
      <Card>
        <CardHeader>
          <CardTitle>Zonas Configuradas ({zones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay zonas configuradas. Haz clic en "Crear Nueva Zona" para comenzar.
            </p>
          ) : (
            <div className="space-y-3">
              {zones.map((zone) => (
                <div key={zone.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                      style={{ backgroundColor: zone.color }}
                    />
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${zone.price.toLocaleString()} • {zone.estimatedTime} • {getColorName(zone.color)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditingZone(zone.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => deleteZone(zone.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de edición */}
      {editingZone && editingZoneData && (
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border-2 border-border"
                  style={{ backgroundColor: editingZoneData.color }}
                />
                Editando: {editingZoneData.name}
              </div>
              <Button size="sm" variant="ghost" onClick={() => setEditingZone(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  defaultValue={editingZoneData.name}
                  onChange={(e) => {
                    const updatedZones = zones.map((zone) =>
                      zone.id === editingZone ? { ...zone, name: e.target.value } : zone,
                    )
                    onZonesChange(updatedZones)
                  }}
                />
              </div>
              <div>
                <Label>Precio ($)</Label>
                <Input
                  type="number"
                  defaultValue={editingZoneData.price}
                  onChange={(e) => {
                    const updatedZones = zones.map((zone) =>
                      zone.id === editingZone ? { ...zone, price: Number.parseFloat(e.target.value) || 0 } : zone,
                    )
                    onZonesChange(updatedZones)
                  }}
                />
              </div>
              <div>
                <Label>Tiempo</Label>
                <Input
                  defaultValue={editingZoneData.estimatedTime}
                  onChange={(e) => {
                    const updatedZones = zones.map((zone) =>
                      zone.id === editingZone ? { ...zone, estimatedTime: e.target.value } : zone,
                    )
                    onZonesChange(updatedZones)
                  }}
                />
              </div>
            </div>
            <Button onClick={() => setEditingZone(null)} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
