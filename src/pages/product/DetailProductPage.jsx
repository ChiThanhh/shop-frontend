import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getPrice, getProductById, getProductRelated } from "@/services/ProductService";
import { useLoading } from "@/context/loadingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Review from "@/components/product/Review";
import RelatedProducts from "@/components/product/RelatedProducts";
import { toast } from "sonner";
import { addToCart, createToCart } from "@/services/CartService";
import { useCart } from "@/context/cartContext";
import { useConfirm } from "@/context/confirmContext";
import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { getInventoryByVariant } from "@/services/inventoryService";
import { useViewHistory } from "@/context/ViewHistoryContext";

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

const DetailProductPage = () => {
  const { id } = useParams();
  const { cart, setCart } = useCart();
  const { addToHistory } = useViewHistory();
  const [detailPage, setDetailPage] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { withLoading } = useLoading();
  const { confirm } = useConfirm();

  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [inventory, setInventory] = useState("");
  const [variantId, setVariantId] = useState("");
  const [currentPrice, setCurrentPrice] = useState(detailPage?.min_price || 0);
  const [originPrice, setOriginPrice] = useState(detailPage?.min_price || 0);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    withLoading(async () => {
      try {
        const res = await getProductById(id);
        const resRelated = await getProductRelated(id);
        const product = res?.data ?? res;
        setDetailPage(product);
        setRelatedProducts(resRelated?.data || []);
        if (product?.colors?.length > 0) setColor(product.colors[0].id);
        if (product?.sizes?.length > 0) setSize(product.sizes[0].id);
        
        // Thêm vào lịch sử xem
        if (product) {
          addToHistory({
            product_id: product.product_id,
            name: product.name,
            thumbnail_url: product.thumbnail_url,
            min_price: product.min_price,
            original_min_price: product.original_min_price,
            has_discount: product.has_discount,
          });
        }
      } catch (e) {
        console.error("Failed to fetch product detail", e);
      }
    });
  }, [id, withLoading]);

  useEffect(() => {
    if (!detailPage?.product_id || !color || !size) return;

    const fetchPrice = async () => {
      try {
        const res = await getPrice(detailPage?.product_id, color, size);
        setCurrentPrice(res.data?.list_amount);
        setOriginPrice(res.data?.final_price);
        setVariantId(res.data?.variant_id);
        const dataInven = await getInventoryByVariant(res.data?.variant_id);
        setInventory(dataInven.data?.available_qty);
      } catch (e) {
        console.error("Failed to fetch price", e);
      }
    };

    withLoading(fetchPrice);
  }, [detailPage?.product_id, color, size]);

  const priceText = useMemo(() => formatVND(currentPrice), [currentPrice]);
  const originalPriceText = useMemo(() => formatVND(originPrice), [originPrice]);
  const handleAdd = async () => {
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng");
    };
    if (detailPage?.colors?.length > 0 && !color) {
      toast.error("Vui lòng chọn màu sắc");
      return;
    }
    if (detailPage?.sizes?.length > 0 && !size) {
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
        unit_price: originPrice  || currentPrice,
      };
      const ok = await confirm("Xác nhận thêm sản phẩm vào giỏ hàng?");
      if (!ok) return;

      await addToCart(dataAdd);

      // Fetch lại giỏ hàng để có dữ liệu đầy đủ
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


  return (
    <div >
      <div className="grid grid-cols-4 gap-4 ">
        <div className="col-span-3">
          <div className="grid grid-cols-2 h-screen overflow-y-auto scrollbar-hide gap-2">
            {detailPage?.image_urls?.map((img, idx) => (
              <ImageZoom key={idx}>
                <img
                  src={img}
                  alt={`${detailPage?.name}-${idx}`}
                  className="w-full h-auto object-cover "
                />
              </ImageZoom>
            ))}
          </div>

        </div>
        <div className="col-span-1">
          <div className="p-6 space-y-4">
            <div>
              <h1 className="text-xl font-semibold">{detailPage?.name}</h1>
            </div>

            {/* Price */}

            <div className="space-y-1 flex items-center gap-3">
              <div className="text-2xl font-bold text-red-500">{originalPriceText || priceText}</div>
              {originPrice && (
                <div className="text-sm text-muted-foreground line-through">{priceText}</div>
              )}
            </div>


            {/* Options */}
            <div className="space-y-3">
              {detailPage?.colors?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Màu sắc</div>
                  <div className="flex flex-wrap gap-2">
                    {detailPage?.colors.map((c) => (
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

              {detailPage?.sizes?.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Kích cỡ</div>
                  <div className="flex flex-wrap gap-2">
                    {detailPage?.sizes.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).map((s) => (
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
                  disabled={inventory === 0}
                >
                  -
                </Button>
                <div className="w-20">
                  <Input
                    type="number"
                    min={1}
                    max={inventory} // chặn nhập vượt tồn
                    value={quantity}
                    onChange={(e) => {
                      const v = parseInt(e.target.value, 10);
                      if (Number.isNaN(v)) {
                        setQuantity(1);
                      } else {
                        setQuantity(Math.min(Math.max(1, v), inventory));
                      }
                    }}
                    disabled={inventory === 0}
                  />
                </div>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(inventory, q + 1))}
                  aria-label="Tăng số lượng"
                  className="cursor-pointer"
                  disabled={inventory === 0}
                >
                  +
                </Button>
              </div>
            </div>
            <div className="space-y-2 flex items-center ">
              <div className="text-sm text-muted-foreground">Còn tồn: <span className="font-bold">{inventory} sản phẩm</span></div>
            </div>

            <div className="">
              <Button
                variant="outline"
                onClick={handleAdd}
                className="w-full cursor-pointer bg-black text-white border-black hover:bg-gray-800 hover:text-white transition-all duration-300"
                disabled={inventory === 0}
              >
                {inventory === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
              </Button>
            </div>
            {detailPage?.description && (
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
                      <div className="mt-1">
                        <div className="">
                          <div>
                            <span className="font-semibold">
                              {detailPage?.name}
                            </span>
                            <span>
                              {detailPage?.description?.description_1}
                            </span>
                          </div>
                          <div className="my-2">
                            {detailPage?.description?.description_2}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="cursor-pointer">Tham khảo</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-4 text-balance">
                      <p>
                        {detailPage?.care_instructions}
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>

              </>
            )}
          </div>
        </div>
      </div>
      <Review product_id={detailPage?.product_id} />
      <div className="flex items-center justify-center  bg-gray-100 pb-10">
        <RelatedProducts relatedProducts={relatedProducts} />
      </div>
    </div>
  );
};

export default DetailProductPage;
