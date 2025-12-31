import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, updateOrder } from "@/services/OrderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatVND } from "@/lib/forrmatMoney";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowLeft,
  MapPin,
  User,
  Phone,
  CreditCard,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useConfirm } from "@/context/confirmContext";
import { toast } from "sonner";

export default function OrderDetail() {
  const { order_id } = useParams();
  const { confirm } = useConfirm();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const handleUpdateOrder = async () => {
    const ok = await confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?");
    if (!ok) return;
    try {
      const data = {
        status: "cancelled"
      }
      await updateOrder(order.order_id, data);
      toast.success("Hủy đơn hàng thành công");
      setOrder((prev) => ({ ...prev, status: "cancelled" }));
    } catch (error) {
      console.error("Lỗi khi cập nhật đơn hàng:", error);
    }
  };
  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const res = await getOrderById(order_id);
        setOrder(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetail();
  }, [order_id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
        <span className="ml-2">Đang tải chi tiết đơn hàng...</span>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Package className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg text-muted-foreground mb-4">
          Không tìm thấy đơn hàng
        </p>
        <Button onClick={() => navigate("/my-order")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const statusConfig = {
    processing: {
      icon: <Package className="text-blue-500" />,
      label: "Đang xử lý",
      color: "bg-blue-500",
    },
    shipping: {
      icon: <Truck className="text-orange-500" />,
      label: "Đang giao",
      color: "bg-orange-500",
    },
    completed: {
      icon: <CheckCircle className="text-green-500" />,
      label: "Hoàn thành",
      color: "bg-green-500",
    },
    cancelled: {
      icon: <XCircle className="text-red-500" />,
      label: "Đã hủy",
      color: "bg-red-500",
    },
  };

  const currentStatus = statusConfig[order.status] || statusConfig.processing;
  const orderDate = new Date(order.placed_at).toLocaleString("vi-VN");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-order")}
            className="mb-4 cursor-pointer"
          >
            <ArrowLeft className="mr-2 h-4 w-4 cursor-pointer" />
            Quay lại
          </Button>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">
                Chi tiết đơn hàng #{order.order_id}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Đặt ngày: {orderDate}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentStatus.icon}
              <Badge className={`${currentStatus.color} text-white`}>
                {currentStatus.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            <Card>
              <CardHeader>
                <CardTitle >Sản phẩm ({order.items?.length || 0})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 pb-4 border-b last:border-b-0"
                    >
                      <img
                        src={item.thumbnail}
                        alt={item.thumbnail}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">
                          {item.product_name || item.name}
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>Size: {item.size || "N/A"}</p>
                          <p>Số lượng: {item.qty}</p>
                          <p className="font-medium text-foreground">
                            Đơn giá: {formatVND(Math.floor(item.unit_price))}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg underline">
                            {formatVND(Math.floor(item.total_amount))}
                          </p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Không có sản phẩm
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Địa chỉ giao hàng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{user.full_name || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p>{order.phone || "N/A"}</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <p>{order.shipping_address || "N/A"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phương thức:</span>
                  <span className="font-medium">
                    {order.payment_method === "cod"
                      ? "Thanh toán khi nhận hàng"
                      : order.payment_method === "vnpay"
                        ? "VNPay"
                        : order.payment_method === "momo"
                          ? "Momo"
                          : order.payment_method || "Chưa xác định"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái:</span>
                  <Badge
                    variant={
                      order.payment_status === "paid" ? "success" : "secondary"
                    }
                  >
                    {order.payment_status === "paid"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính:</span>
                  <span>{formatVND(Math.floor(order.subtotal || 0))}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí vận chuyển:</span>
                  <span>{formatVND(Math.floor(order.shipping_fee || 0))}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatVND(Math.floor(order.discount_amount))}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-green-600">
                    {formatVND(Math.floor(order.grand_total))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {order.status === "processing" && (

              <Button onClick={handleUpdateOrder} variant="destructive" className="w-full cursor-pointer ">
                Hủy đơn hàng
              </Button>

            )}

            {order.status === "completed" && (
              <Card>
                <CardContent className="pt-6">
                  <Button className="w-full mb-2">Mua lại</Button>
                  <Button variant="outline" className="w-full">
                    Đánh giá sản phẩm
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}