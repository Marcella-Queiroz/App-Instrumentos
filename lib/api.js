// lib/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");

// cria o cliente axios
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 20000,
});

// chave do token no AsyncStorage
const TOKEN_KEY = "@auth_token";

// helpers de token
export async function saveToken(token) {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
}
export async function loadToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}
export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// interceptor de request
api.interceptors.request.use(async (config) => {
  // injeta Authorization se houver token e se não tiver sido setado manualmente
  const token = await loadToken();
  if (token && !(config.headers && config.headers.Authorization)) {
    config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }

  // Se o body for FormData: NÃO force Content-Type (deixa o Axios criar o boundary)
  const isFormData =
    typeof FormData !== "undefined" &&
    config.data instanceof FormData;

  if (isFormData) {
    if (config.headers && config.headers["Content-Type"]) {
      delete config.headers["Content-Type"];
    }
  } else {
    // Para JSON (objetos comuns), garanta application/json
    config.headers = {
      "Content-Type": "application/json",
      ...(config.headers || {}),
    };
  }

  return config;
});
