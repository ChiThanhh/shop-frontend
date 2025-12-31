import React from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + Mô tả */}
        <div>
          <h2 className="text-white text-2xl font-bold mb-4">Peanut</h2>
          <p className="text-sm">
            Peanut mang đến xu hướng thời trang mới nhất, chất lượng và phong
            cách dành cho bạn.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Liên kết</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-white transition">Trang chủ</a></li>
            <li><a href="/products" className="hover:text-white transition">Sản phẩm</a></li>
            <li><a href="/about" className="hover:text-white transition">Giới thiệu</a></li>
            <li><a href="/contact" className="hover:text-white transition">Liên hệ</a></li>
          </ul>
        </div>

        {/* Hỗ trợ */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-white transition">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition">Chính sách đổi trả</a></li>
            <li><a href="#" className="hover:text-white transition">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-white transition">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Liên hệ</h3>
          <p className="text-sm"> 163 Phạm Văn Bạch, P.Tân Sơn, TP.HCM</p>
          <p className="text-sm"> +84 348412593</p>
          <p className="text-sm"> support@peanut.com</p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-white"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white"><Twitter size={20} /></a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-sm">
        © {new Date().getFullYear()} Peanut. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
