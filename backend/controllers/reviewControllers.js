import bookingModel from '../models/bookingModel.js';
import reviewModel from '../models/reviewModel.js';

import trailModel from '../models/trailModel.js';
import { v2 as cloudinary } from 'cloudinary';
import userModel from '../models/userModel.js';

export const addReview = async (req, res) => {
    try {
        const { userId, trailId, bookingId, comment } = req.body;

        // Validate input
        if (!userId || !trailId || !bookingId || !comment) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        // Check if the booking exists and belongs to the user
        const booking = await bookingModel.findOne({ _id: bookingId, userId, trailId });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found or invalid.' });
        }

        // Check if a review already exists for this booking
        const existingReview = await reviewModel.findOne({ bookingId });
        if (existingReview) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this booking.' });
        }

        // Process and upload the image to Cloudinary
        let imageUrl = null;
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'image' });
                imageUrl = result.secure_url;
            } catch (error) {
                console.error('Image upload error:', error);
                return res.status(500).json({ success: false, message: 'Failed to upload the image.' });
            }
        }

        // Save the review
        const review = new reviewModel({
            userId,
            trailId,
            bookingId,
            comment,
            image: imageUrl, // Save a single image URL
        });

        await review.save();

        // Increment the user's points by 5
        const user = await userModel.findByIdAndUpdate(
            userId,
            { $inc: { points: 5 } }, // Increment points by 5
            { new: true } // Return the updated user document
        );

        res.status(201).json({
            success: true,
            message: 'Review added successfully. You earned 5 points!',
            review,
            userPoints: user.points, // Include updated points in response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while adding the review.' });
    }
};

// Fetch reviews for a trail
export const getReviewsForTrail = async (req, res) => {
    try {
        const { trailId } = req.params;

        // Find reviews for the given trail
        const reviews = await reviewModel
            .find({ trailId })
            .populate('userId', 'name image') // Populate user details
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
    }
};
