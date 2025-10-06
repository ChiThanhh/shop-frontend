import React from "react";
import ProductSlider from "./ProductSlider";
const RelatedProducts = () => {
    const related = [
        { id: 1, name: "Áo thun trắng", image: "/img/shirt1.jpg", price: 199000 },
        { id: 2, name: "Áo sơ mi", image: "/img/shirt2.jpg", price: 299000 },
        { id: 3, name: "Quần jeans", image: "/img/jeans.jpg", price: 399000 },
        { id: 4, name: "Áo khoác", image: "/img/jacket.jpg", price: 499000 },
        { id: 5, name: "Giày sneaker", image: "/img/shoes.jpg", price: 699000 },
        { id: 6, name: "Quần jeans", image: "/img/jeans.jpg", price: 399000 },
        { id: 7, name: "Áo khoác", image: "/img/jacket.jpg", price: 499000 },
        { id: 8, name: "Giày sneaker", image: "/img/shoes.jpg", price: 699000 },
    ]
    return (
        <section className="mt-4">
            <h2 className="text-xl font-bold mb-4 ">Sản phẩm liên quan</h2>
            <ProductSlider product={related} />
        </section>

    );
}
export default RelatedProducts;