import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import TopHeader from "./TopHeader";
import { getCategory } from "@/services/CategoryService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "@/pages/Auth";
import { LogOut, ShoppingCart } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { logoutApi } from "@/services/AuthService";
import { toast } from "sonner";
import { useLoading } from "@/context/loadingContext";
import { Drawer } from "./ui/drawer";
import Cart from "./Cart";
import { Badge } from "./ui/badge";
import { useCart } from "@/context/cartContext";

export default function Header() {
    const { withLoading } = useLoading();
    const { cart, setCart } = useCart();
    const [open, setOpen] = useState(false);
    const [openAuthDialog, setOpenAuthDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [categories, setCategories] = useState([]);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    useEffect(() => {
        const fetchData = async () => {
            const data = await getCategory();
            setCategories(data.data);
        };
        withLoading(fetchData);
    }, []);

    const getChildren = (parentId) =>
        categories
            .filter((cat) => cat.parent_id === parentId)
            .sort((a, b) => a.sort_order - b.sort_order);
    const handleLogout = async () => {
        withLoading(async () => {
            await logoutApi();
            await logoutApi();
            setOpenConfirmDialog(false);
            toast.success("Đăng xuất thành công!");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.reload();
        });
    }
    return (
        <>
            <TopHeader />
            <header className="w-full border-b shadow-lg ">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link data-aos="fade-in" data-aos-delay="700" to="/" className="text-xl font-bold tracking-tight">
                        Fashion<span className="text-primary">Shop</span>
                    </Link>

                    <div data-aos="fade-in" data-aos-delay="800" className="hidden md:flex items-center gap-3 text-base">
                        <Input placeholder="Tìm kiếm sản phẩm..." className="w-96" />
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-base">
                        {categories
                            .filter((item) => item.level === "1")
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((item, index) => {
                                const children = getChildren(item.category_id);
                                return (
                                    <div
                                        data-aos="fade-down"
                                        data-aos-delay={index * 100}
                                        key={item.category_id} className="relative group">
                                        <Link
                                            to={item.slug}
                                            className="hover:text-primary px-2 py-1 font-medium transition-colors duration-200"
                                        >
                                            {item.name}
                                        </Link>

                                        {children.length > 0 && (
                                            <div
                                                className="absolute left-0 top-full hidden group-hover:flex flex-col bg-white border border-gray-200 shadow-lg min-w-[300px] z-50 rounded-lg overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transform -translate-y-2"
                                            >
                                                {children
                                                    .sort((a, b) => a.sort_order - b.sort_order)
                                                    .map((child,) => (

                                                        <Link
                                                            key={child.category_id}
                                                            to={child.slug}
                                                            className="px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            {child.name}
                                                        </Link>

                                                    ))}
                                            </div>
                                        )}

                                    </div>
                                );
                            })}
                    </nav>


                    <div className="hidden md:flex items-center gap-3">

                        {token ? (
                            <div data-aos="fade-in" className="flex items-center gap-3">
                                <span className="text-sm font-medium">{user.full_name}</span>

                                <button onClick={() => setOpenConfirmDialog(true)} className="cursor-pointer" >
                                    <LogOut className="w-5 h-5" />

                                </button>
                            </div>
                        ) : (
                            <div data-aos="fade-in">
                                <Button onClick={() => setOpenAuthDialog(true)} className="bg-black text-white hover:text-gray-900 hover:text-white transition-all duration-300 cursor-pointer">
                                    Đăng ký / Đăng nhập
                                </Button>
                            </div>
                        )}
                        <div className="relative">

                            <Cart />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-2 h-4 min-w-4 rounded-full px-1 flex items-center justify-center text-[10px]"
                            >
                                {cart?.items?.length || 0}
                            </Badge>
                        </div>
                    </div>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setOpen(!open)}
                    >
                        +
                    </button>
                </div>
                {open && (
                    <div className="md:hidden border-t bg-white px-4 py-3 space-y-2">
                        {categories
                            .filter((item) => item.level === "1")
                            .sort((a, b) => a.sort_order - b.sort_order)
                            .map((item) => (
                                <Link
                                    key={item.category_id}
                                    to={item.path}
                                    className="block hover:text-primary"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        <div className="w-full mt-3 flex gap-2">
                            <Button className="mb-1 w-1/2 bg-white text-black border border-gray-400 hover:bg-gray-300 hover:text-gray-900 transition-all duration-300">
                                Đăng ký
                            </Button>
                            <Button className="w-1/2 bg-gray-800 text-white hover:text-gray-900 hover:text-white transition-all duration-300">
                                Đăng nhập
                            </Button>
                        </div>
                    </div>
                )}
            </header>
            <AnimatePresence mode="wait">
                {openAuthDialog && <Auth onClose={() => setOpenAuthDialog(false)} />}
            </AnimatePresence>

            <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
                <AnimatePresence>
                    {openConfirmDialog && (
                        <div className="fixed inset-0 flex items-center justify-center z-50">
                            <motion.div
                                className="absolute inset-0 bg-black/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpenConfirmDialog(false)}
                            />

                            <motion.div
                                className="relative z-10 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
                                initial={{ opacity: 0, scale: 0.9, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                                transition={{ duration: 0.25, ease: "easeOut" }}
                            >
                                <h2 className="text-lg font-medium mb-4">Xác nhận đăng xuất</h2>
                                <p className="mb-4">Bạn có chắc chắn muốn đăng xuất không?</p>
                                <div className="flex justify-end gap-3">
                                    <Button className="cursor-pointer" variant="outline" onClick={() => setOpenConfirmDialog(false)}>
                                        Hủy
                                    </Button>
                                    <Button className="cursor-pointer" onClick={handleLogout}>Đăng xuất</Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </Dialog>



        </>
    );
}
