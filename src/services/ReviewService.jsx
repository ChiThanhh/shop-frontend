
import api from "./api";

export function createReview(data) {
  return api.post("/reviews", data);
}
export function getReviewById(id , page = 1, limit = 10) {
  return api.get(`/reviews/by-product/${id}?page=${page}&limit=${limit}`);
}
