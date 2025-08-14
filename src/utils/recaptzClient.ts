import {
  CaptchaType,
  ReCAPTZConfig,
  ServerCaptchaAudio,
  ServerCaptchaSession,
  ServerCaptchaVerification,
} from "../types";

export class CaptchaError extends Error {
  constructor(
    message: string,
    public type: string,
    public details?: unknown,
    public severity: "low" | "medium" | "high" = "medium",
    public retryable = true
  ) {
    super(message);
    this.name = "CaptchaError";
  }
}

export class ReCAPTZClient {
  private baseUrl: string;
  private timeout: number;
  private retries: number;
  private debug: boolean;

  constructor(config: ReCAPTZConfig) {
    this.baseUrl = config.baseUrl;
    this.timeout = config.timeout || 30000;
    this.retries = config.retries || 3;
    this.debug = config.debug || false;
  }

  async generate(
    options: {
      type?: CaptchaType;
      length?: number;
      caseSensitive?: boolean;
      maxAttempts?: number;
      expiryMinutes?: number;
      enableAudio?: boolean;
      showSuccessAnimation?: boolean;
      showConfetti?: boolean;
      darkMode?: boolean;
      rtl?: boolean;
      refreshable?: boolean;
      autoFocus?: boolean;
    } = {}
  ): Promise<ServerCaptchaSession> {
    try {
      return await this.makeRequest("/captcha/generate", {
        method: "POST",
        body: JSON.stringify({
          type: options.type || "mixed",
          length: options.length || 6,
          caseSensitive: options.caseSensitive || false,
          maxAttempts: options.maxAttempts || 3,
          expiryMinutes: options.expiryMinutes || 10,
          enableAudio: options.enableAudio !== false,
          showSuccessAnimation: options.showSuccessAnimation !== false,
          showConfetti: options.showConfetti || false,
          darkMode: options.darkMode || false,
          rtl: options.rtl || false,
          refreshable: options.refreshable !== false,
          autoFocus: options.autoFocus !== false,
        }),
      });
    } catch (error) {
      if (error instanceof CaptchaError) {
        throw error;
      }
      throw new CaptchaError(
        "Unable to generate CAPTCHA. Please try again.",
        "GenerationFailed",
        error,
        "medium",
        true
      );
    }
  }

  async verify(
    sessionToken: string,
    userResponse: string,
    metadata: {
      timeTaken?: number;
      fingerprint?: string;
      attempts?: number;
      difficulty?: number;
      inputMethod?: string;
      focusTime?: number;
    } = {}
  ): Promise<ServerCaptchaVerification> {
    try {
      return await this.makeRequest("/captcha/verify", {
        method: "POST",
        body: JSON.stringify({
          sessionToken,
          userResponse,
          timeTaken: metadata.timeTaken || 0,
          fingerprint: metadata.fingerprint || "",
          clientMetadata: {
            attempts: metadata.attempts || 1,
            difficulty: metadata.difficulty || 5,
            inputMethod: metadata.inputMethod || "keyboard",
            focusTime: metadata.focusTime || 0,
          },
        }),
      });
    } catch (error) {
      if (error instanceof CaptchaError) {
        throw error;
      }
      throw new CaptchaError(
        "Verification failed. Please check your input and try again.",
        "VerificationFailed",
        error,
        "low",
        true
      );
    }
  }

  async refresh(
    sessionToken: string,
    options: {
      type?: CaptchaType;
      length?: number;
      increaseDifficulty?: boolean;
      reason?: string;
    } = {}
  ): Promise<ServerCaptchaSession> {
    try {
      return await this.makeRequest("/captcha/refresh", {
        method: "POST",
        body: JSON.stringify({
          sessionToken,
          type: options.type,
          length: options.length,
          increaseDifficulty: options.increaseDifficulty || false,
          reason: options.reason || "manual",
        }),
      });
    } catch (error) {
      if (error instanceof CaptchaError) {
        throw error;
      }
      throw new CaptchaError(
        "Unable to refresh CAPTCHA. Generating a new one instead.",
        "RefreshFailed",
        error,
        "low",
        true
      );
    }
  }

  async getAudio(
    sessionToken: string,
    options: {
      language?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      spellOut?: boolean;
    } = {}
  ): Promise<ServerCaptchaAudio> {
    try {
      return await this.makeRequest("/captcha/audio", {
        method: "POST",
        body: JSON.stringify({
          sessionToken,
          language: options.language || "en",
          rate: options.rate || 1,
          pitch: options.pitch || 1,
          volume: options.volume || 1,
          spellOut: options.spellOut !== false,
        }),
      });
    } catch (error) {
      if (error instanceof CaptchaError) {
        throw error;
      }
      throw new CaptchaError(
        "Audio is temporarily unavailable. Using fallback audio.",
        "AudioFailed",
        error,
        "low",
        true
      );
    }
  }

