import api from "./api";

export function getUserProfile() {
  return api.get("/users/me");
}
export function updateUserProfile(data) {
  return api.put("/users/me", data);
}

