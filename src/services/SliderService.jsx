
import api from "./api";

export function getSlider(params = {}) {
  return api.get("/sliders", { params });
}
