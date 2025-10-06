import React from "react";
import { getListCart } from "@/services/CartService";
import { createContext, useContext, useState, useEffect } from "react";


const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await getListCart();
        setCart(res.data);
      } catch (err) {
        console.error("Lỗi load giỏ hàng:", err);
      }
    }
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
