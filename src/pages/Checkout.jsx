import { Input } from "@/components/ui/input";
import React, { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import lgMomo from "@/assets/momo.png";
import lgVnpay from "@/assets/vnpay.png";
import lgBank from "@/assets/bank.png";
import lgMoney from "@/assets/money.png";
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cartContext";
import { Badge } from "@/components/ui/badge";
import { Tag, Tags, Ticket } from "lucide-react";
import { getAllDistricts, getAllProvinces, getAllWards } from "@/services/AddressService";
import { useLoading } from "@/context/loadingContext";
import { useLocation, useNavigate } from "react-router-dom";
import { formatVND } from "@/lib/forrmatMoney";
import { createOrder } from "@/services/OrderService";
import { toast } from "sonner";
import { useConfirm } from "@/context/confirmContext";
import { clearCart } from "@/services/CartService";
export default function Checkout() {
    const { confirm } = useConfirm();
    const { withLoading } = useLoading();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const username = user?.full_name || "";
    const { cart, setCart } = useCart();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    console.log("Cart in checkout:", cart);
    //
    const [phone, setPhone] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");
    const [selectedProvinceName, setSelectedProvinceName] = useState("");
    const [selectedDistrictName, setSelectedDistrictName] = useState("");
    const [selectedPaymentMethodName, setSelectedPaymentMethodName] = useState("");
    const [selectedShippingMethodName, setSelectedShippingMethodName] = useState("");
    const [selectedWardName, setSelectedWardName] = useState("");
    const [selectedShippingMethod, setSelectedShippingMethod] = useState("option-on");
    const [selectedDeliveryFee, setSelectedDeliveryFee] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("option-one");
    const [detailAddress, setDetailAddress] = useState("");
    //
    const location = useLocation();
    const coupon = location.state?.coupon || null;
    const note = location.state?.note || "";

    const payments = [
        {
            id: "option-one",
            icon: lgMoney,
            label: "Thanh toán khi nhận hàng (COD)",
            desc: "Bạn sẽ thanh toán trực tiếp cho nhân viên giao hàng khi nhận sản phẩm."
        },
        {
            id: "option-two",
            icon: lgBank,
            label: "Chuyển khoản ngân hàng",
            desc: "Thanh toán qua tài khoản ngân hàng, vui lòng ghi rõ mã đơn hàng trong nội dung chuyển khoản."
        },
        {
            id: "option-three",
            icon: lgMomo,
            label: "Ví Momo",
            desc: "Sử dụng ví Momo để thanh toán nhanh chóng và an toàn."
        },
        {
            id: "option-four",
            icon: lgVnpay,
            label: "Thanh toán online qua VNPay",
            desc: "Liên kết với ngân hàng nội địa hoặc thẻ quốc tế qua cổng VNPay."
        }
    ]

    useEffect(() => {
        const fetchDataProvince = async () => {
            const listProvince = await getAllProvinces();
            setProvinces(listProvince.data);
        }
        fetchDataProvince();
    }, [])
    useEffect(() => {
        if (!selectedProvince) return;
        const fetchDistricts = async () => {
            const res = await getAllDistricts(selectedProvince);
            setDistricts(res.data.districts);

            setWards([]);
            setSelectedDistrict("");
            setSelectedWard("");
        }
        fetchDistricts();
    }, [selectedProvince])
    useEffect(() => {
        if (!selectedDistrict) return;
        const fetchWards = async () => {
            const res = await getAllWards(selectedDistrict);
            setWards(res.data.wards);
            setSelectedWard("");
        };
        fetchWards();
    }, [selectedDistrict]);

    const deliveryFee = () => {
        if (selectedProvince == 79 || selectedProvince == "") {
            return 40000;
        } else {
            return 100000;
        }
    };

    const tempPrice = cart?.items?.reduce(
        (sum, item) => sum + (item?.unit_price || 0) * (item?.qty || 0),
        0
    ) || 0;
    const discount = coupon?.amount ? coupon.amount : 0;
    const total = tempPrice - discount + selectedDeliveryFee;

    const fullAddress = `${detailAddress || ""}, ${selectedWardName}, ${selectedDistrictName}, ${selectedProvinceName}`;

    const handleSubmit = async () => {
        if(phone && !/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(phone)) {
            toast.error("Số điện thoại không hợp lệ. Vui lòng nhập lại.");
            return;
        }
        if(!phone || !detailAddress || !selectedProvince || !selectedDistrict || !selectedWard) {
            toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
            return;
        }
        const ok = await confirm("Hãy kiểm tra kỹ thông tin trước khi đặt hàng. Bạn có chắc chắn muốn đặt hàng không?");
        if (!ok) return;
        try {
            const orderItems = cart.items.map((item) => ({
                product_id: item.variant?.product?.product_id,
                variant_id: item.variant?.variant_id,
                sku: item.variant?.sku || "",
                name: item.variant?.product?.name,
                color: item.variant?.colors?.[0]?.name || "",
                size: item.variant?.sizes?.[0]?.name || "",
                qty: item.qty,
                unit_price: item.unit_price,
                discount_amount: 0,
                tax_amount: 0,
                total_amount: item.qty * item.unit_price
            }));
            const orderData = {
                user_id: user.user_id,
                status: "processing",
                currency: "VND",
                subtotal: tempPrice,
                discount_total: discount,
                shipping_fee: selectedDeliveryFee,
                tax_total: 0,
                grand_total: total,

                shipping_address: fullAddress,
                billing_address: fullAddress,
                phone: phone,
                note: note,

                coupon_code: coupon?.code,
                promo_snapshot: coupon?.title,
                items: orderItems,
                payment_method: selectedPaymentMethodName || "Thanh toán khi nhận hàng (COD)",
                shipping_method: selectedShippingMethodName || "Giao hàng tiêu chuẩn",
            }
            const res = await createOrder(orderData);
            await clearCart(cart?.cart_id);
            toast.success("Đặt hàng thành công!");
            navigate("/order-success", { state: { order: res.data } });
            setCart({ items: [] });
        } catch (error) {
            toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
            console.error("Error creating order:", error);
        }
    }

    return (<>
        <div className="p-4 mt-6 space-y-4 max-w-6xl mx-auto h-screen">
            <h1 className="text-2xl font-bold">Thông tin thanh toán</h1>
            <div className="flex gap-7">
                <div className="py-6 px-6 shadow-sm w-1/2">
                    <div>
                        <div className="uppercase font-bold mb-4">Thông tin giao hàng</div>

                        <div className="text-sm underline">
                            Khách hàng: <span className="font-semibold">{username}</span>
                        </div>
                        <div className="mt-4">
                            <div className="text-sm mb-2">
                                <div className="font-semibold text-sm mb-1">Số điện thoại:</div>
                                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại"></Input>
                            </div>
                            <div className="text-sm mb-2">
                                <div className="font-semibold text-sm mb-1">Địa chỉ nhận hàng:</div>
                                <div className="flex gap-2 items-center">
                                    <div className="flex-1">
                                        <Select
                                            onValueChange={(val) => {
                                                const province = provinces.find(p => p.code === val);
                                                setSelectedProvince(val);
                                                setSelectedProvinceName(province?.name || "");
                                            }}
                                            value={selectedProvince}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn tỉnh" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {provinces.map((province) => (
                                                    <SelectItem key={province.code} value={province.code}>
                                                        {province.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <Select onValueChange={(val) => {
                                            const district = districts.find(d => d.code === val);
                                            setSelectedDistrict(val);
                                            setSelectedDistrictName(district?.name || "");
                                        }}
                                            value={selectedDistrict}
                                            disabled={!districts.length}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn huyện" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((district) => (
                                                    <SelectItem key={district.code} value={district.code}>
                                                        {district.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="flex-1">
                                        <Select
                                            onValueChange={(val) => {
                                                const ward = wards.find(w => w.code === val);
                                                setSelectedWard(val);
                                                setSelectedWardName(ward?.name || "");
                                            }}
                                            value={selectedWard}
                                            disabled={!wards.length}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn xã" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {wards.map((ward) => (
                                                    <SelectItem key={ward.code} value={ward.code}>
                                                        {ward.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Input value={detailAddress}
                                        onChange={(e) => setDetailAddress(e.target.value)} className="mt-2" placeholder="Nhập địa chỉ cụ thể"></Input>

                                </div>

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="uppercase font-bold mb-4 mt-6">Phương thức vận chuyển</div>
                        <div>
                            <RadioGroup value={selectedShippingMethod}
                                onValueChange={(val) => {
                                    setSelectedShippingMethod(val);
                                    if (val === "option-on") {
                                        setSelectedDeliveryFee(0);
                                    } else if (val === "option-tw") {
                                        setSelectedDeliveryFee(deliveryFee());
                                    }
                                    setSelectedShippingMethodName(val === "option-on" ? "Giao hàng tiêu chuẩn" : "Giao hàng nhanh");
                                }}>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-on" id="option-on" />
                                    <Label htmlFor="option-on">Giao hàng tiêu chuẩn <span className="font-light">(0 đ)</span></Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="option-tw" id="option-tw" />
                                    <Label htmlFor="option-tw">Giao hàng nhanh <span className="font-light">({formatVND(deliveryFee())})</span></Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div>
                        <div className="uppercase font-bold mb-4 mt-6">Phương thức thanh toán</div>
                        <div>
                            <RadioGroup
                                value={selectedPaymentMethod}
                                onValueChange={(val) => {
                                    setSelectedPaymentMethod(val);
                                    const payment = payments.find(p => p.id === val);
                                    setSelectedPaymentMethodName(payment?.label || "");
                                }}
                                className="space-y-2"
                            >
                                {payments.map((p) => (
                                    <div key={p.id}>
                                        <Label
                                            htmlFor={p.id}
                                            className="flex items-center gap-3 border border-gray-300 p-3 rounded cursor-pointer hover:bg-gray-50"
                                        >
                                            <RadioGroupItem value={p.id} id={p.id} />
                                            <img src={p.icon} className="w-6" alt={p.label} />
                                            <span className="flex-1">{p.label}</span>
                                        </Label>

                                        <AnimatePresence>
                                            {selectedPaymentMethod === p.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="text-sm text-gray-600 mt-2 overflow-hidden pl-9 pr-3"
                                                >
                                                    {p.desc}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>


                    </div>
                </div>

                <div className="w-1/2">
                    <div>
                        {cart?.items?.map((item) => (
                            <div key={item.cart_item_id} className="border-b pb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <img
                                                src={item.variant?.product?.image_url}
                                                alt={item.variant?.product?.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <Badge
                                                variant="destructive"
                                                className="absolute bg-gray-400 -top-2 -right-2 h-5 min-w-5 rounded-full px-1 flex items-center justify-center text-[12px]"
                                            >
                                                {item?.qty || 0}
                                            </Badge>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium">{item.variant?.product?.name}</span>
                                            <div className="text-xs text-gray-500">{item.variant?.colors[0]?.name} - {item.variant?.sizes[0]?.name}</div>
                                        </div>
                                    </div>

                                    <span className="text-base font-bold">{item.unit_price.toLocaleString("vi-VN")}đ</span>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-1  border-b pb-4">
                        <div className="flex justify-between ">
                            <span className="text-sm">Tạm tính</span>
                            <span className="text-sm">{formatVND(tempPrice)}</span>
                        </div>
                        <div className="flex justify-between ">
                            <div className="flex items-center">
                                <div className="text-sm mr-1">Mã giảm giá</div>
                                <Tag className="w-4 h-4 text-blue-300" />
                                <span className="text-sm font-light ml-2">{coupon?.code}</span>
                            </div>
                            <span className="text-sm">{formatVND(coupon?.amount)}</span>
                        </div>
                        <div className="flex justify-between ">
                            <span className="text-sm">Phí vận chuyển</span>
                            <span className="text-sm">{formatVND(selectedDeliveryFee)}</span>
                        </div>
                        <div className="flex justify-between ">
                            <span className="text-sm">Phương thức thanh toán</span>
                            <span className="text-sm">
                                {payments.find(p => p.id === selectedPaymentMethod)?.label || "Chưa chọn"}
                            </span>

                        </div>
                        <div className="flex justify-between ">
                            <span className="text-sm">Ghi chú</span>
                            <span className="text-sm">{note}</span>

                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between mt-4">
                            <span className="text-sm">Tổng cộng</span>
                            <span className="text-xl">{formatVND(total)}</span>
                        </div>
                    </div>
                    <div >
                        <Button onClick={handleSubmit} size="lg" className="w-full cursor-pointer mt-10">Đặt hàng</Button>
                    </div>
                </div>
            </div>


        </div>
    </>);
}