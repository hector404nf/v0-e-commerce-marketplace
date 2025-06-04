declare global {
  interface Window {
    google: any
    googleMapsInitialized: boolean
    initGoogleMaps: () => void
  }
}

type GoogleMapsCallback = () => void

class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoading = false
  private isLoaded = false
  private callbacks: GoogleMapsCallback[] = []
  private readonly apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE"
  private loadAttempts = 0
  private maxAttempts = 3

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
      console.log("Google Maps already loaded, calling callback immediately")
      callback()
      return
    }

    // Add callback to queue
    this.callbacks.push(callback)

    // If already loading, just wait
    if (this.isLoading) {
      console.log("Google Maps already loading, waiting...")
      return
    }

    // Check if script already exists but Google Maps is not fully initialized
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript && !window.google?.maps?.drawing) {
      console.log("Google Maps script exists but not fully initialized, removing and reloading")
      existingScript.remove()
    }

    // Start loading
    this.isLoading = true
    this.loadAttempts = 0
    this.loadScript()
  }

  private loadScript(): void {
    if (this.loadAttempts >= this.maxAttempts) {
      console.error("Max attempts reached for loading Google Maps")
      this.handleLoadError("Max attempts reached")
      return
    }

    this.loadAttempts++
    console.log(`Loading Google Maps (attempt ${this.loadAttempts}/${this.maxAttempts})`)

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing,geometry&callback=initGoogleMaps`
    script.async = true
    script.defer = true

    // Set up global callback
    window.initGoogleMaps = () => {
      console.log("Google Maps initialized successfully")
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

    script.onerror = (error) => {
      console.error("Failed to load Google Maps script:", error)
      this.handleLoadError("Script load failed")
    }

    script.onload = () => {
      console.log("Google Maps script loaded, waiting for initialization...")
    }

    document.head.appendChild(script)

    // Set timeout for this attempt
    setTimeout(() => {
      if (!this.isLoaded) {
        console.warn(`Google Maps load attempt ${this.loadAttempts} timed out`)
        if (this.loadAttempts < this.maxAttempts) {
          // Remove failed script and try again
          const failedScript = document.querySelector(`script[src*="maps.googleapis.com"]`)
          if (failedScript) {
            failedScript.remove()
          }
          this.isLoading = false
          setTimeout(() => this.loadScript(), 1000) // Retry after 1 second
        } else {
          this.handleLoadError("All attempts timed out")
        }
      }
    }, 15000) // Increased timeout to 15 seconds
  }

  private waitForGoogleMaps(): void {
    let attempts = 0
    const maxWaitAttempts = 100 // 10 seconds with 100ms intervals

    const checkInterval = setInterval(() => {
      attempts++
      if (window.google && window.google.maps && window.google.maps.drawing) {
        clearInterval(checkInterval)
        this.isLoaded = true
        this.isLoading = false

        // Call all pending callbacks
        this.callbacks.forEach((callback) => {
          try {
            callback()
          } catch (error) {
            console.error("Error in Google Maps callback:", error)
          }
        })
        this.callbacks = []
      } else if (attempts >= maxWaitAttempts) {
        clearInterval(checkInterval)
        console.error("Timeout waiting for existing Google Maps script to initialize")
        this.handleLoadError("Existing script timeout")
      }
    }, 100)
  }

  private handleLoadError(reason: string): void {
    this.isLoading = false
    console.error(`Google Maps loading failed: ${reason}`)

    // Call callbacks with error indication
    this.callbacks.forEach((callback) => {
      try {
        // You could modify callbacks to accept an error parameter
        console.error("Google Maps failed to load, callback not executed")
      } catch (error) {
        console.error("Error handling Google Maps load failure:", error)
      }
    })

    this.callbacks = []
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && window.google && window.google.maps && window.google.maps.drawing
  }

  // Method to check if API key is configured
  isApiKeyConfigured(): boolean {
    return this.apiKey !== "YOUR_API_KEY_HERE" && this.apiKey.length > 0
  }
}

export default GoogleMapsLoader
