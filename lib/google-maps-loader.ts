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
  private scriptElement: HTMLScriptElement | null = null

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

    // Check if Google Maps is already available but not marked as loaded
    if (window.google && window.google.maps && window.google.maps.drawing) {
      console.log("Google Maps found in window, marking as loaded")
      this.isLoaded = true
      this.executeCallbacks()
      return
    }

    // Check if script already exists in DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement
    if (existingScript) {
      console.log("Google Maps script already exists, waiting for initialization")
      this.scriptElement = existingScript
      this.waitForGoogleMaps()
      return
    }

    // Start loading fresh
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

    // Check again if script was added by another component
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]') as HTMLScriptElement
    if (existingScript) {
      console.log("Script was added by another component, using existing one")
      this.scriptElement = existingScript
      this.waitForGoogleMaps()
      return
    }

    this.loadAttempts++
    console.log(`Loading Google Maps (attempt ${this.loadAttempts}/${this.maxAttempts})`)

    // Create unique callback name to avoid conflicts
    const callbackName = `initGoogleMaps_${Date.now()}`

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing,geometry&callback=${callbackName}`
    script.async = true
    script.defer = true
    script.id = "google-maps-script"(
      // Set up global callback with unique name
      window as any,
    )[callbackName] = () => {
      console.log("Google Maps initialized successfully")
      this.isLoaded = true
      this.isLoading = false
      window.googleMapsInitialized = true

      // Execute all pending callbacks
      this.executeCallbacks()

      // Clean up the callback function
      delete (window as any)[callbackName]
    }

    script.onerror = (error) => {
      console.error("Failed to load Google Maps script:", error)
      this.handleLoadError("Script load failed")
      // Clean up failed script
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      delete (window as any)[callbackName]
    }

    script.onload = () => {
      console.log("Google Maps script loaded, waiting for initialization...")
    }

    this.scriptElement = script
    document.head.appendChild(script)

    // Set timeout for this attempt
    setTimeout(() => {
      if (!this.isLoaded) {
        console.warn(`Google Maps load attempt ${this.loadAttempts} timed out`)
        if (this.loadAttempts < this.maxAttempts) {
          // Remove failed script and try again
          if (this.scriptElement && this.scriptElement.parentNode) {
            this.scriptElement.parentNode.removeChild(this.scriptElement)
          }
          delete (window as any)[callbackName]
          this.isLoading = false
          setTimeout(() => this.loadScript(), 1000) // Retry after 1 second
        } else {
          this.handleLoadError("All attempts timed out")
        }
      }
    }, 15000) // 15 seconds timeout
  }

  private waitForGoogleMaps(): void {
    let attempts = 0
    const maxWaitAttempts = 150 // 15 seconds with 100ms intervals

    const checkInterval = setInterval(() => {
      attempts++
      if (window.google && window.google.maps && window.google.maps.drawing) {
        clearInterval(checkInterval)
        console.log("Google Maps found after waiting")
        this.isLoaded = true
        this.isLoading = false
        this.executeCallbacks()
      } else if (attempts >= maxWaitAttempts) {
        clearInterval(checkInterval)
        console.error("Timeout waiting for existing Google Maps script to initialize")
        this.handleLoadError("Existing script timeout")
      }
    }, 100)
  }

  private executeCallbacks(): void {
    // Call all pending callbacks
    const callbacksToExecute = [...this.callbacks]
    this.callbacks = [] // Clear callbacks before executing to prevent issues

    callbacksToExecute.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error("Error in Google Maps callback:", error)
      }
    })
  }

  private handleLoadError(reason: string): void {
    this.isLoading = false
    console.error(`Google Maps loading failed: ${reason}`)

    // Clear callbacks without executing them
    this.callbacks = []
  }

  isGoogleMapsLoaded(): boolean {
    return this.isLoaded && window.google && window.google.maps && window.google.maps.drawing
  }

  // Method to check if API key is configured
  isApiKeyConfigured(): boolean {
    return this.apiKey !== "YOUR_API_KEY_HERE" && this.apiKey.length > 0
  }

  // Method to reset the loader state (useful for testing or cleanup)
  reset(): void {
    this.isLoaded = false
    this.isLoading = false
    this.callbacks = []
    this.loadAttempts = 0

    // Remove script if it exists
    if (this.scriptElement && this.scriptElement.parentNode) {
      this.scriptElement.parentNode.removeChild(this.scriptElement)
    }
    this.scriptElement = null

    // Clean up window properties
    if (window.googleMapsInitialized) {
      delete window.googleMapsInitialized
    }
  }
}

export default GoogleMapsLoader
