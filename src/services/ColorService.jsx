
import api from "./api";

export function getColor(params = {}) {
  return api.get("/colors", { params });
}
