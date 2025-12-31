import { addItemWishlist, createWishlist, getListWishlist, removeItemWishlist } from "@/services/WishlistService";
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "sonner";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [wishlistId, setWishlistId] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user")) || null;
  const didFetch = useRef(false);

  const fetchWishlist = async () => {
    if (!user?.user_id) return;
    try {
      const res = await getListWishlist(user.user_id);
      if (res?.data.length > 0) {
        setWishlist(res.data || []);
        setWishlistId(res.data[0].wishlist_id);
      } else {
        const created = await createWishlist(user.user_id);
        setWishlist([]);
        setWishlistId(created.data.wishlist_id);
      }
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.user_id) return;
    if (didFetch.current) return;
    didFetch.current = true;
    fetchWishlist();
  }, [user?.user_id]);

  const addToWishlist = async (product) => {
    if (!wishlistId) return;
    if (wishlist.some((p) => p.product_id === product.product_id)) {
      toast.info("Sản phẩm đã có trong danh sách yêu thích");
      return;
    }

    try {
      await addItemWishlist(wishlistId, product.product_id);
      setWishlist((prev) => [...prev, product]);
      toast.success("Đã thêm vào danh sách yêu thích");
    } catch (err) {
      console.error("Failed to add item to wishlist", err);
    }

  };

  const removeFromWishlist = async (productId) => {
    if (!wishlistId) return;

    try {
      await removeItemWishlist(wishlistId, productId);
      setWishlist((prev) =>
        prev.filter((p) => p.product_id !== productId)
      );
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } catch (err) {
      console.error("Failed to remove item from wishlist", err);
    }
  };


  const isInWishlist = (productId) => {
    return wishlist.some((p) => p.product_id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist, fetchWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