  async getStatus(sessionToken: string): Promise<ServerCaptchaSession> {
    try {
      return await this.makeRequest(`/captcha/status/${sessionToken}`);
    } catch (error) {
      if (error instanceof CaptchaError) {
        throw error;
      }
      throw new CaptchaError(
        "Unable to check session status.",
        "StatusFailed",
        error,
        "low",
        true
      );
    }
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    try {
      return await this.makeRequest("/health");
    } catch (error) {
      throw new CaptchaError(
        "Server health check failed. Server may be temporarily unavailable.",
        "HealthCheckFailed",
        error,
        "high",
        true
      );
    }
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...((options.headers as Record<string, string>) || {}),
      },
      ...options,
    };

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
          await this.handleApiError(response);
        }

        return await response.json();
      } catch (error) {
        lastError = error as Error;

        // Don't retry certain types of errors
        if (error instanceof CaptchaError && !error.retryable) {
          throw error;
        }

        if (attempt === this.retries) {
          // Handle different types of final errors
          if (error instanceof TypeError && error.message.includes("fetch")) {
            throw new CaptchaError(
              "Unable to connect to server. Please check your internet connection.",
              "NetworkError",
              error,
              "high",
              true
            );
          } else if (error instanceof Error && error.name === "AbortError") {
            throw new CaptchaError(
              "Request timed out. Please try again.",
              "TimeoutError",
              error,
              "medium",
              true
            );
          }
          throw error;
        }

        // Calculate progressive delay with jitter
        const baseDelay = Math.pow(2, attempt - 1) * 1000;
        const jitter = Math.random() * 0.1 * baseDelay;
        const delay = baseDelay + jitter;

        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    // This should never be reached, but just in case
    throw lastError || new Error("Unknown error occurred");
  }

  private async handleApiError(response: Response): Promise<never> {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: "Server error occurred" };
    }

    const retryAfter = response.headers.get("Retry-After");

    switch (response.status) {
      case 400:
        throw new CaptchaError(
          errorData.message || "Invalid request. Please check your input.",
          "ValidationError",
          errorData.details,
          "low",
          false
        );
      case 401:
        throw new CaptchaError(
          "Authentication required. Please refresh and try again.",
          "AuthenticationError",
          errorData,
          "medium",
          true
        );
      case 403:
        throw new CaptchaError(
          "Access denied. Your IP may be temporarily blocked.",
          "ForbiddenError",
          errorData,
          "high",
          false
        );
      case 404:
        throw new CaptchaError(
          "Session expired or not found. A new CAPTCHA will be generated.",
          "NotFound",
          errorData,
          "low",
          true
        );
      case 422:
        throw new CaptchaError(
          errorData.message || "CAPTCHA verification failed. Please try again.",
          "VerificationFailed",
          errorData,
          "low",
          true
        );
      case 429:
        const waitTime = retryAfter ? `${retryAfter} seconds` : "a moment";
        throw new CaptchaError(
          `Too many requests. Please wait ${waitTime} before trying again.`,
          "RateLimited",
          { retryAfter: parseInt(retryAfter || "60") },
          "medium",
          true
        );
      case 500:
        throw new CaptchaError(
          "Server is experiencing issues. Please try again in a moment.",
          "ServerError",
          errorData,
          "high",
          true
        );
      case 502:
      case 503:
        throw new CaptchaError(
          "Service temporarily unavailable. Please try again shortly.",
          "ServiceUnavailable",
          errorData,
          "high",
          true
        );
      case 504:
        throw new CaptchaError(
          "Request timed out. Please try again.",
          "GatewayTimeout",
          errorData,
          "medium",
          true
        );
      default:
        throw new CaptchaError(
          "An unexpected error occurred. Please try again.",
          "UnknownError",
          errorData,
          "medium",
          true
        );
    }
  }
}

// Default client instance
let defaultClient: ReCAPTZClient | null = null;

// Official ReCAPTZ server endpoint
const DEFAULT_SERVER_URL = "https://recaptz-server.vercel.app/api";

export const getDefaultClient = (): ReCAPTZClient => {
  if (!defaultClient) {
    // Get server URL from runtime environment instead of build-time
    const getServerUrl = (): string => {
      // Check various environment variable sources at runtime
      if (typeof window !== "undefined") {
        const windowObj = window as unknown as Record<string, unknown>;
        if (
          windowObj.RECAPTZ_API_URL &&
          typeof windowObj.RECAPTZ_API_URL === "string"
        ) {
          return windowObj.RECAPTZ_API_URL;
        }
      }

      // Return official server as default
      return DEFAULT_SERVER_URL;
    };

    // Check if we're in development mode
    const isDev = (): boolean => {
      try {
        // Check for development indicators
        if (typeof window !== "undefined") {
          const windowObj = window as unknown as Record<string, unknown>;
          return Boolean(windowObj.__DEV__ || windowObj.webpackHotUpdate);
        }
        return false;
      } catch {
        return false;
      }
    };

    defaultClient = new ReCAPTZClient({
      baseUrl: getServerUrl(),
      debug: isDev(),
    });
  }
  return defaultClient;
};

export const setDefaultClient = (client: ReCAPTZClient): void => {
  defaultClient = client;
};
