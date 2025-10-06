import React, { useEffect, useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { getPrice } from "@/services/ProductService";
import { useLoading } from "@/context/loadingContext";
import { toast } from "sonner";
import { addToCart, createToCart } from "@/services/CartService";
import { useConfirm } from "@/context/confirmContext";
import { useCart } from "@/context/cartContext";

// Utility to format VND
const formatVND = (value) => {
    if (value == null || value === "") return "";
    try {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(Number(value));
    } catch {
        return String(value);
    }
};


const DetailProduct = (p) => {
    const {
        open,
        onOpenChange,
        trigger,
        product_id,
        name = "Sản phẩm",
        image,
        price,
        image_urls,
        care_instructions,
        description,
        colors = [],
        sizes = [],
    } = p || {};

    const { withLoading } = useLoading();
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const [currentPrice, setCurrentPrice] = useState(price);
    const { confirm } = useConfirm();
    const { cart, setCart } = useCart();
    const token = localStorage.getItem("token");
    const [variantId, setVariantId] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));


    useEffect(() => {
        if (!product_id || !color || !size) return;

        const fetchPrice = async () => {
            try {
                const res = await getPrice(product_id, color, size);
                setCurrentPrice(res.data?.list_amount ?? price);
                setVariantId(res.data?.variant_id)
            } catch (e) {
                console.error("Failed to fetch price", e);
            }
        };

        withLoading(fetchPrice);
    }, [product_id, color, size]);

    const handleAdd = async () => {
        if (!token) {
            toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
        };
        if (!color) {
            toast.error("Vui lòng chọn màu sắc");
            return;
        }
        if (!size) {
            toast.error("Vui lòng chọn kích cỡ");
            return;
        }


        try {
            let cartId = cart?.cart_id;

            if (!cartId) {
                const newCart = await createToCart({
                    user_id: user.user_id,
                    currency: "VND",
                });
                cartId = newCart.data?.cart_id;
                setCart({ ...newCart.data, items: [] });
            }

            const dataAdd = {
                cart_id: cartId,
                variant_id: variantId,
                qty: quantity,
                unit_price: currentPrice,
            };
            const ok = await confirm("Xác nhận thêm sản phẩm vào giỏ hàng?");
            if (!ok) return;

            await addToCart(dataAdd);

            const updatedCart = await withLoading(async () => {
                const { getListCart } = await import("@/services/CartService");
                return await getListCart();
            });

            setCart(updatedCart.data);
            toast.success("Thêm vào giỏ hàng thành công");
        } catch (e) {
            console.error("Failed to add to cart", e);
        }


    };

    const priceText = useMemo(() => formatVND(currentPrice), [currentPrice]);


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent className="sm:max-w-6xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                    <div className="relative bg-muted/20 sm:aspect-auto">
                        {Array.isArray(image_urls) && image_urls.length > 0 ? (
                            <Gallery name={name} images={image_urls} fallback={image} />
                        ) : (
                            <div className="aspect-square">
                                {image ? (
                                    <img
                                        src={image}
                                        alt={name}
                                        className="h-full w-full object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                        Không có ảnh
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="p-6 space-y-4">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-semibold">{name}</DialogTitle>

                        </DialogHeader>

                        {/* Price */}
                        {price != null && (
                            <div className="text-2xl font-bold text-red-500">{priceText}</div>
                        )}

                        {/* Options */}
                        <div className="space-y-3">
                            {colors.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Màu sắc</div>
                                    <div className="flex flex-wrap gap-2">
                                        {colors.map((c) => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setColor(c.id)}
                                                className={
                                                    "px-3 py-1.5 rounded-md border text-sm transition-colors cursor-pointer " +
                                                    (color === c.id
                                                        ? "bg-black text-white border-black"
                                                        : "hover:bg-accent")
                                                }
                                                aria-pressed={color === c.id}
                                            >
                                                {c.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {sizes.length > 0 && (
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Kích cỡ</div>
                                    <div className="flex flex-wrap gap-2">
                                        {sizes.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((s) => (
                                            <button

                                                key={s.id}
                                                type="button"
                                                onClick={() => setSize(s.id)}
                                                className={
                                                    "px-3 py-1.5 rounded-md border text-sm transition-colors cursor-pointer " +
                                                    (size === s.id
                                                        ? "bg-black text-white border-black"
                                                        : "hover:bg-accent")
                                                }
                                                aria-pressed={size === s.id}
                                            >
                                                {s.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quantity */}
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Số lượng</div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    aria-label="Giảm số lượng"
                                    className="cursor-pointer"
                                >
                                    -
                                </Button>
                                <div className="w-20">
                                    <Input
                                        type="number"
                                        min={1}
                                        value={quantity}
                                        onChange={(e) => {
                                            const v = parseInt(e.target.value, 10);
                                            setQuantity(Number.isNaN(v) ? 1 : Math.max(1, v));
                                        }}
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    type="button"
                                    onClick={() => setQuantity((q) => q + 1)}
                                    aria-label="Tăng số lượng"
                                    className="cursor-pointer"
                                >
                                    +
                                </Button>
                            </div>
                        </div>

                        <DialogFooter className="">


                            <Button
                                variant="outline"
                                onClick={handleAdd}
                                className="cursor-pointer bg-black text-white border-black transition-all ducration-300"
                            >
                                Thêm vào giỏ hàng
                            </Button>


                        </DialogFooter>
                        {description && (
                            <>


                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full"
                                    defaultValue="item-1"
                                >
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger className="cursor-pointer">Thông tin sản phẩm</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <DialogDescription className="mt-1">
                                                <div className="">
                                                    <div>
                                                        <span className="font-semibold">
                                                            {name}
                                                        </span>
                                                        <span>
                                                            {description?.description_1}
                                                        </span>
                                                    </div>
                                                    <div className="my-2 " >
                                                        {description?.description_2}

                                                    </div>
                                                </div>


                                            </DialogDescription>
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger className="cursor-pointer">Tham khảo</AccordionTrigger>
                                        <AccordionContent className="flex flex-col gap-4 text-balance">
                                            <p>
                                                {care_instructions}
                                            </p>

                                        </AccordionContent>
                                    </AccordionItem>

                                </Accordion>

                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DetailProduct;


function Gallery({ name, images, fallback }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const list = Array.isArray(images) && images.length ? images : (fallback ? [fallback] : []);
    const activeSrc = list[activeIndex] ?? fallback ?? "";

    return (
        <div className="w-full">
            {/* Main image */}
            <div className="aspect-square overflow-hidden">
                {activeSrc ? (
                    <img
                        src={activeSrc}
                        alt={name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        Không có ảnh
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {list.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                    {list.map((src, idx) => (
                        <button
                            key={src || idx}
                            type="button"
                            className={`relative aspect-square overflow-hidden rounded-md border transition-colors focus:outline-none focus:ring-2  focus:ring-ring ${idx === activeIndex ? "border-black" : "hover:bg-accent"
                                }`}
                            aria-label={`Xem ảnh ${idx + 1}`}
                            aria-pressed={idx === activeIndex}
                            onClick={() => setActiveIndex(idx)}
                        >
                            {src ? (
                                <img
                                    src={src}
                                    alt={`${name} ${idx + 1}`}
                                    className="h-full w-full object-cover "
                                    loading="lazy"
                                />
                            ) : (
                                <div className="h-full w-full bg-muted" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}