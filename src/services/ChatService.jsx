
import api from "./api";

export function chatAI(data) {
  return api.post("/ai/chat", data);
}
