
import api from "./api";

export function registerApi(data) {
  return api.post("/auth/register", data);
}
  
export function loginApi(data) {
  return api.post("/auth/login", data);
}
  
export function logoutApi() {
  return api.post("/auth/logout");
}
  