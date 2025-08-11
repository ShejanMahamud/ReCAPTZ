import { ReCAPTZClient } from "./recaptzClient";

interface CaptchaModeConfig {
  mode: "auto" | "client" | "server";
  serverEndpoint?: string;
  fallbackToClient?: boolean;
}

class CaptchaModeManager {
  private mode: "client" | "server" = "client";
  private serverClient: ReCAPTZClient | null = null;
  private isServerAvailable: boolean = false;
  private lastHealthCheck: number = 0;
  private healthCheckInterval: number = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.detectMode();
  }

  private async detectMode(): Promise<void> {
    // Check for environment variables that indicate server mode
    const serverEndpoints = [
      // Environment variable patterns
      typeof window !== "undefined" && (window as any).RECAPTZ_API_URL,
      typeof process !== "undefined" &&
        process.env.import.meta.env.VITE_SERVER_URL,
      typeof process !== "undefined" && process.env.NEXT_PUBLIC_RECAPTZ_API_URL,
      typeof process !== "undefined" && process.env.VITE_RECAPTZ_API_URL,
      // Environment variable from .env
      import.meta.env.VITE_SERVER_URL,
    ].filter(Boolean);

    // Try to find a working server endpoint
    for (const endpoint of serverEndpoints) {
      if (await this.testServerEndpoint(endpoint as string)) {
        this.mode = "server";
        this.serverClient = new ReCAPTZClient({
          baseUrl: endpoint as string,
          timeout: 10000,
          retries: 2,
          debug: false, // Keep debug off for auto-detection
        });
        this.isServerAvailable = true;
        // Remove endpoint logging for security
        if (import.meta.env.DEV) {
          console.info("ReCAPTZ: Server mode enabled");
        }
        return;
      }
    }

    // Fallback to client mode
    this.mode = "client";
    if (import.meta.env.DEV) {
      console.info("ReCAPTZ: Client mode enabled (no server detected)");
    }
  }

  private async testServerEndpoint(endpoint: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${endpoint}/health`, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      clearTimeout(timeout);
      return response.ok;
    } catch {
      return false;
    }
  }

  async getCurrentMode(): Promise<"client" | "server"> {
    // Periodically check server health if we're in server mode
    if (
      this.mode === "server" &&
      Date.now() - this.lastHealthCheck > this.healthCheckInterval
    ) {
      this.lastHealthCheck = Date.now();
      if (this.serverClient) {
        try {
          await this.serverClient.checkHealth();
          this.isServerAvailable = true;
        } catch {
          this.isServerAvailable = false;
          console.warn(
            "ReCAPTZ: Server became unavailable, falling back to client mode"
          );
        }
      }
    }

    // Return appropriate mode based on availability
    if (this.mode === "server" && this.isServerAvailable) {
      return "server";
    }
    return "client";
  }

  getServerClient(): ReCAPTZClient | null {
    if (this.mode === "server" && this.isServerAvailable) {
      return this.serverClient;
    }
    return null;
  }

  // Allow manual override for advanced users
  setMode(mode: "client" | "server", endpoint?: string): void {
    this.mode = mode;
    if (mode === "server" && endpoint) {
      this.serverClient = new ReCAPTZClient({
        baseUrl: endpoint,
        timeout: 30000,
        retries: 3,
        debug: false,
      });
      this.isServerAvailable = true;
    } else if (mode === "client") {
      this.serverClient = null;
      this.isServerAvailable = false;
    }
  }

  // Force refresh of mode detection
  async refreshModeDetection(): Promise<void> {
    await this.detectMode();
  }
}

// Singleton instance
const modeManager = new CaptchaModeManager();

export { modeManager };
export type { CaptchaModeConfig };
