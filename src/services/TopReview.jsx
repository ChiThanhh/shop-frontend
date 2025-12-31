
import api from "./api";

export function getTopReviews(params = {}) {
  return api.get("/top-reviews", { params });
}
