import DialogCoupon from "@/components/order/DialogCoupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/cartContext";
import { useConfirm } from "@/context/confirmContext";
import { useLoading } from "@/context/loadingContext";
import { formatVND } from "@/lib/forrmatMoney";
import { deleteItemCart, updateQuantityCart } from "@/services/CartService";
import { Banknote, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CartProduct() {
    const { cart, setCart } = useCart();
    const { withLoading } = useLoading();
    const navigate = useNavigate();
    const { confirm } = useConfirm();
    const [open, setOpen] = useState(false);
    const [selectCoupon, setSelectCoupon] = useState(null);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [note, setNote] = useState("");
    const coupons = [
        {
            id: 1,
            code: "SALE100K",
            title: "Giảm 100.000đ cho đơn từ 649.000đ",
            expiry: "31/12/2025",
            amount: 100000,
            ticket: "Giảm 100k",
            detail: [
                "Giảm giá 100k khi mua từ 649k trở lên đối với sản phẩm áp dụng khuyến mãi.",
                "Áp dụng cho một vài sản phẩm. Xem danh sách sản phẩm.",
                "Giảm giá 1 lần trên toàn bộ đơn hàng.",
                "Mã khuyến mãi không được sử dụng chung với chương trình khuyến mãi khác.",
                "Khu vực giao hàng áp dụng trên toàn quốc.",
                "Có hiệu lực từ 01/10/2025.",
            ],
        },
        {
            id: 2,
            code: "SALE60K",
            title: "Giảm 60.000đ cho đơn từ 500.000đ",
            expiry: "31/12/2025",
            amount: 60000,
            ticket: "Giảm 60k",

            detail: [
                "Giảm 60k khi mua từ 500k trở lên.",
                "Áp dụng cho tất cả các sản phẩm thời trang.",
                "Không áp dụng cùng mã khác.",
                "Có hiệu lực từ 01/10/2025.",
            ],
        },
        {
            id: 3,
            code: "FREESHIP",
            title: "Miễn phí vận chuyển toàn quốc",
            expiry: "31/12/2025",
            amount: 15000,
            ticket: "Miễn phí vận chuyển",

            detail: [
                "Áp dụng cho tất cả đơn hàng từ 300k.",
                "Giảm phí ship toàn quốc.",
                "Không áp dụng với các chương trình khuyến mãi khác.",
                "Có hiệu lực từ 01/10/2025.",
            ],
        },
    ]

    const handleApplyCoupon = () => {
        if (!selectCoupon?.code) {
            toast.error("Vui lòng nhập mã giảm giá trước khi áp dụng");
            return;
        }

        const foundCoupon = coupons.find(
            (c) => c.code.toUpperCase() === selectCoupon.code.toUpperCase()
        );

        if (!foundCoupon) {
            toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
            return;
        }

        setAppliedCoupon(foundCoupon);
        toast.success(`Đã áp dụng mã ${foundCoupon.code}`);
    };


    const handleUpdateQuantity = async (itemId, newQty) => {
        if (newQty < 1) return;

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
        }

    };

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

    const tempPrice = cart?.items?.reduce(
        (sum, item) => sum + (item?.unit_price || 0) * (item?.qty || 0),
        0
    ) || 0;
    const discount = appliedCoupon ? appliedCoupon.amount : 0;
    const total = tempPrice - discount;
    return (
        <>
            <div className="p-4 mt-6 space-y-4 max-w-6xl mx-auto ">

                <div className="w-full ">
                    <div className="text-lg font-bold uppercase mb-4">Giỏ hàng của bạn</div>
                    {cart?.items?.map((item) => (
                        <div key={item.cart_item_id} className="border-b pb-4">
                            <div className="flex items-center justify-between">
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
                                <div className="flex items-center justify-between space-x-4">
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
                                    <span className="text-base font-bold">{item.unit_price.toLocaleString("vi-VN")}đ</span>
                                    <button
                                        className="p-1 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 onClick={() => handleRemoveFromCart(item.cart_item_id)} className="w-5 h-5 text-red-500 cursor-pointer" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className=" flex ">
                    <div className="w-2/3">
                        <div>
                            <span className="text-lg font-bold  mb-4">Mã giảm giá</span>
                            <div className="flex items-center">
                                <Input placeholder="Nhập mã giảm giá"
                                    value={selectCoupon?.code || ""}
                                    onChange={(e) => setSelectCoupon({ ...selectCoupon, code: e.target.value })}
                                    className="w-1/2 mt-2" />
                                <Button onClick={handleApplyCoupon} className="bg-black text-white py-2 rounded cursor-pointer mt-2 ml-2">Áp dụng</Button>
                            </div>
                        </div>
                        <div className="bg-gray-100 w-full p-4 mt-3 rounded-lg shadow-sm">
                            <div className="flex justify-between text-sm">
                                <span>Mã khuyến mãi</span>
                                <span onClick={() => setOpen(true)} className="underline cursor-pointer">Xem tất cả</span>
                            </div>
                            <div className="mt-3 flex gap-2 ">
                                {coupons.map((coupon) => (
                                    <div key={coupon.id} className="text-sm bg-white px-4 py-2 flex text-gray-500 border border-black/20 ">
                                        <Banknote className="w-5 h-5 text-gray-500 mr-2" /> {coupon.ticket}
                                    </div>
                                ))}

                            </div>
                        </div>
                        <div className="mt-3 font-bold">
                            <span>Ghi chú</span>
                            <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ghi chú cho đơn hàng" className="w-full h-24 border mt-1 p-3 rounded-lg font-normal " />
                        </div>
                        <div className="mt-3 flex items-center justify-between  ">
                            <span className="uppercase font-bold">Xuất hóa đơn công ty</span>
                            <Switch />
                        </div>
                    </div>
                    <div className="flex flex-col border p-4 rounded w-1/3 ml-4 h-full min-h-[360px] justify-between">
                        <div className="gap-4 flex flex-col">
                            <div className="flex justify-between text-sm">
                                <span>Tạm tính:</span>
                                <span className="font-base"> {formatVND(tempPrice)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span>Giảm giá:</span>
                                <span className="font-base line-through">{formatVND(discount)}</span>
                            </div>

                        </div>
                        <div>
                            <div className="flex justify-between text-base mt-4">
                                <span>Tổng tiền:</span>
                                <span className="font-bold text-lg">{formatVND(total)}</span>
                            </div>
                            <Button onClick={() =>
                                navigate("/checkout", { state: { coupon: appliedCoupon, note: note } })
                            }
                                className="bg-black text-white py-3 rounded cursor-pointer w-full mt-2">
                                Thanh toán
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <DialogCoupon
                open={open}
                onOpenChange={setOpen}
                coupons={coupons}
                onSelectCoupon={(coupon) => {
                    toast.success(`Đã sao chép mã ${coupon.code}.`);
                    setOpen(false);
                }}
            />
        </>
    );
}
