import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import transporter from '../config/nodemailer.js'
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'
import { v2 as cloudinary } from 'cloudinary';
import Trail from '../models/trailModel.js'
import bookingModel from '../models/bookingModel.js'; // Import booking model
import moment from 'moment';
import mongoose from 'mongoose';
import Stripe from 'stripe';




// API to register user
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !password || !email) {
            return res.status(400).json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Enter a valid email" })
        }

        // validating a strong password
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const existingUser = await userModel.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" })
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Hikeazy',
            text: `Welcome to Hikeazy website. Your account has been created with email id: ${email}`
        }

        try {
            await transporter.sendMail(mailOptions)
        } catch (error) {
            console.log('Error sending welcome email:', error.message)
        }

        return res.json({ success: true, message: "User registered successfully", token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API for user login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required' })
        }

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.json({ success: true, message: "User logged in successfully", token })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// API for user logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ?
                'none' : 'strict',
        })

        return res.json({ success: true, message: "Logged Out" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//Send Verification OTP to User's Email
export const sendVerifyOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.json({ success: false, message: "Missing User ID" });
        }

        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (user.isAccountVerified) {
            return res.json({ success: false, message: "Account Already Verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            //text: `Your OTP is ${otp}. Verify your account using this OTP.`,
            html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.log('Error sending verification OTP:', error.message);
            return res.json({ success: false, message: 'Failed to send OTP' });
        }

        res.json({ success: true, message: 'Verification OTP sent on Email' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const user = await userModel.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.verifyOtp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();
        return res.json({ success: true, message: 'Email Verified successfully' });
    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
};

//check if user is authenticated
export const isAuthenticated = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.json({ success: false, message: 'User is not authenticated' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id);

        return res.json({ success: true, user: req.user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

//send password reset OTP 
export const sendResetOtp = async (req, res) => {

    const { email } = req.body;

    if (!email) {
        return res.json({ success: false, message: 'Email is required' })
    }

    try {

        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            //text: `Your OTP for resetting your password is ${otp}. Use this OTP to proceed with resetting your password.`,
            html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace("{{email}}", user.email)
        };

        await transporter.sendMail(mailOptions)

        return res.json({ success: true, message: 'OTP sent to your email.' })



    } catch (error) {
        return res.json({ success: false, message: error.message })
    }

}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and new Password are required' })
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(401).json({ success: false, message: 'Invalid OTP' })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(401).json({ success: false, message: 'OTP Expired' })
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: 'Enter a strong password' })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword;
        user.resetOtp = ''
        user.resetOtpExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully.' })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message })
    }
}

//Api to get users profile
export const getProfile = async (req, res) => {
    try {
        const { userId } = req.body;

        // Fetch user by ID
        const user = await userModel.findById(userId);

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the email is verified
        if (!user.isAccountVerified) {
            return res.status(403).json({ success: false, message: "Email not verified. Please verify your account to access the profile." });
        }

        // Return user profile (excluding sensitive data)
        const { password, verifyOtp, resetOtp, ...profile } = user._doc; // Exclude sensitive fields
        return res.status(200).json({ success: true, profile });
    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred while fetching the profile.", error: error.message });
    }
};

//api to update user profile

export const updateProfile = async (req, res) => {
    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            //upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: "Profile Updated" })



    } catch (error) {
        return res.status(500).json({ success: false, message: "An error occurred while fetching the profile.", error: error.message });
    }
}

//Api to book trail

//Api to book trail

export const bookTrail = async (req, res) => {
    console.log("Received Booking Data:", req.body);

    try {
        const {
            userId,
            trailId,
            slotDate,
            state,
            nationality,
            packages,
            mealsOption,
            guideOption,
            rentalOptions,
        } = req.body;

        // Validate required fields
        if (!userId || !trailId || !slotDate || !state) {
            return res.status(400).json({ success: false, message: "Missing required fields." });
        }

        const formattedDate = new Date(slotDate).toISOString().split('T')[0]; // Ensure date is in 'YYYY-MM-DD' format

        // Fetch trail data
        const trailData = await Trail.findById(trailId);
        if (!trailData) {
            return res.status(404).json({ success: false, message: "Trail not found." });
        }

        console.log("Fetched Trail Data:", trailData);

        // Initialize selected guide as null
        let selectedGuide = null;

        if (guideOption) {
            // Find the selected guide
            selectedGuide = trailData.guideOption?.guidesInfo.find(
                (guide) => guide.guideName === guideOption?.guidesInfo?.[0]?.guideName
            );

            if (!selectedGuide) {
                return res.status(404).json({ success: false, message: "Guide not found or not selected." });
            }

            // Check assigned hikers for the selected date
            const currentHikers = selectedGuide.assignedHikers?.get(formattedDate) || 0;
            if (currentHikers + 1 > selectedGuide.maxHikers) {
                return res.status(400).json({
                    success: false,
                    message: `Guide "${selectedGuide.guideName}" is fully booked for ${formattedDate}.`,
                });
            }

            // Update the guide's assignedHikers map
            selectedGuide.assignedHikers = selectedGuide.assignedHikers || new Map();
            selectedGuide.assignedHikers.set(formattedDate, currentHikers + 1);
        }

        // Initialize bookingsPerDay if undefined
        trailData.bookingsPerDay = trailData.bookingsPerDay || new Map();
        const currentBookings = trailData.bookingsPerDay.get(formattedDate) || 0;

        console.log(`Current bookings for ${formattedDate}:`, currentBookings);
        console.log(`Daily quota for this trail:`, trailData.dailyQuota);

        if (currentBookings >= trailData.dailyQuota) {
            return res.status(400).json({ success: false, message: "Trail fully booked for the selected date." });
        }

        // Fetch user data
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Validate rental options
        const validRentalOptions = rentalOptions.map((rental) => {
            const trailRental = trailData.rentalOptions.find(item => item.item === rental.item);
            if (!trailRental) {
                throw new Error(`Rental item "${rental.item}" not found in trail.`);
            }
            if (trailRental.rentedQuantity + rental.rentedQuantity > trailRental.quantity) {
                throw new Error(
                    `Not enough stock for "${rental.item}". Available: ${trailRental.quantity - trailRental.rentedQuantity}`
                );
            }
            trailRental.rentedQuantity += rental.rentedQuantity;
            return rental;
        });

        // Calculate total amount
        const nationalityAmount = nationality.malaysian > 0 ? nationality.malaysian : nationality.foreign;
        const packageAmount = packages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);
        const mealAmount = mealsOption.reduce((sum, meal) => sum + (meal.price || 0), 0);
        const guideAmount = guideOption?.price || 0;
        const rentalAmount = validRentalOptions.reduce(
            (sum, rental) => sum + (rental.price || 0) * (rental.rentedQuantity || 0),
            0
        );
        const totalAmount = nationalityAmount + packageAmount + mealAmount + guideAmount + rentalAmount;

        // Create booking
        const booking = new bookingModel({
            userId,
            trailId,
            slotDate: formattedDate,
            state,
            nationality,
            packages,
            mealsOption,
            guideOption,
            rentalOptions: validRentalOptions,
            userData: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                image: userData.image || '',
            },
            trailData: {
                name: trailData.name,
                state: trailData.state,
                location: trailData.location,
                image: trailData.image?.[0] || '', // First image from the array or an empty string

            },
            amount: totalAmount,
        });

        // Atomic operation with session
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // Update trail bookings
            trailData.bookingsPerDay.set(formattedDate, currentBookings + 1);
            await trailData.save({ session });

            // Save booking
            await booking.save({ session });

            await session.commitTransaction();
            session.endSession();

            console.log("Booking Saved Successfully:", booking);

            res.json({
                success: true,
                message: "Booking successful!",
                booking: {
                    id: booking._id,
                    userId: booking.userId,
                    trailId: booking.trailId,
                    slotDate: booking.slotDate,
                    amount: booking.amount,
                    date: booking.date,
                },
            });
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error during transaction:", err);
            throw err;
        }
    } catch (error) {
        console.error("Booking error:", error.message || error);
        res.status(500).json({ success: false, message: error.message || "An error occurred during booking." });
    }
};


