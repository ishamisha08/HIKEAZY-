import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";

const Reviews = ({ userId, trailId, bookingId }) => {
    const [comment, setComment] = useState("");
    const [image, setImage] = useState(null); // Single image
    const [reviews, setReviews] = useState([]); // State to hold reviews

    const { backendUrl } = useContext(AppContext);

    // Fetch reviews for the trail
    const fetchReviews = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/review/trail/${trailId}`);
            if (response.data.success) {
                setReviews(response.data.reviews || []);
            } else {
                toast.error("Failed to fetch reviews.");
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            toast.error("Failed to fetch reviews.");
        }
    };

    useEffect(() => {
        if (trailId) {
            fetchReviews();
        }
    }, [trailId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]); // Store the single selected image
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId || !trailId || !bookingId) {
            toast.error("Missing required information to submit the review.");
            return;
        }

        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("trailId", trailId);
        formData.append("bookingId", bookingId);
        formData.append("comment", comment);

        if (image) {
            formData.append("image", image); // Single image
        }

        try {
            const response = await axios.post(`${backendUrl}/api/review/add`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            toast.success("Review submitted successfully!");
            setComment("");
            setImage(null); // Reset the selected image
            fetchReviews(); // Refresh reviews after submission
        } catch (error) {
            console.error("Error submitting review:", error.response || error.message);
            toast.error("Failed to submit review.");
        }
    };

    return (
        <div className="bg-gray-100 p-6 rounded-lg shadow-lg space-y-8">
            {/* Review Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md space-y-4"
            >
                <h2 className="text-2xl font-semibold text-gray-800 text-center">
                    Submit Your Review
                </h2>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Write your review..."
                        required
                    ></textarea>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {image && (
                        <p className="text-sm text-gray-600 mt-2">
                            Selected file: <span className="font-medium">{image.name}</span>
                        </p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#333A5C] text-white py-3 rounded-lg shadow-md hover:bg-[#1f283e] transition-all duration-200"
                >
                    Submit Review
                </button>
            </form>

            {/* Reviews List */}
            <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Hikers Reviews</h2>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div
                                key={review._id}
                                className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row items-start md:items-center gap-4"
                            >
                                <div className="flex-shrink-0">
                                    <img
                                        src={
                                            review.userId?.image ||
                                            assets.default_image
                                        }
                                        alt={review.userId?.name || "User"}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-800">
                                        {review.userId?.name || "Anonymous"}
                                    </h3>
                                    <p className="text-gray-600 mt-2">{review.comment}</p>
                                    {review.image && (
                                        <img
                                            src={review.image}
                                            alt="Review"
                                            className="mt-4 w-48 h-48 object-cover rounded-lg"
                                        />
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">
                                        {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to leave a review!</p>
                )}
            </div>
        </div>
    );
};

export default Reviews;
