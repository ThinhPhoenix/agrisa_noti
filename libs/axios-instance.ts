import axios, {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";

// Base URL from environment. In Next.js, use NEXT_PUBLIC_API_URL for client-side.
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// local token store to avoid direct localStorage coupling and to support SSR-safe token injection
let _accessToken: string | null = null;

/**
 * Set the access token used by the axios instance.
 * Use this to inject a token after login. Works in both client and server code
 * if your code calls it with token from the server.
 */
export const setAccessToken = (token: string | null) => {
  _accessToken = token;
};

export const clearAccessToken = () => {
  _accessToken = null;
};

export const getAccessToken = () => _accessToken;

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30_000,
});

// Request interceptor to add Authorization header when token available
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token =
    _accessToken ??
    (typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null);
  if (token) {
    // headers on InternalAxiosRequestConfig are of type AxiosRequestHeaders; use plain assignment with index signature
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling global errors
instance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Add generic error handling here (e.g., logging, toast, refresh token)
    // For now, rethrow to let callers handle specifics
    return Promise.reject(error);
  }
);

export default instance;
export const http = instance;
