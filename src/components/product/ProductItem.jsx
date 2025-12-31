import React, { useState } from "react";
import DetailProduct from "@/components/product/DetailProduct";
import { getProductById } from "@/services/ProductService";
import { useLoading } from "@/context/loadingContext";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { motion } from "framer-motion";

const ProductItem = (p) => {
    const navigate = useNavigate();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(null);
    const [detailPage, setDetailPage] = useState(null);
    const { withLoading } = useLoading();
    
    const inWishlist = isInWishlist(p.product_id);

    const handleWishlistToggle = (e) => {
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(p.product_id);
        } 
        else {
            addToWishlist({
                product_id: p.product_id,
            });
        }
    };
    
    const handleQuickView = async () => {
        await withLoading(async () => {
            try {
                const res = await getProductById(p.product_id);
                const product = res?.data ?? res;
                setDetail(product);
                setOpen(true);
            } catch (e) {
                console.error("Failed to fetch product detail", e);
                setDetail(null);
                setOpen(true);
            }
        });
    };
    const handleQuickDetailPage = async () => {
        await withLoading(async () => {
            try {
                const res = await getProductById(p.product_id);
                const product = res?.data ?? res;
                setDetailPage(product);
                navigate(`/products/${p.product_id}`);
            } catch (e) {
                console.error("Failed to fetch product detail", e);
                setDetailPage(null);
            }
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer relative group">
            {/* Wishlist Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleWishlistToggle}
                className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer group/btn"
            >
                <Heart
                    size={20}
                    className={`${
                        inWishlist
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400 dark:text-gray-300"
                    } transition-colors`}
                />
            </motion.button>

            <img
                onClick={handleQuickDetailPage}
                src={p.thumbnail_url}
                alt={p.name}
                className="w-full h-90 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-base text-black dark:text-white">{p.name}</h3>
                <div className="flex items-center mt-2 space-x-2">
                    <p className="text-red-500 font-bold ">   {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(p.min_price)}</p>
                    {p.has_discount && (
                        <p className="text-gray-400 line-through text-sm">   {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(p.original_min_price)}</p>
                    )}
                </div>
                <button
                    onClick={handleQuickView}
                    className="mt-4 w-full bg-white dark:bg-gray-700 text-black dark:text-white border border-black dark:border-gray-600 py-2 rounded-lg hover:shadow-lg hover:-translate-y-1 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 cursor-pointer"
                >
                    Mua nhanh
                </button>

                <DetailProduct
                    open={open}
                    onOpenChange={setOpen}
                    product_id={p.product_id}
                    name={detail?.name ?? p.name}
                    image={detail?.image ?? p.image ?? p.thumbnail_url}
                    image_urls={detail?.image_urls ?? p.image_urls}
                    price={detail?.price ?? p.price ?? p.min_price}
                    description={detail?.description ?? p.description}
                    colors={detail?.colors ?? p.colors}
                    sizes={detail?.sizes ?? p.sizes}
                    care_instructions={detail?.care_instructions ?? p.care_instructions}
                    onAddToCart={p.onAddToCart}
                    onBuyNow={p.onBuyNow}
                />
            </div>
        </div>
    )
}
export default ProductItem;
