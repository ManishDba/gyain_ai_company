// without loader use axios 

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "../src/store";
import { ENV } from "../env";

// ✅ Create Axios instance
const axiosInstance = axios.create({
  baseURL: ENV.BASE_URL,
});

// ✅ REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  async (config) => {
    console.log("📤 REQUEST START:", {
      url: config.url,
      method: config.method?.toUpperCase(),
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
    });

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
    console.log("❌ REQUEST ERROR:", {
      error: error.message,
    });
    return Promise.reject(error);
  }
);

// ✅ RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("✅ RESPONSE SUCCESS:", {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.log("❌ RESPONSE ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.message,
      errorData: error.response?.data,
    });
    return Promise.reject(error);
  }
);

export default axiosInstance;