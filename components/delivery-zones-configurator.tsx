"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Save, X, Plus, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import GoogleMapsLoader from "@/lib/google-maps-loader"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

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

const ZONE_COLORS = [
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
]

export default function DeliveryZonesConfigurator({
  storeLocation,
  zones,
  onZonesChange,
}: DeliveryZonesConfiguratorProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [editingZone, setEditingZone] = useState<string | null>(null)
  const [newZoneName, setNewZoneName] = useState("")
  const [newZonePrice, setNewZonePrice] = useState("")
  const [newZoneTime, setNewZoneTime] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<any>(null)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoadingMap, setIsLoadingMap] = useState(true)

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const drawingManagerRef = useRef<any>(null)
  const polygonsRef = useRef<Map<string, any>>(new Map())
  const storeMarkerRef = useRef<any>(null)

  useEffect(() => {
    const loader = GoogleMapsLoader.getInstance()

    // Check if API key is configured
    if (!loader.isApiKeyConfigured()) {
      setMapError("Google Maps API key not configured")
      setIsLoadingMap(false)
      return
    }

    setIsLoadingMap(true)
    setMapError(null)

    loader.load(() => {
      try {
        initializeMap()
        setIsLoadingMap(false)
      } catch (error) {
        console.error("Error initializing map:", error)
        setMapError("Error initializing map")
        setIsLoadingMap(false)
      }
    })

    // Cleanup function remains the same
    return () => {
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
    }
  }, [])

  useEffect(() => {
    if (isMapLoaded && zones.length > 0) {
      renderExistingZones()
    }
  }, [isMapLoaded, zones])

  const initializeMap = () => {
    if (!mapRef.current || !window.google || !window.google.maps || !window.google.maps.drawing) {
      console.error("Google Maps or Drawing library not loaded")
      return
    }

    const mapOptions = {
      center: { lat: storeLocation[0], lng: storeLocation[1] },
      zoom: 13,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
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
    drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [window.google.maps.drawing.OverlayType.POLYGON, window.google.maps.drawing.OverlayType.CIRCLE],
      },
      polygonOptions: {
        fillColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
        clickable: true,
        editable: true,
        draggable: false,
      },
      circleOptions: {
        fillColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: ZONE_COLORS[zones.length % ZONE_COLORS.length],
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

    setIsMapLoaded(true)
  }

  const renderExistingZones = () => {
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
      color: ZONE_COLORS[zones.length % ZONE_COLORS.length],
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
    drawingManagerRef.current.setDrawingMode(null)

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
    drawingManagerRef.current.setDrawingMode(null)
  }

  const editingZoneData = zones.find((zone) => zone.id === editingZone)

  return (
    <div className="space-y-6">
      {/* Botón para crear nueva zona */}
      <div className="flex justify-center">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nueva Zona de Delivery
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Configurar Nueva Zona de Delivery
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Formulario */}
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
                          setIsLoadingMap(true)
                          const loader = GoogleMapsLoader.getInstance()
                          loader.load(() => {
                            try {
                              initializeMap()
                              setIsLoadingMap(false)
                            } catch (error) {
                              console.error("Error initializing map:", error)
                              setMapError("Error initializing map")
                              setIsLoadingMap(false)
                            }
                          })
                        }}
                      >
                        Reintentar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div ref={mapRef} className="w-full h-96 rounded-lg border" />
                    {isLoadingMap && (
                      <div className="flex items-center justify-center h-96 bg-muted rounded-lg absolute inset-0">
                        <div className="text-center space-y-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                          <p>Cargando mapa...</p>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <p className="text-sm text-muted-foreground">
                  Usa las herramientas del mapa para dibujar polígonos o círculos que representen tu zona de delivery.
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
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: zone.color }} />
                    <div>
                      <h4 className="font-medium">{zone.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ${zone.price.toLocaleString()} • {zone.estimatedTime}
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
              Editando: {editingZoneData.name}
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
