"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Save, X, Plus, MapPin } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

declare global {
  interface Window {
    google: any
    initGoogleMaps: () => void
  }
}

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

  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const drawingManagerRef = useRef<any>(null)
  const polygonsRef = useRef<Map<string, any>>(new Map())
  const storeMarkerRef = useRef<any>(null)

  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.drawing) {
      loadGoogleMaps()
    } else {
      initializeMap()
    }

    // Cleanup function
    return () => {
      // Don't remove the script as it might be used by other components
      // Just clean up our callback to prevent memory leaks
      if (window.initGoogleMaps) {
        window.initGoogleMaps = () => {}
      }

      // Clean up map instances
      if (mapInstanceRef.current) {
        // Remove all event listeners and overlays
        if (drawingManagerRef.current) {
          drawingManagerRef.current.setMap(null)
        }

        // Clear all polygons
        polygonsRef.current.forEach((polygon) => {
          polygon.setMap(null)
        })

        // Clear store marker
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

  const loadGoogleMaps = () => {
    // Check if script is already in the document
    const existingScript = document.getElementById("google-maps-script")
    if (existingScript) {
      // If script exists but callback hasn't been triggered yet, set it again
      if (window.google && window.google.maps && window.google.maps.drawing) {
        initializeMap()
      }
      return
    }

    // Add global callback if it doesn't exist
    if (!window.initGoogleMaps) {
      window.initGoogleMaps = () => {
        initializeMap()
      }
    }

    const script = document.createElement("script")
    script.id = "google-maps-script" // Add an ID to identify the script
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCZukkglTPUl6jm2sBfgxikMjlFKwyp5jY&libraries=drawing,geometry&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    script.onerror = () => {
      toast({
        title: "Error al cargar el mapa",
        description: "No se pudo cargar Google Maps",
        variant: "destructive",
      })
    }

    document.head.appendChild(script)
  }

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

    // Drawing Manager - check if drawing library is available
    if (window.google.maps.drawing && window.google.maps.drawing.DrawingManager) {
      drawingManagerRef.current = new window.google.maps.drawing.DrawingManager({
        drawingMode: null,
        drawingControl: true,
        drawingControlOptions: {
          position: window.google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [window.google.maps.drawing.OverlayType.POLYGON],
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
      })

      drawingManagerRef.current.setMap(mapInstanceRef.current)

      // Evento cuando se completa un polígono
      drawingManagerRef.current.addListener("polygoncomplete", (polygon: any) => {
        handlePolygonComplete(polygon)
      })
    } else {
      console.error("Google Maps Drawing library not available")
      toast({
        title: "Error",
        description: "La biblioteca de dibujo de Google Maps no está disponible",
        variant: "destructive",
      })
    }

    setIsMapLoaded(true)
  }

  const handlePolygonComplete = (polygon: any) => {
    const path = polygon.getPath()
    const coordinates: Array<{ lat: number; lng: number }> = []

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i)
      coordinates.push({ lat: point.lat(), lng: point.lng() })
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

    // Guardar referencia del polígono
    polygonsRef.current.set(newZone.id, polygon)

    // Agregar evento de clic al polígono
    polygon.addListener("click", () => {
      setEditingZone(newZone.id)
    })

    // Actualizar zonas
    const updatedZones = [...zones, newZone]
    onZonesChange(updatedZones)

    // Limpiar formulario
    setNewZoneName("")
    setNewZonePrice("")
    setNewZoneTime("")

    // Desactivar modo de dibujo
    drawingManagerRef.current.setDrawingMode(null)

    toast({
      title: "Zona creada",
      description: `Zona "${newZone.name}" agregada correctamente`,
    })
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

  const startDrawing = () => {
    if (drawingManagerRef.current && window.google && window.google.maps && window.google.maps.drawing) {
      drawingManagerRef.current.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON)
    } else {
      toast({
        title: "Error",
        description: "El modo de dibujo no está disponible",
        variant: "destructive",
      })
    }
  }

  const editingZoneData = zones.find((zone) => zone.id === editingZone)

  return (
    <div className="space-y-6">
      {/* Formulario para nueva zona */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Configurar Nueva Zona
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button onClick={startDrawing} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Dibujar Nueva Zona en el Mapa
          </Button>
        </CardContent>
      </Card>

      {/* Mapa */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Zonas de Delivery</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={mapRef} className="w-full h-96 rounded-lg" />
          {!isMapLoaded && (
            <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
              <p>Cargando mapa...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de zonas */}
      <Card>
        <CardHeader>
          <CardTitle>Zonas Configuradas ({zones.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {zones.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay zonas configuradas. Dibuja una zona en el mapa para comenzar.
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
