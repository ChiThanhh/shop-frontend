
import api from "./api";

export function getSize(params = {}) {
  return api.get("/sizes", { params });
}
  