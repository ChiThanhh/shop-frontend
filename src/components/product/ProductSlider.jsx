import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { getProductById } from "@/services/ProductService";
import { useLoading } from "@/context/loadingContext";
import { useNavigate } from "react-router-dom";
const ProductSlider = ({ product }) => {
    const { withLoading } = useLoading();
    const navigate = useNavigate();
    const handleQuickDetailPage = async (product_id) => {
        await withLoading(async () => {
            try {
                const res = await getProductById(product_id);
                const products = res?.data ?? res;
                navigate(`/products/${products.product_id}`);
            } catch (e) {
                console.error("Failed to fetch product detail", e);

            }
        });
    };
    return (
        <Carousel
            opts={{
                align: "start",
                loop: true,
            }}

            className="w-full mx-auto">
            <CarouselContent>
                {product.map((p) => (
                    <CarouselItem key={p.product_id} className="basis-1/2 md:basis-1/4 lg:basis-1/5 ">
                        <div className="p-4 border rounded-lg bg-white shadow hover:shadow-md">
                            <div onClick={() => handleQuickDetailPage(p.product_id)} className="relative w-full h-full cursor-pointer ">
                                <img
                                    src={p.thumbnail_url}
                                    alt={p.name}

                                    className="object-cover rounded-md"
                                />
                            </div>
                            <h3 className="mt-2 text-sm font-semibold">{p.name}</h3>
                            <p className="text-red-500 font-bold">
                                {Number(p.min_price).toLocaleString("vi-VN")} ₫
                            </p>

                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
}
export default ProductSlider;