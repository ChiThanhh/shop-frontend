
import api from "./api";

export function getListWishlist(user_id) {
  return api.get("/wishlists", { params: { user_id } });
};
export function createWishlist(user_id) {
  return api.post("/wishlists", { user_id });
};
export function addItemWishlist(wishlist_id, product_id) {
  return api.post(`/wishlists/${wishlist_id}/items`, { product_id });
};
export function removeItemWishlist(wishlist_id, product_id) {
  return api.delete(`/wishlists/${wishlist_id}/items/${product_id}`);
};