// API to get user appoinments for frontend my-bookings page

export const listBooking = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required." });
        }

        // Fetch the bookings for the user
        const bookings = await bookingModel.find({ userId });

        if (!bookings) {
            return res.status(404).json({ success: false, message: "No bookings found." });
        }

        // Populate the trail data with image and mapUrl from packages
        const bookingDetails = await Promise.all(bookings.map(async (booking) => {
            const trailData = await Trail.findById(booking.trailId); // Fetch the full trail data

            // Ensure the trail data includes the image and mapUrl fields for packages
            const packageWithMapUrl = trailData.packages.map(pkg => {
                // If the package has stays, we need to check for mapUrl in stays
                if (pkg.stays && pkg.stays.length > 0) {
                    pkg.stays.forEach(stay => {
                        // Ensure stay has a mapUrl
                        stay.mapUrl = stay.mapUrl || '';
                    });
                }
                
                // Ensure mapUrl is available for packages without stays
                pkg.mapUrl = pkg.mapUrl || '';  // Default to empty string if no mapUrl

                return pkg;
            });

            return {
                ...booking.toObject(),
                trailData: {
                    ...trailData.toObject(),
                    image: trailData.image || [],  // Include the image field
                    packages: packageWithMapUrl
                }
            };
        }));

        res.json({ success: true, booking: bookingDetails });

    } catch (error) {
        console.error("Booking List error:", error.message || error);
        res.status(500).json({ success: false, message: error.message || "An error occurred during listing." });
    }
};

