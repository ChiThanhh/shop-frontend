
import api from "./api";


export function createOrder(data) {
  return api.post("/orders", data);
}
export function getOrderById(order_id) {
  return api.get(`/orders/${order_id}`);
}
export function getOrderByUser(user_id) {
  return api.get(`/orders/by-user/${user_id}`);
}
export function updateOrder(order_id, data) {
  return api.put(`/orders/${order_id}`, data);
}

