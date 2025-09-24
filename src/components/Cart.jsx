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
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Cart() {
  // sau này bạn có thể lấy giỏ hàng từ context hoặc localStorage
  const cartItems = [
    { id: 1, name: "Áo khoác", price: 500000 },
    { id: 2, name: "Quần jean", price: 700000 },
  ]

  const total = cartItems.reduce((sum, item) => sum + item.price, 0)

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <ShoppingCart className="w-5 h-5 ml-3 cursor-pointer" />
      </DrawerTrigger>

      <DrawerContent className="right-0 top-0 h-full w-96 rounded-none">
        <DrawerHeader>
          <DrawerTitle>Giỏ hàng của bạn</DrawerTitle>
          <DrawerDescription>Xem lại sản phẩm bạn đã chọn</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 overflow-y-auto h-[70vh]">
          {cartItems.length === 0 ? (
            <p className="text-sm text-gray-500">Giỏ hàng trống</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b pb-2"
              >
                <span>{item.name}</span>
                <span>{item.price.toLocaleString("vi-VN")}đ</span>
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 flex justify-between font-semibold text-lg">
          <span>Tổng:</span>
          <span>{total.toLocaleString("vi-VN")}đ</span>
        </div>

        <DrawerFooter>
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
