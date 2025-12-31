import React, { useState, useEffect } from "react"
import StickyBox from "react-sticky-box"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import ProductItem from "@/components/product/ProductItem"
import { getProduct } from "@/services/ProductService"
import { getCategory } from "@/services/CategoryService"
import { getColor } from "@/services/ColorService"
import { getSize } from "@/services/SizeService"
import { useLocation } from "react-router-dom"
import { useLoading } from "@/context/loadingContext"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"


export default function Product() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [colors, setColors] = useState([])
    const { withLoading } = useLoading();
    const [sizes, setSizes] = useState([])
    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const categoryQuery = queryParams.get("category") || null
    const searchQuery = queryParams.get("search") || ""
    const [params, setParams] = useState({
        search: searchQuery,
        category_id: categoryQuery,
        colors: [],
        sizes: [],
        price_min: 0,
        price_max: 2000000,
    })
    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: searchQuery,
            category_id: categoryQuery,
        }))
    }, [searchQuery, categoryQuery])
    useEffect(() => {
        const fetchData = async () => {
            const res = await getProduct(params)
            setProducts(res.data)

            // filter options
            const resCat = await getCategory()
            const resCol = await getColor()
            const resSize = await getSize()

            setCategories(resCat.data)
            setColors(resCol.data)
            setSizes(resSize.data)
        }
        withLoading(fetchData)
    }, [params])

    const toggleFilter = (key, value) => {
        setParams(prev => {
            if (key === "category_id") {
                return { ...prev, category_id: value === "all" ? null : value }
            }
            const list = prev[key] || []
            const exists = list.includes(value)
            return {
                ...prev,
                [key]: exists ? list.filter(i => i !== value) : [...list, value],
            }
        })
    }

    return (
        <div className="min-h-screen w-full p-6 flex gap-6 mx-10 relative">
            <StickyBox offsetTop={100} offsetBottom={20} className="w-1/6 border-r border-gray-300 pr-4 h-fit">
                <h3 className="text-lg font-semibold mb-4 underline">Bộ lọc</h3>

                <div className="mb-8 ml-10">
                    <h4 className="font-bold mb-4">Danh mục</h4>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <Checkbox
                                className="cursor-pointer"
                                checked={params.category_id === null}
                                onCheckedChange={() => toggleFilter("category_id", "all")}
                            />
                            <Label className="cursor-pointer">Tất cả</Label>
                        </div>

                        {categories
                            .filter(cat => !cat.parent_id) // chỉ lấy cha
                            .map(parent => (
                                <div key={parent.category_id}>
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            className="cursor-pointer"
                                            checked={params.category_id === parent.category_id}
                                            onCheckedChange={() => toggleFilter("category_id", parent.category_id)}
                                        />
                                        <Label className="cursor-pointer font-semibold">{parent.name}</Label>
                                    </div>

                                    {/* render con */}
                                    <div className="ml-10 flex flex-col gap-2 mt-1">
                                        {categories
                                            .filter(child => child.parent_id === parent.category_id)
                                            .map(child => (
                                                <div key={child.category_id} className="flex items-center gap-3  ">
                                                    <Checkbox
                                                        className="cursor-pointer"
                                                        checked={params.category_id === child.category_id}
                                                        onCheckedChange={() => toggleFilter("category_id", child.category_id)}
                                                    />
                                                    <Label className="cursor-pointer">{child.name}</Label>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>


                {/* Color */}
                <div className="mb-8 ml-10">
                    <h4 className="font-bold mb-4">Màu sắc</h4>
                    <div className="flex flex-col gap-2">
                        {colors.map(col => (
                            <div key={col.color_id} className="flex items-center gap-3">
                                <Checkbox className="cursor-pointer"
                                    checked={params.colors.includes(col.color_id)}
                                    onCheckedChange={() => toggleFilter("colors", col.color_id)}
                                />
                                <Label className="cursor-pointer">{col.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Size */}
                <div className="mb-8 ml-10">
                    <h4 className="font-bold mb-4">Kích cỡ</h4>
                    <div className="flex flex-col gap-2">
                        {sizes.map(size => (
                            <div key={size.size_id} className="flex items-center gap-3">
                                <Checkbox className="cursor-pointer"
                                    checked={params.sizes.includes(size.size_id)}
                                    onCheckedChange={() => toggleFilter("sizes", size.size_id)}
                                />
                                <Label className="cursor-pointer">{size.name}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price */}
                <div className="mb-8 ml-10">
                    <h4 className="font-bold mb-4">Khoảng giá</h4>
                    <Slider
                        defaultValue={[params.price_min, params.price_max]}
                        max={2000000}
                        step={50000}
                        className="w-40 cursor-pointer"
                        onValueChange={([min, max]) =>
                            setParams({ ...params, price_min: min, price_max: max })
                        }
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span>{params.price_min.toLocaleString()}đ</span>
                        <span>{params.price_max.toLocaleString()}đ</span>
                    </div>
                </div>
            </StickyBox>

            {/* Products */}
            <main className="w-5/6 px-4 mr-10">
                <h2 className="text-xl font-bold mb-4">Danh sách sản phẩm</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.length === 0 ? (
                        <div className="col-span-full text-center text-muted-foreground py-20">
                            Không tìm thấy sản phẩm nào.
                        </div>
                    ) : null}
                    {products.map((p, i) => (
                        <div key={i} className="hover:shadow-sm transition-shadow duration-300 rounded-md bg-white">
                            <ProductItem {...p} />
                        </div>
                    ))}
                </div>
            </main>
        </div>
    )
}

