import axios from "axios";
import store from "../src/store";
import { startLoaderAct, stopLoaderAct } from "../src/reducers/loader.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from "../env";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

// Track active requests
let activeRequests = 0;

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    activeRequests += 1;
    console.log("📤 REQUEST START:", {
      url: config.url,
      method: config.method?.toUpperCase(),
      activeRequests: activeRequests,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });

    if (activeRequests === 1) {
      console.log("🔄 Starting loader...");
      store.dispatch(startLoaderAct());
    }

    const state = store.getState();
    const token = state.authSlice.token || null;

    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
      await AsyncStorage.setItem("auth_token", token);
      console.log("🔑 Token attached to request");
    } else {
      console.log("⚠️ No token found");
    }

    return config;
  },
  (error) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    console.log("❌ REQUEST ERROR:", {
      error: error.message,
      activeRequests: activeRequests,
    });
    if (activeRequests === 0) {
      console.log("⏹️ Stopping loader (request error)");
      store.dispatch(stopLoaderAct());
    }
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    console.log("✅ RESPONSE SUCCESS:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      activeRequests: activeRequests,
      data: response.data,
    });

    if (activeRequests === 0) {
      console.log("⏹️ Stopping loader (all requests complete)");
      store.dispatch(stopLoaderAct());
    }
    return response;
  },
  (error) => {
    activeRequests = Math.max(activeRequests - 1, 0);
    console.log("❌ RESPONSE ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      activeRequests: activeRequests,
      errorData: error.response?.data,
    });

    if (activeRequests === 0) {
      console.log("⏹️ Stopping loader (response error)");
      store.dispatch(stopLoaderAct());
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;