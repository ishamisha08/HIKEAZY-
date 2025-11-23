import mongoose, { Schema, model } from "mongoose";

const trailSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    image: { type: Array, required: true },
    state: { type: String, required: true },
    location: { type: String, trim: true },
    nationality: {
        malaysian: { type: Number, required: true },
        foreign: { type: Number, required: true},
    },
    packages: [
        {
            duration: [{ type: String, required: true }],
            stays: [
                {
                    place: { type: String, trim: true },
                    price: { type: Number, required: true, min: 0 },
                    mapUrl: { type: String, trim: true }
                }
            ],
            mapUrl: { type: String, trim: true }
        }
    ],
    mealsOption: [
        { 
            mealsIncluded: { type: Boolean, default: false },
            price: { type: Number, min: 0 },
            specialNotes: { type: String, trim: true },  
        }
    ],
    guideOption: {
        guideIncluded: { type: Boolean, default: false },
        price: { type: Number, min: 0 } ,
        guidesInfo: [
            {
                guideName: { type: String, required: true, trim: true }, 
                contactNumber: { type: String, required: true, trim: true }, 
                email: { type: String, required: true, lowercase: true }, 
                experience: { type: Number, min: 0 }, 
                maxHikers: { type: Number, min: 0 }, 
                assignedHikers: {
                    type: Map, // Use a Map to store date-specific counts
                    of: Number, // The count of hikers per date
                    default: {}, // Default to an empty map
                },
            }
        ]
    },
    rentalOptions: [
        {
            item: { type: String, trim: true },
            image: { type: String, trim: true },
            price: { type: Number, min: 0 },
            quantity: { type: Number, required: true, min: 0 },
            rentedQuantity: { type: Number, default: 0, min: 0 }
        }
    ],

    reviews: [ 
        {
            userName: { type: String, required: true, trim: true },
            image: { type: String, required: true, trim: true },
            trailImage: { type: String, trim: true },
            comment: { type: String, required: true, trim: true }
        }
    ],
    slots_booked: { type: Object, default: {} },
    add_info: { type: String, trim: true },
    dailyQuota: { type: Number, required: true, min: 0 },
    bookingsPerDay: { type: Map, of: Number, default: {} }

}, { minimize: false, timestamps: true });

const Trail = model('trail', trailSchema);
export default Trail;