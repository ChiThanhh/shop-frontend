import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import React, { useState } from "react"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

export default function DialogCoupon({ open, onOpenChange, onSelectCoupon , coupons }) {
    const [expandedId, setExpandedId] = useState(null)

  

    const handleCopy = (coupon) => {
        navigator.clipboard.writeText(coupon.code)
        onSelectCoupon?.(coupon)
        onOpenChange(false)
    }

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Mã giảm giá hiện có</DialogTitle>
                    <DialogDescription>
                        Chọn một mã khuyến mãi để áp dụng cho đơn hàng của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                    {coupons.map((coupon) => (
                        <div
                            key={coupon.id}
                            className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{coupon.title}</p>
                                    <p className="text-sm text-gray-500">HSD: {coupon.expiry}</p>
                                    <button
                                        className="text-xs text-blue-500 cursor-pointer mt-1"
                                        onClick={() => toggleExpand(coupon.id)}
                                    >
                                        {expandedId === coupon.id ? "Ẩn chi tiết" : "Chi tiết"}
                                    </button>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold mb-1">{coupon.code}</p>
                                    <Button
                                        size="sm"
                                        onClick={() => handleCopy(coupon)}
                                        className="cursor-pointer"
                                    >
                                        Sao chép
                                    </Button>
                                    
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedId === coupon.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-3 overflow-hidden text-sm text-gray-600 space-y-1"
                                    >
                                        {coupon.detail.map((line, idx) => (
                                            <p key={idx}>• {line}</p>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
