import React from "react"
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer"
import { Banknote, ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cartContext"
import { clearCart, deleteItemCart, updateQuantityCart } from "@/services/CartService"
import { toast } from "sonner"
import { useConfirm } from "@/context/confirmContext"
import { useLoading } from "@/context/loadingContext"
import { Input } from "./ui/input"

export default function Cart() {
  const { confirm } = useConfirm();
  const { withLoading } = useLoading();
  const { cart, setCart } = useCart();

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty < 1) return;
    await withLoading(async () => {
      try {
        const res = await updateQuantityCart(itemId, { qty: newQty });

        setCart((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.cart_item_id === itemId ? { ...item, qty: res.data.qty } : item
          ),
        }));
      } catch (err) {
        console.error("Lỗi khi cập nhật số lượng:", err);
        toast.error("Không thể cập nhật số lượng");
      }
    });
  };
  console.log("Cart items from context:", cart);
const total = cart?.items?.reduce(
  (sum, item) => sum + (item?.unit_price || 0) * (item?.qty || 0),
  0
) || 0;

  const handleRemoveFromCart = async (itemId) => {
    const ok = await confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    if (ok) {
      await withLoading(async () => {
        try {
          await deleteItemCart(itemId);
          setCart((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.cart_item_id !== itemId),
          }));
          toast.success("Xóa sản phẩm khỏi giỏ hàng thành công");
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
          toast.error("Không thể xóa sản phẩm");
        }
      });
    }
  }
  const handleRemoveAllFromCart = async (itemId) => {
    const ok = await confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm này khỏi giỏ hàng?");
    if (ok) {
      await withLoading(async () => {
        try {
          await clearCart(itemId);
          setCart((prev) => ({
            ...prev,
            items: [],
          }));
          toast.success("Xóa toàn bộ sản phẩm khỏi giỏ hàng thành công");
        } catch (error) {
          console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", error);
          toast.error("Không thể xóa toàn bộ giỏ hàng");
        }
      });
    }
  }
  return (
    <Drawer direction="right" >
      <DrawerTrigger asChild>
        <ShoppingCart className="w-5 h-5 ml-3 cursor-pointer" />
      </DrawerTrigger>

      <DrawerContent className="right-0 top-0 h-full w-96 rounded-none">
        <DrawerHeader className={"flex justify-between"}>

          <DrawerTitle>Giỏ hàng của bạn</DrawerTitle>
          <DrawerDescription>Xem lại sản phẩm bạn đã chọn</DrawerDescription>


          <Button onClick={() => handleRemoveAllFromCart(cart.cart_id)} variant="outline" className="w-full text-red-500 cursor-pointer">Xóa toàn bộ</Button>

        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-y-auto h-[70vh]">
          {cart?.items?.length === 0 ? (
            <p className="text-sm text-gray-500">Giỏ hàng trống</p>
          ) : (
            cart?.items?.map((item) => (
              <div
                key={item.cart_item_id}
                className="border-b pb-4"
              >
                <div className="flex items-center justify-between "
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.variant?.product?.image_url}
                      alt={item.variant?.product?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <span className="text-sm font-medium">{item.variant?.product?.name}</span>
                      <div className="text-xs text-gray-500">{item.variant?.colors[0]?.name} - {item.variant?.sizes[0]?.name}</div>
                    </div>
                  </div>
                  <button
                    className="p-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 onClick={() => handleRemoveFromCart(item.cart_item_id)} className="w-5 h-5 text-red-500 cursor-pointer" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-base font-bold"> {item.unit_price.toLocaleString("vi-VN")}đ</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.qty - 1)}
                    >
                      -
                    </Button>

                    <Input
                      type="number"
                      min={1}
                      value={item.qty}
                      onChange={(e) => handleUpdateQuantity(item.cart_item_id, parseInt(e.target.value, 10) || 1)}
                    />

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.cart_item_id, item.qty + 1)}
                    >
                      +
                    </Button>

                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        <DrawerFooter>
          {/* <Button variant="outline"  className="px-4 py-2 flex justify-between text-orange-400 hover:text-green-500 cursor-pointer">
            <span><Banknote className="w-4 h-4 mr-4 inline "/>Mã giảm giá</span>
          </Button> */}
          <div className="px-4 py-2 flex justify-between font-semibold text-lg">
            <span>Tổng:</span>
            <span>{total.toLocaleString("vi-VN")}đ</span>
          </div>

          <Button className="w-full">Thanh toán</Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Đóng
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
