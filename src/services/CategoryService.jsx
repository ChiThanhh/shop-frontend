
import api from "./api";

export function getCategory(params = {}) {
  return api.get("/categories", { params });
}
