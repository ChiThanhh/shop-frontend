import React from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
const ProductSlider = ({ product }) => {
    return (
        <Carousel 
            opts={{
            align: "start",
            loop: true,
            }}
        
            className="w-full mx-auto">
            <CarouselContent>
                {product.map((p) => (
                    <CarouselItem key={p.id} className="basis-1/2 md:basis-1/4 lg:basis-1/5">
                        <div className="p-4 border rounded-lg bg-white shadow hover:shadow-md">
                            <div className="relative w-full h-40">
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    
                                    className="object-cover rounded-md"
                                />
                            </div>
                            <h3 className="mt-2 text-sm font-semibold">{p.name}</h3>
                            <p className="text-red-500 font-bold">
                                {p.price.toLocaleString()}₫
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