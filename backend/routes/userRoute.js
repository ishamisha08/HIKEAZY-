import express from 'express'
import { registerUser,loginUser, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword, getProfile, updateProfile, bookTrail, listBooking, cancelBooking, createCheckoutSession, verifyPayment, getLeaderboard} from '../controllers/userControllers.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import userModel from '../models/userModel.js'


const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/logout', logout )
userRouter.post('/send-verify-otp', authUser, sendVerifyOtp )
userRouter.post('/verify-account', authUser, verifyEmail )
userRouter.get('/is-auth', authUser, isAuthenticated )
userRouter.post('/send-reset-otp', sendResetOtp )
userRouter.post('/reset-password', resetPassword )


userRouter.get('/get-profile', authUser, getProfile )
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)

userRouter.post('/book-trail',authUser ,bookTrail);
userRouter.get('/bookings', authUser,listBooking)
userRouter.post('/cancel-booking', authUser,cancelBooking)

// New payment route
userRouter.post('/create-checkout-session',authUser, createCheckoutSession);
userRouter.post('/verify',verifyPayment);


userRouter.get('/leaderboard', getLeaderboard);


userRouter.get('/', async (req, res) => {
    try {
      const users = await userModel.find().select("_id name"); // Fetch only _id and name
      res.status(200).json({ success: true, users });
    } catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ success: false, message: "Error fetching users." });
    }
  });
  


export default userRouter

