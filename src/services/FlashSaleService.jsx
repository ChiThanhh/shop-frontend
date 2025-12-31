
import api from "./api";

export function getFlashSale() {
  return api.get(`/flash-sales/active`);
}
export function getFlashSaleById(id) {
  return api.get(`/flash-sales/${id}`);
}
