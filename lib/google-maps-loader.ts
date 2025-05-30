declare global {
  interface Window {
    google: any
    googleMapsInitialized: boolean
  }
}

type GoogleMapsCallback = () => void

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoading = false
  private isLoaded = false
  private callbacks: GoogleMapsCallback[] = []
  private readonly apiKey = "AIzaSyCZukkglTPUl6jm2sBfgxikMjlFKwyp5jY"

  private constructor() {}

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  load(callback: GoogleMapsCallback): void {
    // If already loaded, call callback immediately
    if (this.isLoaded && window.google && window.google.maps && window.google.maps.drawing) {
      callback()
      return
    }

    // Add callback to queue
    this.callbacks.push(callback)

    // If already loading, just wait
    if (this.isLoading) {
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // Script exists but might not be fully loaded
      this.waitForGoogleMaps(callback)
      return
    }

    // Start loading
    this.isLoading = true
    this.loadScript()
  }

  private loadScript(): void {
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing,geometry&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Set up global callback
    window.initGoogleMaps = () => {
      this.isLoaded = true
      this.isLoading = false
      window.googleMapsInitialized = true

      // Call all pending callbacks
      this.callbacks.forEach((callback) => {
        try {
          callback()
        } catch (error) {
          console.error("Error in Google Maps callback:", error)
        }
      })

      // Clear callbacks
      this.callbacks = []
    }

    script.onerror = () => {
      this.isLoading = false
      console.error("Failed to load Google Maps")
    }

    document.head.appendChild(script)
  }

  private waitForGoogleMaps(callback: GoogleMapsCallback): void {
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.drawing) {
        clearInterval(checkInterval)
        this.isLoaded = true
        this.isLoading = false
        callback()
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!this.isLoaded) {
        console.error("Timeout waiting for Google Maps to load")
      }
    }, 10000)
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && window.google && window.google.maps && window.google.maps.drawing
  }
}

export default GoogleMapsLoader
