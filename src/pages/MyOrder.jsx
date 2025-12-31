import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Truck, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; //type: ignore
import { formatVND } from "@/lib/forrmatMoney";
import { useNavigate } from "react-router-dom";
import { getOrderByUser, updateOrder } from "@/services/OrderService";

export default function MyOrder() {
    const [tab, setTab] = useState("all");
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        async function fetchOrders() {
            try {
                if (!user?.user_id) return;
                const res = await getOrderByUser(user.user_id);
                setOrders(res.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);



    const filteredOrders =
        tab === "all" ? orders : orders.filter((o) => o.status === tab);

    // Đếm số lượng đơn hàng theo trạng thái
    const orderCounts = {
        all: orders.length,
        processing: orders.filter((o) => o.status === "processing").length,
        shipping: orders.filter((o) => o.status === "shipping").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
    };

    return (
        <div className="min-h-screen max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Đơn hàng của bạn</h1>

            <Tabs value={tab} onValueChange={setTab} className="w-full">
                <TabsList className="w-full grid grid-cols-5 rounded-lg bg-muted">
                    <TabsTrigger value="all" className="cursor-pointer">
                        <span>Tất cả</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-semibold">
                            {orderCounts.all}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="processing" className="cursor-pointer">
                        <span>Đang xử lý</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                            {orderCounts.processing}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="shipping" className="cursor-pointer">
                        <span>Đang giao</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-600 font-semibold">
                            {orderCounts.shipping}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="cursor-pointer">
                        <span>Hoàn thành</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 font-semibold">
                            {orderCounts.completed}
                        </span>
                    </TabsTrigger>
                    <TabsTrigger value="cancelled" className="cursor-pointer">
                        <span>Đã hủy</span>
                        <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 font-semibold">
                            {orderCounts.cancelled}
                        </span>
                    </TabsTrigger>
                </TabsList>

                <div className="relative mt-6">
                    {loading ? (
                        <div className="flex justify-center py-20 text-muted-foreground">
                            <Loader2 className="animate-spin w-6 h-6 mr-2" />
                            Đang tải đơn hàng...
                        </div>
                    ) : filteredOrders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16 text-muted-foreground"
                        >
                            Không có đơn hàng nào trong mục này.
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <MotionTab key={tab}>
                                {filteredOrders.map((order) => (
                                    <OrderCard
                                        key={order.order_id}
                                        order={order}
                                        navigate={navigate}
                                    />
                                ))}
                            </MotionTab>
                        </AnimatePresence>
                    )}
                </div>
            </Tabs>
        </div>
    );
}

function MotionTab({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="space-y-4"
        >
            {children}
        </motion.div>
    );
}

function OrderCard({ order, navigate }) {
    const icons = {
        processing: <Package className="text-blue-500" />,
        shipping: <Truck className="text-orange-500" />,
        completed: <CheckCircle className="text-green-500" />,
        cancelled: <XCircle className="text-red-500" />,
    };

    const date = new Date(order.placed_at).toLocaleDateString("vi-VN");

    return (
        <Card className="hover:shadow-md transition-all cursor-pointer">
            <CardHeader
                className="flex flex-row items-center justify-between space-y-0 pb-2"
                onClick={() => navigate(`/my-order/${order.order_id}`, { state: { order } })}
            >
                <div className="flex items-center gap-3">
                    {icons[order.status] || <Package className="text-gray-400" />}
                    <CardTitle className="text-base font-semibold">
                        Mã đơn {order.order_id}
                    </CardTitle>
                </div>
                <span className="text-sm text-muted-foreground">{date}</span>
            </CardHeader>
            <CardContent
                className="space-y-3 cursor-pointer"
                onClick={() => navigate(`/my-order/${order.order_id}`, { state: { order } })}
            >
                {order.items && order.items?.length > 0 ? (
                    <>
                        {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="flex items-center gap-3 pb-2 border-b last:border-b-0">
                                <img
                                    src={item.thumbnail}
                                    alt={item.thumbnail}
                                    className="w-16 h-16 object-cover "
                                />
                                <div className="flex-1 min-w-0">

                                    <p className="text-sm font-medium truncate">
                                        {item.product_name || item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Số lượng: {item.qty} | Size: {item.size || 'N/A'}
                                    </p>
                                    <p className="text-sm font-medium text-gray-700">
                                        {formatVND(Math.floor(item.unit_price * item.qty))}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {order.items.length > 2 && (
                            <p className="text-xs text-center text-muted-foreground pt-2">
                                +{order.items.length - 2} sản phẩm khác
                            </p>
                        )}
                    </>
                ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                        Không có thông tin sản phẩm
                    </p>
                )}
            </CardContent>
            <CardContent className="flex items-center justify-between pt-0">
                <p className="text-sm text-muted-foreground">
                    Trạng thái:{" "}
                    <span className="font-medium text-foreground">
                        {order.status === "processing"
                            ? "Đang xử lý"
                            : order.status === "shipping"
                                ? "Đang giao"
                                : order.status === "completed"
                                    ? "Hoàn thành"
                                    : "Đã hủy"}
                    </span>
                </p>
                <p className="text-sm font-medium text-green-600">
                    {formatVND(Math.floor(order.grand_total))}
                </p>
            </CardContent>
        </Card>
    );
}
