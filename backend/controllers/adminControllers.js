import validator from "validator";
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from "cloudinary";
import trailModel from "../models/trailModel.js";
import jwt from 'jsonwebtoken'
import bookingModel from "../models/bookingModel.js";
import Trail from "../models/trailModel.js";
import userModel from "../models/userModel.js";

const addTrail = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            state,
            location,
            nationality,
            packages,
            mealsOption,
            guideOption,
            add_info,
            dailyQuota,
            bookingsPerDay,
            slots_booked,


        } = req.body;

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3,image4].filter((item)=> item !== undefined)

        let imagesUrl = await Promise.all (
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )


        const rentalImages = req.files.rentalImages || []

        const rentalImagesUrls = await Promise.all(
            rentalImages.map(async (item) => {
                const result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url;
            })
        )

        const rentalOptions = req.body.rentalOptions
        ? JSON.parse(req.body.rentalOptions).map((option, index) => ({
            ...option,
            image: rentalImagesUrls[index] || null // Assign image URL if uploaded
        }))
        : [];


        if (!name || !email || !password || !state || !nationality) {
            return res.status(400).json({ success: false, message: "Missing required details" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please enter a strong password" });
        }

        const parsedNationality =
            typeof nationality === 'string' ? JSON.parse(nationality) : nationality;

        if (
            !parsedNationality ||
            typeof parsedNationality.malaysian !== 'number' ||
            typeof parsedNationality.foreign !== 'number'
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid nationality format. It should include 'malaysian' and 'foreign' as numbers.",
            });
        }

        // Parse mealsOption safely
        let parsedMealsOption;
        try {
            parsedMealsOption = typeof mealsOption === 'string' ? JSON.parse(mealsOption) : mealsOption;
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid mealsOption format" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const trailData = {
            name,
            email,
            password: hashedPassword,
            state,
            image: imagesUrl,
            location,
            nationality: parsedNationality,
            packages: typeof packages === 'string' ? JSON.parse(packages) : packages,
            mealsOption: parsedMealsOption,
            guideOption: typeof guideOption === 'string' ? JSON.parse(guideOption) : guideOption,
            add_info,
            dailyQuota, 
            bookingsPerDay: typeof bookingsPerDay === 'string' ? JSON.parse(bookingsPerDay) : bookingsPerDay,
            slots_booked: typeof slots_booked === 'string' ? JSON.parse(slots_booked) : slots_booked,
            rentalOptions,



            date: Date.now(),
        };

        console.log("Prepared Trail Data:", trailData);

        const newTrail = new trailModel(trailData);
        await newTrail.save();

        res.json({ success: true, message: "Trail added successfully" });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Duplicate key error: A trail with this email already exists.",
            });
        }

        console.log("Error in addTrail:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};





//API for admin Login
const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body

        const token = jwt.sign({ email, password }, process.env.JWT_SECRET);

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, password }, process.env.JWT_SECRET);

            res.json({ success: true, token })

        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

//API to get all Trail list for admin panel 

const allTrail = async (req,res) => {
    try {

        const trail = await trailModel.find({}).select('-password')
        res.json({success:true,trail})

    } catch (error){

        console.log(error)
        res.json({success:false, message:error.message})
    }

}

//API to get all bookings list 
const bookingsAdmin = async (req,res) =>{
    try{

    const bookings = await bookingModel.find({})
    res.json({success:true,bookings})

    }catch (error){
        console.log(error)
        res.json({success:false, message:error.message})
    }
}

//API for booking cancellation
const bookingCancel = async (req, res) => {
    try {
        const { bookingId } = req.body;

        // Find the booking
        const bookingData = await bookingModel.findById(bookingId);
        if (!bookingData) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        // Mark the booking as canceled
        await bookingModel.findByIdAndUpdate(bookingId, { cancelled: true });

        // Release trail slot
        const { trailId, slotDate } = bookingData;
        const formattedDate = new Date(slotDate).toISOString().split("T")[0]; // Ensure consistent date format
        const trailData = await Trail.findById(trailId);

        if (!trailData) {
            return res.status(404).json({ success: false, message: "Trail not found." });
        }

        // Update the bookingsPerDay for the selected date
        trailData.bookingsPerDay = trailData.bookingsPerDay || new Map();
        const currentBookings = trailData.bookingsPerDay.get(formattedDate) || 0;

        if (currentBookings > 0) {
            trailData.bookingsPerDay.set(formattedDate, currentBookings - 1);
        }

        await trailData.save();

        res.json({ success: true, message: "Booking cancelled successfully and daily quota updated." });
    } catch (error) {
        console.error("Booking Cancel error:", error.message || error);
        res.status(500).json({ success: false, message: "An error occurred during cancelling." });
    }
};


//API to get dashboard data for admin table

const adminDashboard = async (req, res) => {

    try {

        const trails = await trailModel.find({})
        const users = await userModel.find({})
        const bookings = await bookingModel.find({}) 
        
        const dashData ={
            trails: trails.length,
            bookings: bookings.length,
            hikers: users.length,
            latestBookings: bookings.reverse().slice(0,30)
        }

        res.json({success:true, dashData})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }


}


 

export { addTrail, loginAdmin,allTrail,bookingsAdmin, bookingCancel,adminDashboard};
