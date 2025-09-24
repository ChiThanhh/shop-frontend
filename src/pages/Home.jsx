import React, { useState, useEffect } from "react";
import Slider from "@/pages/Slider";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import ProductItem from "@/components/ProductItem";
import { getProduct } from "@/services/ProductService";





const discountProducts = [
  {
    id: 5,
    name: "Áo khoác bomber",
    oldPrice: "600.000₫",
    newPrice: "399.000₫",
    image: "/p5.jpg",
  },
  {
    id: 6,
    name: "Giày thể thao",
    oldPrice: "850.000₫",
    newPrice: "599.000₫",
    image: "/p6.jpg",
  },
];

// Flash Sale: 1 sản phẩm đặc biệt
const specialProduct = {
  id: 7,
  name: "Áo sơ mi nam cao cấp",
  oldPrice: "700.000₫",
  newPrice: "399.000₫",
  image: "/p7.jpg",
  endTime: new Date().getTime() + 1000 * 60 * 60 * 24, // 24h từ bây giờ
};

const Home = () => {
  const [timeLeft, setTimeLeft] = useState({});
  const [products, setProducts] = useState([]);
  // const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // const data = await getCategory();
      const res= await getProduct();
      // setCategories(data.data);
      setProducts(res.data);
    };
    fetchData();
  }, []);
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = specialProduct.endTime - now;

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
  }, []);

  return (
    <div className="w-full">
      <Slider />

      {/* Sản phẩm mới */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm mới</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductItem key={p.id} {...p} />
          ))}
        </div>
      </section>

      {/* Sản phẩm giảm giá */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Sản phẩm giảm giá</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {discountProducts.map((p) => (
            <ProductItem key={p.product_id} {...p} />
          ))}
        </div>
      </section>

      {/* Flash Sale - đặc biệt */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">Flash Sale đặc biệt</h2>
        <div className="bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
          <img
            src={specialProduct.image}
            alt={specialProduct.name}
            className="w-full h-80 object-cover"
          />
          <div className="p-6 flex flex-col justify-center">
            <h3 className="font-semibold text-2xl">{specialProduct.name}</h3>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-gray-400 line-through text-lg">{specialProduct.oldPrice}</p>
              <p className="text-red-500 font-bold text-2xl">{specialProduct.newPrice}</p>
            </div>

            {/* Countdown */}
            {!timeLeft.expired ? (
              <div className="mt-4 flex gap-4 text-center">
                <div className="bg-black text-white px-3 py-2 rounded-lg">
                  <p className="text-xl font-bold">{timeLeft.days}</p>
                  <span className="text-sm">Ngày</span>
                </div>
                <div className="bg-black text-white px-3 py-2 rounded-lg">
                  <p className="text-xl font-bold">{timeLeft.hours}</p>
                  <span className="text-sm">Giờ</span>
                </div>
                <div className="bg-black text-white px-3 py-2 rounded-lg">
                  <p className="text-xl font-bold">{timeLeft.minutes}</p>
                  <span className="text-sm">Phút</span>
                </div>
                <div className="bg-black text-white px-3 py-2 rounded-lg">
                  <p className="text-xl font-bold">{timeLeft.seconds}</p>
                  <span className="text-sm">Giây</span>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-red-500 font-bold">Đã hết khuyến mãi!</p>
            )}

            <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </section>

      {/* Banner Sale */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img src="/sale.jpg" alt="Sale" className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-3xl md:text-4xl font-bold">SALE 50% OFF</h2>
            <p className="mt-2 text-lg">Chỉ trong tuần này, nhanh tay kẻo lỡ!</p>
            <button className="mt-4 bg-white text-black px-6 py-3 rounded-full hover:bg-gray-200 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </section>
      <AnimatedTestimonials
        data={[
          {
            description: 'ScrollX-UI has completely transformed how I build interfaces. The animations are silky smooth, and the components are modular and responsive.',
            image: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
            name: 'Isabelle Carlos',
            handle: '@isabellecarlos'
          },
          {
            description: 'I love how ScrollX-UI makes my projects look professional with minimal effort. The documentation is clear and the community is super helpful.',
            image: 'https://plus.unsplash.com/premium_photo-1692340973636-6f2ff926af39?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
            name: 'Lana Akash',
            handle: '@lanaakash'
          },
          {
            description: 'The smooth scrolling animations and intuitive components in ScrollX-UI save me hours of development time!',
            image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
            name: 'Liam O’Connor',
            handle: '@liamoc'
          }
        ]}
      />
    </div>
  );
};

export default Home;
