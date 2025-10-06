
import api from "./api";

export function getListCart() {
  return api.get("/carts");
}

export function createToCart(data) {
  return api.post("/carts", data);
}

export function addToCart(data) {
  return api.post("/carts/items", data);
}
export function updateQuantityCart(id, data) {
  return api.put(`/carts/items/${id}`, data);
}
export function deleteItemCart(id) {
  return api.delete(`/carts/items/${id}`);
}
export function clearCart(id) {
  return api.delete(`/carts/clear/${id}`);
}
