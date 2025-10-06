import React, { useState } from "react";
import DetailProduct from "@/components/product/DetailProduct";
import { getProductById } from "@/services/ProductService";
import { useLoading } from "@/context/loadingContext";
import { useNavigate } from "react-router-dom";

const ProductItem = (p) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [detail, setDetail] = useState(null);
    const [detailPage, setDetailPage] = useState(null);
    const { withLoading } = useLoading();
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
        <div className="bg-white rounded-2xl  shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer">
            <img
                onClick={handleQuickDetailPage}
                src={p.thumbnail_url}
                alt={p.name}
                className="w-full h-90 object-cover"
            />
            <div className="p-4">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <p className="text-red-500 font-bold mt-2">   {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(p.min_price)}</p>
                <button
                    onClick={handleQuickView}
                    className="mt-4 w-full bg-white text-black border border-black py-2 rounded-lg hover:border hover:border-gray-700 hover:bg-gray-700 hover:text-white hover:border-none transition-all duration-300 cursor-pointer"
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
