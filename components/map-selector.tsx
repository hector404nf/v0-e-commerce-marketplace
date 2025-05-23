"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface MapSelectorProps {
  onLocationSelect: (coordinates: [number, number]) => void
  initialLocation?: [number, number]
}

export default function MapSelector({ onLocationSelect, initialLocation }: MapSelectorProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>(initialLocation || [40.4168, -3.7038]) // Default: Madrid
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Si hay una ubicación inicial, usarla
    if (initialLocation) {
      setCoordinates(initialLocation)
    } else {
      // Intentar obtener la ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newCoords: [number, number] = [position.coords.latitude, position.coords.longitude]
            setCoordinates(newCoords)
            onLocationSelect(newCoords)
          },
          (error) => {
            console.error("Error getting location:", error)
          },
        )
      }
    }
  }, [initialLocation, onLocationSelect])

  const handleMapClick = () => {
    // Mostrar instrucciones para seleccionar ubicación
    alert("Para seleccionar una ubicación, haz clic en el mapa y luego usa el botón 'Seleccionar esta ubicación'")
  }

  const handleManualLocationSelect = () => {
    // Simulamos una selección manual de ubicación
    // En una implementación real, esto vendría de un evento del mapa
    const newLat = Number.parseFloat(prompt("Introduce la latitud (ej: 40.4168)") || "40.4168")
    const newLng = Number.parseFloat(prompt("Introduce la longitud (ej: -3.7038)") || "-3.7038")

    if (!isNaN(newLat) && !isNaN(newLng)) {
      const newCoords: [number, number] = [newLat, newLng]
      setCoordinates(newCoords)
      onLocationSelect(newCoords)
    }
  }

  if (!isClient) {
    return <div className="h-64 bg-muted rounded-lg animate-pulse" />
  }

  // Construir la URL de OpenStreetMap
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${coordinates[1] - 0.01}%2C${coordinates[0] - 0.01}%2C${coordinates[1] + 0.01}%2C${coordinates[0] + 0.01}&layer=mapnik&marker=${coordinates[0]}%2C${coordinates[1]}`

  return (
    <div className="space-y-2">
      <div className="h-64 w-full rounded-lg overflow-hidden border">
        <iframe
          title="OpenStreetMap"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          onClick={handleMapClick}
          style={{ pointerEvents: "none" }} // Desactivar interacciones con el iframe
        />
      </div>
      <div className="flex flex-col space-y-2">
        <div className="text-sm">
          <span className="font-medium">Coordenadas seleccionadas:</span> {coordinates[0].toFixed(6)},{" "}
          {coordinates[1].toFixed(6)}
        </div>
        <Button onClick={handleManualLocationSelect}>Seleccionar ubicación manualmente</Button>
      </div>
    </div>
  )
}

// Componente Button simplificado para evitar dependencias
function Button({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
