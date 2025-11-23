import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        trailId: { type: mongoose.Schema.Types.ObjectId, ref: 'trail', required: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'booking', required: true },
        comment: { type: String, required: true, trim: true },
        image: { type: String, default: '' }, // Single image URL
        createdAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema);
export default reviewModel;
