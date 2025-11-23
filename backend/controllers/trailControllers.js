
import trailModel from "../models/trailModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import bookingModel from "../models/bookingModel.js"
import Trail from "../models/trailModel.js"



export const trailList = async (req,res) =>{

    try{
    const trails = await trailModel.find({}).select(['-password','-email'])

    res.json({success:true,trails})


    }catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }


}

export const deleteTrail = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTrail = await trailModel.findByIdAndDelete(id);

        if (!deletedTrail) {
            return res.status(404).json({ success: false, message: "Trail not found" });
        }

        res.json({ success: true, message: "Trail deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};


//API for Coordinator login
export const loginCoordinator = async (req, res) => {
    try {
      const { email, password } = req.body;
      const trail = await trailModel.findOne({ email }).select("+password"); // Explicitly include the password field
  
      if (!trail) {
        return res.json({ success: false, message: "Invalid Credentials" });
      }
  
      const isMatch = await bcrypt.compare(password, trail.password);
  
      if (isMatch) {
        const token = jwt.sign({ id: trail._id }, process.env.JWT_SECRET);
        res.json({ success: true, token });
      } else {
        return res.json({ success: false, message: "Invalid Credentials" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };




  
  export const bookingsCoordinator = async (req, res) => {
    try {
      console.log('trailsId from middleware:', req.body.trailId); // Debugging line
      const { trailId } = req.body;
  
      if (!trailId) {
        return res.status(400).json({ success: false, message: 'Trail ID is missing.' });
      }
  
      const bookings = await bookingModel.find({ trailId });
  
      res.json({ success: true, bookings });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };



  //API to mark booking completed for booking
  export const bookingComplete = async (req,res) =>{

    try {
      const {trailId, bookingId} = req.body

      const bookingData = await bookingModel.findById(bookingId)

      if (bookingData && bookingData.trailId == trailId){
        await bookingModel.findByIdAndUpdate(bookingId, {isCompleted:true})
        return res.json({success:true,message:'Booking Completed'})
      }else{
        return res.json({success:false, message:'Mark Failed'})
      }
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }


   //API to cancel appoinment for coordinator panel
   export const bookingCancel = async (req,res) =>{

    try {
      const {trailId, bookingId} = req.body

      const bookingData = await bookingModel.findById(bookingId)

      if (bookingData && bookingData.trailId == trailId){
        await bookingModel.findByIdAndUpdate(bookingId, {cancelled:true})
        return res.json({success:true,message:'Appointment Cancelled'})
      }else{
        return res.json({success:false, message:'Cancellation Failed'})
      }
      
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }


  //API Tto get dashboard data for cooerdinator panel

  export const coordinatorDashboard = async (req,res) => {

    try{

      const {trailId} = req.body
      const bookings = await bookingModel.find({trailId:trailId})

      let earnings = 0

      bookings.map((item) => {
        if (item.isCompleted || item.payment){
          earnings += item.amount
        }
      })

      let hikers = []

      bookings.map((item)=>{
        if (!hikers.includes(item.userId)) {
          hikers.push(item.userId)
        }
      })


      const dashData = {
        earnings,
        bookings: bookings.length,
        hikers:hikers.length,
        latestBookings: bookings.reverse().slice(0,20)
      }

      res.json({success:true, dashData})

    }catch(error){
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  //API to get Coordinator profile for coordinator panel
  export const coordinatorProfile = async (req, res) => {
    
    try {

      const {trailId} = req.body
      const profileData = await trailModel.findById(trailId).select('-password')

      res.json({success:true, profileData})
      
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }

  }

  //API to update coordinator profile
  export const updateCoordinatorProfile = async (req, res) => {
    try {

      const {trailId, nationality, packages, mealsOption, guideOption, add_info, dailyQuota } = req.body

      await trailModel.findByIdAndUpdate(trailId, {nationality, packages, mealsOption, guideOption, add_info, dailyQuota})
      res.json({success:true, message:'Profile Updated'})
      
    } catch (error) {
      console.log(error)
      res.json({success:false, message:error.message})
    }
  }
  


  export const getTrailById = async (req, res) => {
    try {
        const { trailId } = req.params;
        const trail = await Trail.findById(trailId);

        if (!trail) {
            return res.status(404).json({ success: false, message: "Trail not found." });
        }

        res.json({ success: true, trail });
    } catch (error) {
        console.error("Error fetching trail:", error.message);
        res.status(500).json({ success: false, message: "Server error." });
    }
};


