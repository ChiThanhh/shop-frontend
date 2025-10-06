
import api from "./api";
const API_URL = import.meta.env.VITE_API_URL;
export function registerApi(data) {
  return api.post("/auth/register", data);
}

export function loginApi(data) {
  return api.post("/auth/login", data);
}

export function logoutApi() {
  return api.post("/auth/logout");
}
export function googleLoginApi() {
  window.location.href = `${API_URL}/auth/google`;
}

export function verifyToken() {
  return api.get("/auth/me");
}