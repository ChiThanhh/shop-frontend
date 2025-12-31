
import api from "./api";

export function getInventoryByVariant(id) {
  return api.get(`/inventory/variant/${id}`);
}
  