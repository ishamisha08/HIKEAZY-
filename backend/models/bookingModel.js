import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true }, // ID of the user making the booking
        trailId: { type: String, required: true }, // ID of the trail being booked
        slotDate: { type: Date, required: true }, // Date of the slot booked (use Date type)
        state: { type: String, required: true }, // State of the trail
        nationality: {
            malaysian: { type: Number, required: true },
            foreign: { type: Number, required: true},
        },
        packages: [
            {
                duration: [{ type: String, required: true }], // Duration of the package
                stays: [
                    {
                        place: { type: String, required: true, trim: true }, // Stay location
                        mapUrl: { type: String, trim: true }, // Map URL of the location
                    },
                ],
            },
        ],
        mealsOption: [
            {
                mealsIncluded: { type: Boolean, default: false }, // Whether meals are included
                specialNotes: { type: String, trim: true }, // Special notes for meals
            },
        ],
        guideOption: {
            guideIncluded: { type: Boolean, default: false }, // Whether a guide is included
            guidesInfo: [
                {
                    guideName: { type: String, required: true, trim: true }, // Guide's name
                    contactNumber: { type: String, required: true, trim: true }, // Guide's contact
                    email: { type: String, required: true, trim: true, lowercase: true }, // Guide's email
                },
            ],
        },
        rentalOptions: [
            {
                item: { type: String, required: true, trim: true }, // Rental item name
                rentedQuantity: { type: Number, default: 0, min: 0 }, // Quantity rented
            },
        ],
        userData: { 
            type: Object, 
            required: true,
            // Optional: Define structure if possible for clarity
        }, // User details
        trailData: { 
            type: Object, 
            required: true,
            // Optional: Define structure if possible for clarity
        }, // Additional trail data
        amount: { type: Number, required: true, min: 0 }, // Total booking amount (ensure positive values)
        date: { type: Date, default: Date.now }, // Use Date type for booking creation timestamp
        cancelled: { type: Boolean, default: false }, // Whether the booking was cancelled
        payment: { type: Boolean, default: false }, // Payment status
        isCompleted: { type: Boolean, default: false }, // Completion status
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);
export default bookingModel;
