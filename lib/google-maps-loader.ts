class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoaded = false
  private isLoading = false
  private callbacks: Array<() => void> = []
  private apiKey: string
  private retryCount = 0
  private maxRetries = 3

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "AIzaSyCZukkglTPUl6jm2sBfgxikMjlFKwyp5jY"
  }

  static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  isApiKeyConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== "your_api_key_here"
  }

  load(callback: () => void): void {
    if (this.isLoaded && window.google && window.google.maps && window.google.maps.drawing) {
      callback()
      return
    }

    this.callbacks.push(callback)

    if (this.isLoading) {
      return
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
    if (existingScript) {
      // Script exists, check if it's loaded
      if (window.google && window.google.maps && window.google.maps.drawing) {
        this.isLoaded = true
        this.executeCallbacks()
        return
      } else {
        // Script exists but not loaded, wait for it
        this.waitForGoogleMaps()
        return
      }
    }

    this.isLoading = true
    this.loadScript()
  }

  private loadScript(): void {
    const callbackName = `initGoogleMaps_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Set global callback
    ;(window as any)[callbackName] = () => {
      this.isLoaded = true
      this.isLoading = false
      this.retryCount = 0
      this.executeCallbacks()

      // Clean up callback
      delete (window as any)[callbackName]
    }

    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing&callback=${callbackName}`
    script.async = true
    script.defer = true

    script.onerror = () => {
      this.isLoading = false
      console.error("Failed to load Google Maps script")

      if (this.retryCount < this.maxRetries) {
        this.retryCount++
        console.log(`Retrying Google Maps load (${this.retryCount}/${this.maxRetries})`)
        setTimeout(() => {
          // Remove failed script
          const failedScript = document.getElementById("google-maps-script")
          if (failedScript) {
            failedScript.remove()
          }
          this.loadScript()
        }, 1000 * this.retryCount)
      } else {
        this.executeCallbacks(new Error("Failed to load Google Maps after multiple attempts"))
      }

      // Clean up callback
      delete (window as any)[callbackName]
    }

    // Set timeout for loading
    const timeout = setTimeout(() => {
      if (!this.isLoaded) {
        console.error("Timeout waiting for Google Maps to load")
        this.isLoading = false

        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          console.log(`Retrying Google Maps load due to timeout (${this.retryCount}/${this.maxRetries})`)
          script.remove()
          delete (window as any)[callbackName]
          setTimeout(() => this.loadScript(), 1000 * this.retryCount)
        } else {
          this.executeCallbacks(new Error("Timeout waiting for Google Maps to load"))
        }
      }
    }, 15000) // 15 second timeout

    // Clear timeout when script loads successfully
    const originalCallback = (window as any)[callbackName]
    ;(window as any)[callbackName] = () => {
      clearTimeout(timeout)
      originalCallback()
    }

    document.head.appendChild(script)
  }

  private waitForGoogleMaps(): void {
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.drawing) {
        clearInterval(checkInterval)
        this.isLoaded = true
        this.executeCallbacks()
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!this.isLoaded) {
        this.executeCallbacks(new Error("Timeout waiting for existing Google Maps script"))
      }
    }, 10000)
  }

  private executeCallbacks(error?: Error): void {
    const callbacks = [...this.callbacks]
    this.callbacks = []

    callbacks.forEach((callback) => {
      try {
        if (!error) {
          callback()
        }
      } catch (err) {
        console.error("Error executing Google Maps callback:", err)
      }
    })
  }
}

export default GoogleMapsLoader