//API to cancel booking

export const cancelBooking = async (req, res) => {
    try {
        const { userId, bookingId } = req.body;

        // Find the booking
        const bookingData = await bookingModel.findById(bookingId);
        if (!bookingData) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        // Verify booking user
        if (bookingData.userId !== userId) {
            return res.status(403).json({ success: false, message: "Unauthorized action." });
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





const stripe = new Stripe(process.env.STRIPE_KEY_SECRET);

export const createCheckoutSession = async (req, res) => {
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  
    try {
      const { userId, bookingId, amount, items } = req.body;
  
      // Validate required fields
      if (!userId || !bookingId || !amount || !items || !Array.isArray(items)) {
        return res.status(400).json({
          success: false,
          message: "Missing or invalid required fields (userId, bookingId, amount, items).",
        });
      }
  
      // Validate items structure
      if (!items.every(item => item.name && item.amount && item.quantity)) {
        return res.status(400).json({
          success: false,
          message: "Each item must include 'name', 'amount', and 'quantity'.",
        });
      }
  
      // Log received data
      console.log("Received Payload:", req.body);
  
      // Create line items for Stripe checkout
      const line_items = items.map((item) => ({
        price_data: {
          currency: "myr",
          product_data: { name: item.name || `Booking ${bookingId}` },
          unit_amount: Math.round(item.amount * 100), // Convert to smallest currency unit
        },
        quantity: item.quantity || 1, // Default to 1
      }));
  
      // Log line items
      console.log("Line Items for Stripe:", line_items);
  
      // Create Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        line_items,
        mode: 'payment',
        success_url: `${FRONTEND_URL}/verify?success=true&orderId=${bookingId}`,
        cancel_url: `${FRONTEND_URL}/verify?success=false&orderId=${bookingId}`,
      });
  
      // Log session details
      console.log("Stripe Session Created:", session);
  
      // Respond with session URL
      res.json({ success: true, session_url: session.url });
    } catch (error) {
      console.error("Error creating checkout session:", error.message || error);
      res.status(500).json({ success: false, message: "Failed to create checkout session." });
    }
  };






  export const verifyPayment = async (req, res) => {
    const { bookingId, success } = req.body;
  
    try {
      // Validate the request body
      if (!bookingId) {
        return res.status(400).json({ success: false, message: "Booking ID is required." });
      }
  
      // Convert `success` to a boolean
      const paymentSuccess = success === true || success === "true";
  
      console.log("Verifying Payment:", { bookingId, success, paymentSuccess });
  
      if (paymentSuccess) {
        // Update booking to mark it as paid
        const updatedBooking = await bookingModel.findByIdAndUpdate(
          bookingId,
          { payment: true },
          { new: true }
        );
  
        if (!updatedBooking) {
          return res.status(404).json({ success: false, message: "Booking not found." });
        }
  
        console.log("Payment Verified:", updatedBooking);
        return res.json({ success: true, message: "Payment verified successfully." });
      } else {
        // Update booking to mark it as canceled
        const updatedBooking = await bookingModel.findByIdAndUpdate(
          bookingId,
          { cancelled: true },
          { new: true }
        );
  
        if (!updatedBooking) {
          return res.status(404).json({ success: false, message: "Booking not found." });
        }
  
        console.log("Payment Failed, Booking Cancelled:", updatedBooking);
        return res.json({ success: false, message: "Payment was not successful." });
      }
    } catch (error) {
      console.error("Error verifying payment:", error.message || error);
      res.status(500).json({ success: false, message: "Failed to verify payment." });
    }
  };
  

  // Leaderboard endpoint in userControllers.js
export const getLeaderboard = async (req, res) => {
    try {
        const users = await userModel.find().sort({ points: -1 }).select("name points image");
        res.status(200).json({ success: true, leaderboard: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Failed to fetch leaderboard." });
    }
};
