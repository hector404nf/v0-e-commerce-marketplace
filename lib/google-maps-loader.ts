class GoogleMapsLoader {
  private static instance: GoogleMapsLoader
  private isLoaded = false
  private isLoading = false
  private callbacks: Array<() => void> = []
  private apiKey: string
  private retryCount = 0
  private maxRetries = 3
  private retryDelay = 1000

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  }

  public static getInstance(): GoogleMapsLoader {
    if (!GoogleMapsLoader.instance) {
      GoogleMapsLoader.instance = new GoogleMapsLoader()
    }
    return GoogleMapsLoader.instance
  }

  public isApiKeyConfigured(): boolean {
    return this.apiKey.length > 0
  }

  public load(callback: () => void): void {
    if (this.isLoaded && window.google && window.google.maps && window.google.maps.drawing) {
      callback()
      return
    }

    this.callbacks.push(callback)

    if (this.isLoading) {
      return
    }

    this.loadScript()
  }

  private loadScript(): void {
    // Check if script already exists
    const existingScript = document.getElementById("google-maps-script")
    if (existingScript) {
      // Script exists, check if it's loaded
      if (window.google && window.google.maps && window.google.maps.drawing) {
        this.handleScriptLoad()
        return
      } else {
        // Script exists but not loaded, wait for it
        this.waitForGoogleMaps()
        return
      }
    }

    this.isLoading = true

    const script = document.createElement("script")
    script.id = "google-maps-script"
    script.type = "text/javascript"
    script.async = true
    script.defer = true

    // Create unique callback name
    const callbackName = `initGoogleMaps_${Date.now()}`

    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}&libraries=drawing&callback=${callbackName}`

    // Set up global callback
    ;(window as any)[callbackName] = () => {
      this.handleScriptLoad()
      // Clean up callback
      delete (window as any)[callbackName]
    }

    script.onerror = () => {
      console.error("Failed to load Google Maps script")
      this.handleScriptError()
      // Clean up callback
      delete (window as any)[callbackName]
    }

    document.head.appendChild(script)

    // Set timeout for loading
    setTimeout(() => {
      if (!this.isLoaded) {
        console.error("Timeout waiting for Google Maps to load")
        this.handleScriptError()
      }
    }, 15000) // 15 second timeout
  }

  private waitForGoogleMaps(): void {
    const checkInterval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.drawing) {
        clearInterval(checkInterval)
        this.handleScriptLoad()
      }
    }, 100)

    // Timeout after 10 seconds
    setTimeout(() => {
      clearInterval(checkInterval)
      if (!this.isLoaded) {
        this.handleScriptError()
      }
    }, 10000)
  }

  private handleScriptLoad(): void {
    this.isLoaded = true
    this.isLoading = false
    this.retryCount = 0

    // Execute all callbacks
    this.callbacks.forEach((callback) => {
      try {
        callback()
      } catch (error) {
        console.error("Error executing Google Maps callback:", error)
      }
    })
    this.callbacks = []
  }

  private handleScriptError(): void {
    this.isLoading = false

    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      console.log(`Retrying Google Maps load (attempt ${this.retryCount}/${this.maxRetries})`)

      setTimeout(() => {
        // Remove existing script if it exists
        const existingScript = document.getElementById("google-maps-script")
        if (existingScript) {
          existingScript.remove()
        }
        this.loadScript()
      }, this.retryDelay * this.retryCount)
    } else {
      console.error("Max retries reached for Google Maps loading")
      // Execute callbacks with error state
      this.callbacks.forEach((callback) => {
        try {
          callback()
        } catch (error) {
          console.error("Error executing Google Maps callback after error:", error)
        }
      })
      this.callbacks = []
    }
  }
}

export default GoogleMapsLoader
