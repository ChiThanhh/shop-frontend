import React from "react";
import ProductSlider from "./ProductSlider";
const RelatedProducts = ({ relatedProducts }) => {

    return (
        <section className="mt-4">
            <h2 className="text-xl font-bold mb-4 ">Sản phẩm liên quan</h2>
            {relatedProducts.length > 0 && (
                <ProductSlider product={relatedProducts} />
            )}
        </section>

    );
}
export default RelatedProducts;