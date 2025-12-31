import React, { useEffect } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, fetchWishlist } = useWishlist();
  const navigate = useNavigate();
  useEffect(() => {
    fetchWishlist();
  }, []);
  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <Heart size={80} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2 dark:text-white">
            Danh sách yêu thích trống
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Hãy thêm sản phẩm yêu thích để xem lại sau
          </p>
          <Button onClick={() => navigate("/product-list")}>
            Khám phá sản phẩm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={22} className="text-red-500" />
        <h2 className="text-2xl font-bold text-black dark:text-white">
          Sản phẩm yêu thích
        </h2>
        <span className="text-gray-500 dark:text-gray-400">
          ({wishlist.length} sản phẩm)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div
            key={product.product_id}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition relative group"
          >
              {/* Remove Button */}
              <button
                onClick={() => removeFromWishlist(product.product_id)}
                className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group/btn cursor-pointer"
              >
                <Trash2
                  size={18}
                  className="text-gray-400 group-hover/btn:text-red-500 transition-colors"
                />
              </button>

              {/* Product Image */}
              <div
                onClick={() => navigate(`/products/${product.product_id}`)}
                className="cursor-pointer"
              >
                <img
                  src={product.url}
                  alt={product.name}
                  className="w-full h-90 object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3
                  className="font-semibold text-base mb-2 text-black dark:text-white cursor-pointer "
                  onClick={() => navigate(`/products/${product.product_id}`)}
                >
                  {product.name}
                </h3>
                <div className="flex items-center space-x-2 mb-4">
                  <p className="text-red-500 font-bold ">   {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product.final_price || product.list_amount)}</p>
                  {product.discount_price && (
                    <p className="text-gray-400 line-through text-sm">   {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(product.list_amount)}</p>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => navigate(`/products/${product.product_id}`)}
                  className="w-full cursor-pointer"
                  variant="outline"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
