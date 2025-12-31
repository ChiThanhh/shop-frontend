import React, { use, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import TopHeader from "./TopHeader";
import { getCategory } from "@/services/CategoryService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import Auth from "@/pages/Auth";
import { LogOut, ReceiptText, ShoppingCart, Heart, Clock, CircleUser } from "lucide-react";
import { Dialog } from "@radix-ui/react-dialog";
import { logoutApi } from "@/services/AuthService";
import { toast } from "sonner";
import { useLoading } from "@/context/loadingContext";
import { Drawer } from "./ui/drawer";
import Cart from "./order/Cart";
import { Badge } from "./ui/badge";
import { useCart } from "@/context/cartContext";
import CategoryMenu from "./CategoryMenu";
import { TextRevealButton } from "./ui/shadcn-io/text-reveal-button";
import ThemeToggle from "./ThemeToggle";
import { useWishlist } from "@/context/WishlistContext";

export default function Header() {
    const { withLoading } = useLoading();
    const navigate = useNavigate();
    const { cart, setCart } = useCart();
    const { wishlist } = useWishlist();
    const [search, setSearch] = useState("")
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

    const handleSearch = (e) => {
        if (e.key === "Enter") {
            const value = search.trim()
            if (value === "") {
                navigate("/product-list");
                return;
            }
            navigate(`/product-list?search=${encodeURIComponent(value)}`)
        }
    }
    return (
        <>

            <header className="w-full border-b shadow-lg sticky top-0 z-50 bg-white dark:bg-gray-900 transition-colors">
                <TopHeader />
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link data-aos="fade-in" data-aos-delay="700" to="/" className="text-[8px] font-bold tracking-tight">
                         <TextRevealButton text="Peanut.io" />
                    </Link>

                    <div data-aos="fade-in" data-aos-delay="800" className="hidden md:flex items-center gap-3 text-base">
                        <Input placeholder="Tìm kiếm sản phẩm..." className="w-96" value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch} />
                    </div>
                    <nav className="hidden md:flex items-center gap-6 text-base">
                        <CategoryMenu categories={categories} />
                    </nav>


                    <div className="hidden md:flex items-center gap-3">
                        
                        {/* Dark Mode Toggle */}
                 
                             <ThemeToggle/>

                        {/* Wishlist */}
                        <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')}>
                            <Heart className="w-5 h-5 text-gray-700 dark:text-white" />
                            {wishlist.length > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-2 h-4 min-w-4 c rounded-full px-1 flex items-center justify-center text-[10px] "
                                >
                                    {wishlist.length}
                                </Badge>
                            )}
                        </div>

                        {/* View History */}
                        <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/view-history')}>
                            <Clock className="w-5 h-5 text-gray-700 dark:text-white" />
                        </div>

                        {token ? (
                            <div data-aos="fade-in" className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700 dark:text-white">{user.full_name}</span>

                                <button onClick={() => setOpenConfirmDialog(true)} className="cursor-pointer hover:opacity-70 transition-opacity" >
                                    <LogOut className="w-5 h-5 text-gray-700 dark:text-white" />

                                </button>
                            </div>
                        ) : (
                            <div data-aos="fade-in">
                                <Button onClick={() => setOpenAuthDialog(true)} className="bg-black text-white hover:bg-gray-800 transition-all duration-300 cursor-pointer">
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
                        <div className="relative ml-2 cursor-pointer hover:opacity-70 transition-opacity">

                            <ReceiptText onClick={() => navigate('/my-order')} className="w-5 h-5 font-light text-gray-700 dark:text-white" />

                        </div>
                        <div className="relative ml-2 cursor-pointer hover:opacity-70 transition-opacity">

                            <CircleUser  onClick={() => navigate('/profile')} className="w-5 h-5 font-light text-gray-700 dark:text-white" />

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
                        <div className="fixed  inset-0 flex items-center justify-center z-50">
                            <motion.div
                                className="absolute inset-0 bg-black/50"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setOpenConfirmDialog(false)}
                            />

                            <motion.div
                                className="relative z-10 dark:bg-gray-800 bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
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
