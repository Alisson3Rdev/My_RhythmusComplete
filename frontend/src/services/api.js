import axios from "axios";
import Constants from "expo-constants";

const metroHost = Constants.expoConfig?.hostUri?.split(":")[0];
const baseURL =
  process.env.EXPO_PUBLIC_API_URL || `http://${metroHost || "localhost"}:8080`;

const api = axios.create({ baseURL, timeout: 15000 });
let accessToken;
let refreshToken;
let refreshing;

function restoreBrowserSession() {
  if (typeof window === "undefined") return;
  try {
    accessToken = window.sessionStorage.getItem("rhythmus.accessToken") || undefined;
    refreshToken = window.sessionStorage.getItem("rhythmus.refreshToken") || undefined;
  } catch {
    accessToken = undefined;
    refreshToken = undefined;
  }
}

restoreBrowserSession();

export function setAuthTokens(access, refresh) {
  accessToken = access || undefined;
  refreshToken = refresh || undefined;
  if (typeof window !== "undefined") {
    try {
      if (accessToken) window.sessionStorage.setItem("rhythmus.accessToken", accessToken);
      else window.sessionStorage.removeItem("rhythmus.accessToken");
      if (refreshToken) window.sessionStorage.setItem("rhythmus.refreshToken", refreshToken);
      else window.sessionStorage.removeItem("rhythmus.refreshToken");
    } catch {
      // A sessão continua válida durante a navegação mesmo se o navegador bloquear storage.
    }
  }
}

export function hasAuthSession() {
  return Boolean(accessToken);
}

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    if (
      error.response?.status !== 401 ||
      !refreshToken ||
      request?._retried ||
      request?.url?.includes("/api/auth/")
    ) {
      return Promise.reject(error);
    }

    try {
      refreshing ||= axios.post(`${baseURL}/api/auth/refresh`, { refreshToken });
      const { data } = await refreshing;
      accessToken = data.accessToken;
      request._retried = true;
      request.headers.Authorization = `Bearer ${accessToken}`;
      return api(request);
    } catch (refreshError) {
      setAuthTokens(undefined, undefined);
      return Promise.reject(refreshError);
    } finally {
      refreshing = undefined;
    }
  },
);

export default api;
