class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoaded = false
  private isLoading = false
  private callbacks: (() => void)[] = []
  private apiKey: string | null = null

  private constructor() {
    // Get API key from environment variable
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || null
  }

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  isApiKeyConfigured(): boolean {
    return this.apiKey !== null && this.apiKey.trim() !== ""
  }

  load(callback?: () => void): void {
    if (!this.isApiKeyConfigured()) {
      console.error("Google Maps API key is not configured")
      return
    }

    if (callback) {
      this.callbacks.push(callback)
    }

    if (this.isLoaded) {
      this.executeCallbacks()
      return
    }

    if (this.isLoading) {
      return
    }

    this.isLoading = true

    // Create script element
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing&loading=async`
    script.async = true
    script.defer = true

    script.onload = () => {
      this.isLoaded = true
      this.isLoading = false
      this.executeCallbacks()
    }

    script.onerror = (error) => {
      console.error("Error loading Google Maps API:", error)
      this.isLoading = false
    }

    document.head.appendChild(script)
  }

  private executeCallbacks(): void {
    this.callbacks.forEach((callback) => callback())
    this.callbacks = []
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && typeof window !== "undefined" && window.google && window.google.maps
  }
}

export default GoogleMapsLoader
