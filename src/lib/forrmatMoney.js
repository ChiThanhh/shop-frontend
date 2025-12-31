export function formatVND(amount) {
  if (isNaN(amount)) return "0 ₫";

  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}
