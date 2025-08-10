// src/services/http.ts
export interface ApiError {
  error: string;
  message: string;
  details?: string;
}

export class HttpError extends Error {
  public status: number;
  public error: string;
  public details?: string;

  constructor(
    status: number,
    error: string,
    message: string,
    details?: string
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.error = error;
    this.details = details;
  }
}

export interface RequestConfig extends RequestInit {
  baseURL?: string;
}

class HttpClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL =
      baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5175';
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const { baseURL, ...requestConfig } = config;
    const url = `${baseURL || this.baseURL}${endpoint}`;

    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    try {
      const response = await fetch(url, {
        ...requestConfig,
        headers,
      });

      // Parse response body
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const apiError = data as ApiError;
        throw new HttpError(
          response.status,
          apiError.error || 'HTTP Error',
          apiError.message || `HTTP ${response.status} Error`,
          apiError.details
        );
      }

      return data as T;
    } catch (error) {
      if (error instanceof HttpError) {
        throw error;
      }

      // Network or parsing errors
      throw new HttpError(
        0,
        'Network Error',
        'Failed to connect to server. Please check your internet connection.',
        error instanceof Error ? error.message : String(error)
      );
    }
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

// Default HTTP client instance
export const http = new HttpClient();

// Export class for custom instances
export { HttpClient };
