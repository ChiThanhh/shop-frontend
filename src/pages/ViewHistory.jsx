import React, { useEffect } from "react";
import { useViewHistory } from "@/context/ViewHistoryContext";
import { Clock, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";
import { useConfirm } from "@/context/confirmContext";


export default function ViewHistory() {
  const { viewHistory, clearHistory, isLoading } = useViewHistory();
  const navigate = useNavigate();
  const { confirm } = useConfirm();
  console.log("ViewHistory rendered:", viewHistory);
  const handleClearHistory = async () => {
    const ok = await confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử xem?");
    if (ok) {
      clearHistory();
    }
  };

  if (viewHistory.length === 0) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Đang tải lịch sử xem...</p>
            </div>
          ) : (
            <>
              <Clock size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2 dark:text-white">
                Chưa có lịch sử xem
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Các sản phẩm bạn đã xem sẽ hiển thị ở đây
              </p>
              <Button onClick={() => navigate("/product-list")}>
                Khám phá sản phẩm
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Clock size={22} className="text-blue-500" />
          <h1 className="text-2xl font-bold text-black dark:text-white">
            Lịch sử xem sản phẩm
          </h1>
          <span className="text-gray-500 dark:text-gray-400">
            ({viewHistory.length} sản phẩm)
          </span>
        </div>
        <Button
          onClick={handleClearHistory}
          variant="outline"
          className="text-red-500 hover:text-red-600 cursor-pointer"
        >
          <Trash2 size={16} className="mr-2" />
          Xóa tất cả
        </Button>
      </div>

      <AnimatePresence>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {viewHistory.map((product, index) => (
            <motion.div
              key={`${product.product_id}-${index}`}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => navigate(`/products/${product.product_id}`)}
            >
              {/* Product Image */}
              <div className="relative">
                <img
                  src={product.thumbnail_url || product.url}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />
                {/* Recently Viewed Badge */}
                {index < 3 && (
                  <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Mới xem
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-base mb-2 text-black dark:text-white line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-red-500 font-bold">
                    {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(product.min_price || product.final_price || product.list_amount)}
                  </p>
                  {product.has_discount || product.discount_price && (
                    <p className="text-gray-400 dark:text-gray-500 line-through text-sm">
                      {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(product.original_min_price || product.list_amount)}
                    </p>
                  )}
            
                </div>

                {/* View Again Button */}
                <Button className="w-full cursor-pointer" variant="outline">
                  <ShoppingBag size={16} className="mr-2" />
                  Xem lại
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
