
import api from "./api";

export function getProduct(params = {}) {
  return api.get("/products", { params });
}
export function getProductById(id) {
  return api.get(`/products/${id}`);
}
export function getPrice(product_id, color_id, size_id) {
  return api.get(`/prices/getprice?product_id=${product_id}&color_id=${color_id}&size_id=${size_id}`);
}
