import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatVND } from "@/lib/forrmatMoney";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    // 🎆 Bắn pháo hoa nhiều hướng
    const duration = 2 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // Bắn từ 2 bên
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 py-40">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white dark:bg-gray-800 shadow-sm rounded-xl p-8 w-full max-w-md text-center relative overflow-hidden"
      >
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Cảm ơn bạn đã mua sắm cùng chúng tôi. Đơn hàng của bạn đã được tiếp nhận
          và đang được xử lý.
        </p>

        {order && (
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6 text-sm text-left space-y-2">
            <div className="flex justify-between">
              <span>Mã đơn hàng:</span>
              <span className="font-medium">{order.order_id || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span>Tổng tiền:</span>
              <span className="font-medium text-green-600">
                {formatVND(Math.floor(order.grand_total))}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Phương thức thanh toán:</span>
              <span>{order.payment_method || "Chưa xác định"}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/my-order")}
            className="w-full sm:w-1/2 bg-black hover:bg-gray-700 cursor-pointer text-white"
          >
            Xem đơn hàng
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="w-full sm:w-1/2 cursor-pointer"
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
