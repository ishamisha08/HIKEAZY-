import express from 'express';
import { addTrail, allTrail, loginAdmin, bookingsAdmin, bookingCancel, adminDashboard } from '../controllers/adminControllers.js';
import upload from '../middlewares/multer.js';
import authAdmin from '../middlewares/authAdmin.js';

const adminRouter = express.Router();

// Allow multiple images
adminRouter.post('/add-trail',authAdmin, upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1},{ name: 'rentalImages', maxCount: 10 }]), addTrail);
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-trail',authAdmin, allTrail)


adminRouter.get('/bookings',authAdmin, bookingsAdmin)
adminRouter.post('/cancel-booking',authAdmin,bookingCancel)

adminRouter.get('/dashboard',authAdmin,adminDashboard)

// Add error handling middleware
adminRouter.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
});

export default adminRouter