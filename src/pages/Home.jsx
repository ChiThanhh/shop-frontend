import React, { useState, useEffect } from "react";
import Slider from "@/pages/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { getListDiscount, getProduct } from "@/services/ProductService";
import ProductItem from "@/components/product/ProductItem";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { getFlashSale, getFlashSaleById } from "@/services/FlashSaleService";
import { getTopReviews } from "@/services/TopReview";

const Home = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({});
  const [products, setProducts] = useState([]);
  const [topReviews, setTopReviews] = useState([]);
  const [discountProducts, setDiscountProducts] = useState([]);
  const [flashSale, setFlashSale] = useState(null)


    ;
  const [flashSaleProduct, setFlashSaleProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getProduct();
      const resDiscount = await getListDiscount();
      const resFlashSale = await getFlashSale();
      const resTopReviews = await getTopReviews();

      if (resFlashSale.data && resFlashSale.data.length > 0) {
        const resFlashSaleId = await getFlashSaleById(resFlashSale.data[0]?.flash_sale_id);

        if (resFlashSaleId.data) {
          setFlashSale(resFlashSaleId.data);
          // Lấy sản phẩm đầu tiên trong flash sale
          if (resFlashSaleId.data.products && resFlashSaleId.data.products.length > 0) {
            setFlashSaleProduct(resFlashSaleId.data.products[0]);
          }
        }
      }
      setTopReviews(resTopReviews.data || []);
      setProducts(res.data);
      setDiscountProducts(resDiscount.data?.products || []);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!flashSale?.end_time) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const endTime = new Date(flashSale.end_time).getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ expired: true });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((distance / (1000 * 60)) % 60),
          seconds: Math.floor((distance / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [flashSale]);

  return (
    <div className="w-full">
      <Slider />

      {/* Sản phẩm mới */}
      <section className="max-w-7xl mx-auto px-4 py-12  border-b ">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm mới</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.slice(0, 8).map((p) => (
            <ProductItem key={p.id} {...p} />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/product-list")} className="text-black bg-white border border-black hover:text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer">Xem tất cả</Button>
        </div>
      </section>

      {/* Sản phẩm giảm giá */}
      <section className="max-w-7xl mx-auto px-4 py-12  border-b ">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm giảm giá</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {discountProducts.map((p) => (
            <ProductItem key={p.product_id} {...p} />
          ))}
        </div>
        <div className="flex justify-center mt-6">
          <Button onClick={() => navigate("/product-list")} className="text-black bg-white border border-black hover:text-black hover:bg-gray-100 transition-all duration-200 cursor-pointer">Xem tất cả</Button>
        </div>
      </section>

      {/* Flash Sale - đặc biệt */}
      {flashSale && flashSaleProduct && flashSale.status === 'active' && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{flashSale.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Đã bán: {flashSaleProduct.quantity_sold}/{flashSaleProduct.quantity_limit}
              </span>
              <span className="text-sm font-semibold text-red-500">
                ({flashSaleProduct.sold_percent}%)
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <img
              src={flashSaleProduct.product_images?.[0] || "/placeholder.jpg"}
              alt={flashSaleProduct.product_name}
              className="w-full h-90 object-cover"
            />
            <div className="p-6 flex flex-col justify-center">
              <h3 className="font-semibold text-2xl">{flashSaleProduct.product_name}</h3>

              <div className="flex items-center gap-3 mt-2">
                <p className="text-gray-400 line-through text-lg">
                  {parseInt(flashSaleProduct.original_price).toLocaleString('vi-VN')}₫
                </p>
                <p className="text-red-500 font-bold text-2xl">
                  {parseInt(flashSaleProduct.flash_price).toLocaleString('vi-VN')}₫
                </p>
                <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  -{flashSaleProduct.discount_percent}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-full transition-all duration-300"
                    style={{ width: `${flashSaleProduct.stock_available}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Còn {flashSaleProduct.stock_available} sản phẩm
                </p>
              </div>

              {/* Countdown */}
              {!timeLeft.expired ? (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Kết thúc trong:</p>
                  <div className="flex gap-4 text-center">
                    <div className="bg-black text-white px-3 py-2 rounded-lg min-w-[60px]">
                      <p className="text-xl font-bold">{timeLeft.days || 0}</p>
                      <span className="text-sm">Ngày</span>
                    </div>
                    <div className="bg-black text-white px-3 py-2 rounded-lg min-w-[60px]">
                      <p className="text-xl font-bold">{timeLeft.hours || 0}</p>
                      <span className="text-sm">Giờ</span>
                    </div>
                    <div className="bg-black text-white px-3 py-2 rounded-lg min-w-[60px]">
                      <p className="text-xl font-bold">{timeLeft.minutes || 0}</p>
                      <span className="text-sm">Phút</span>
                    </div>
                    <div className="bg-black text-white px-3 py-2 rounded-lg min-w-[60px]">
                      <p className="text-xl font-bold">{timeLeft.seconds || 0}</p>
                      <span className="text-sm">Giây</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-red-500 font-bold">Đã hết khuyến mãi!</p>
              )}

              <button
                onClick={() => navigate(`/products/${flashSaleProduct.product_id}`)}
                className="mt-6 bg-black text-white px-6 py-3 rounded-lg  transition disabled:bg-gray-400 cursor-pointer"
                disabled={flashSaleProduct.is_sold_out || timeLeft.expired}
              >
                {flashSaleProduct.is_sold_out ? 'Đã hết hàng' : 'Mua ngay'}
              </button>
            </div>
          </div>
        </section>
      )}


      <AnimatedTestimonials
        data={topReviews}
      />
    </div>
  );
};

export default Home;
