
import { Quote, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Progress } from "../ui/progress";
import { Rating, RatingButton } from "../ui/shadcn-io/rating";
import Auth from "@/pages/Auth";
import { useConfirm } from "@/context/confirmContext";
import { toast } from "sonner";
import { createReview, getReviewById } from "@/services/ReviewService";
import { useLoading } from "@/context/loadingContext";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import PaginationComponent from "../Pagination";
import PaginationRecycle from "../Pagination";
const Review = ({ product_id }) => {
    const { withLoading } = useLoading();
    const { confirm } = useConfirm();
    const [showAll, setShowAll] = useState(false);
    const token = localStorage.getItem("token");
    const [listReviews, setListReviews] = useState([]);
    const [infoReviews, setInfoReviews] = useState("");
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const userId = user.user_id || "";
    const [page, setPage] = useState(1);
    const [limit] = useState(5);
    const [total, setTotal] = useState(0);
    const [openLogin, setOpenLogin] = useState(false);

    const fetchReviews = async () => {
        try {
            const res = await getReviewById(product_id, page, limit);
            setListReviews(res.data?.reviews || []);
            setTotal(res.data.total || 0);
            setInfoReviews(res.data?.stats || []);

        } catch (e) {
            console.error("Failed to fetch reviews", e);
        }
    }

    useEffect(() => {
        if (product_id) {
            withLoading(fetchReviews);
        }
    }, [product_id, page]);
    const postReviewProduct = async () => {
        if (!token) {
            setOpenLogin(true);
            return;
        }
        if (rating === 0) {
            toast.error("Vui lòng chọn đánh giá sao!");
            return;
        }
        if (reviewText.trim() === "") {
            toast.error("Vui lòng nhập nội dung đánh giá!");
            return;
        }
        const ok = await confirm("Bạn có chắc chắn muốn gửi đánh giá này không?");
        if (ok) {
            withLoading(async () => {
                try {
                    const data = {
                        user_id: userId,
                        product_id: product_id,
                        rating: rating,
                        comment: reviewText,
                    };
                    await createReview(data);
                    await fetchReviews();
                    toast.success("Đánh giá của bạn đã được gửi thành công!");
                    setRating(0);
                    setReviewText("");
                } catch (error) {
                    console.error("Failed to submit review", error);
                }
            });
        }
    }
    return (
        <>
            <div className="w-full pb-6 mt-10 bg-gray-100">
                <div className=" flex justify-center">
                    <div className="text-lg font-semibold mt-6 uppercase"> Đánh giá sản phẩm</div>

                </div>
                <div className="max-w-7xl mx-auto px-2 py-1 flex">
                    <div className="mt-6 w-1/3 shadow-lg bg-white rounded-lg space-y-4 p-4">
                        <div className="flex justify-between mt-2">

                            <div className="flex ">
                                {infoReviews.avg_rating} <Star width={14} className="mx-2 text-yellow-500 " /> ( {infoReviews.total_reviews} lượt đánh giá)
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    5 sao
                                </div>
                                <div>
                                    <Progress value={infoReviews.star_5_percent} className="w-64 " />
                                </div>
                                <div>
                                    {infoReviews.star_5_percent}%({infoReviews.star_5})
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    4 sao
                                </div>
                                <div>
                                    <Progress value={infoReviews.star_4_percent} className="w-64 " />
                                </div>
                                <div>
                                    {infoReviews.star_4_percent}%({infoReviews.star_4})
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    3 sao
                                </div>
                                <div>
                                    <Progress value={infoReviews.star_3_percent} className="w-64 " />
                                </div>
                                <div>
                                    {infoReviews.star_3_percent}%({infoReviews.star_3})
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    2 sao
                                </div>
                                <div>
                                    <Progress value={infoReviews.star_2_percent} className="w-64 " />
                                </div>
                                <div>
                                    {infoReviews.star_2_percent}%({infoReviews.star_2})
                                </div>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                                <div>
                                    1 sao
                                </div>
                                <div>
                                    <Progress value={infoReviews.star_1_percent} className="w-64 " />
                                </div>
                                <div>
                                    {infoReviews.star_1_percent}%({infoReviews.star_1})
                                </div>
                            </div>
                        </div>
                        <div className="mt-8">
                            Ý kiến đánh giá sản phẩm của bạn.
                        </div>
                        <Rating value={rating} onValueChange={setRating}  >
                            {Array.from({ length: 5 }).map((_, index) => (
                                <RatingButton className="text-yellow-500 " key={index} value={index + 1} />
                            ))}
                        </Rating>
                        <div>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                className="w-full h-52 p-2 border border-gray-300 rounded-sm focus:outline-none "
                                placeholder="Nhập nội dung ở đây..."
                            ></textarea>
                        </div>
                        <div>
                            <button onClick={postReviewProduct} className="px-4 py-2 bg-black text-white rounded-sm hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                                Gửi đánh giá
                            </button>
                        </div>
                    </div>
                    <div className=" ml-4 w-2/3">
                        <div className=" mt-6 space-y-4 shadow-lg p-4 rounded-lg bg-white">
                            <div>
                                {!showAll ? (
                                    <>
                                        {listReviews.slice(0, 3).map((review) => (
                                            <div key={review.review_id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                                <Quote className="text-gray-400" />
                                                <div className="mt-1 text-sm">{review.comment}</div>
                                                <Rating value={review.rating} className="my-1 pointer-events-none">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <RatingButton size={12} className="text-yellow-500" disabled key={index} />
                                                    ))}
                                                </Rating>
                                                <div className="font-bold text-base">{review.full_name}</div>
                                                <div className="text-sm">{review.email}</div>
                                            </div>
                                        ))}
                                        {listReviews.length > 3 && (
                                            <button
                                                onClick={() => setShowAll(true)}
                                                className="my-2 text-gray-500 hover:text-black underline cursor-pointer transition-all duration-200"
                                            >
                                                + Xem tất cả đánh giá
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {listReviews.map((review) => (
                                            <div key={review.review_id} className="border border-gray-200 p-4 rounded-lg mb-4">
                                                <Quote className="text-gray-400" />
                                                <div className="mt-1 text-sm">{review.comment}</div>
                                                <Rating value={review.rating} className="my-1 pointer-events-none">
                                                    {Array.from({ length: 5 }).map((_, index) => (
                                                        <RatingButton size={12} className="text-yellow-500" disabled key={index} />
                                                    ))}
                                                </Rating>
                                                <div className="font-bold text-base">{review.full_name}</div>
                                                <div className="text-sm">{review.email}</div>
                                            </div>
                                        ))}

                                        {/* Phân trang chỉ hiện khi showAll = true */}
                                        <div className="flex justify-center items-center gap-2 mt-4">
                                      

                                            <PaginationRecycle
                                                page={page}
                                                total={total}
                                                limit={limit}
                                                setPage={setPage} />
                                        </div>
                                    </>
                                )}
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            {openLogin && <Auth onClose={() => setOpenLogin(false)} />}
        </>
    );
}
export default Review;