
import axios from "axios";
import api from "./api";


export function getAllProvinces() {
  return axios.get("https://provinces.open-api.vn/api/v1/p");
};

export function getAllDistricts(provinceId) {
  return axios.get(`https://provinces.open-api.vn/api/p/${provinceId}?depth=2`);
};


export function getAllWards(districtId) {
  return axios.get(`https://provinces.open-api.vn/api/d/${districtId}?depth=2`);
};

// Lấy danh sách địa chỉ của user đang đăng nhập
export function getMyAddresses() {
  return api.get("/addresses/me/addresses");
}

// Tạo địa chỉ mới
export function createMyAddress(data) {
  return api.post("/addresses/me/addresses", data);
}

// Cập nhật địa chỉ
export function updateMyAddress(id, data) {
  return api.put(`/addresses/me/addresses/${id}`, data);
}

export function setDefaultAddress(id) {
  return api.put(`/addresses/me/addresses/${id}/default`);
}

// Xóa địa chỉ
export function deleteMyAddress(id) {
  return api.delete(`/addresses/me/addresses/${id}`);
}





