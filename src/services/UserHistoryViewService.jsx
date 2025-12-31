import api from "./api";

export async function getUserHistoryView(userId) {
    const response = await api.get("/user-view-history", { params: { user_id: userId } });
    return response.data;
}
export async function addUserHistoryView(data) {
    const response = await api.post("/user-view-history", data);
    return response.data;
}
export async function clearUserHistoryView(userId) {
    const response = await api.delete("/user-view-history", { data: { user_id: userId } });
    return response.data;
}