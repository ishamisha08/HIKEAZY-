import express from 'express';
import { bookingCancel, bookingComplete, bookingsCoordinator, coordinatorDashboard, coordinatorProfile, deleteTrail, getTrailById, loginCoordinator, trailList, updateCoordinatorProfile } from '../controllers/trailControllers.js';
import authCoordinator from '../middlewares/authCoordinator.js';

const trailRouter = express.Router();

// Admin route for fetching all trails
trailRouter.get('/list', trailList);



// Admin route for deleting a trail
trailRouter.delete('/delete/:id', deleteTrail);

trailRouter.post('/login',loginCoordinator)

trailRouter.get('/bookings', authCoordinator, bookingsCoordinator)

trailRouter.post('/complete-booking', authCoordinator, bookingComplete)
trailRouter.post('/cancel-booking', authCoordinator, bookingCancel)

trailRouter.get('/dashboard', authCoordinator, coordinatorDashboard)

trailRouter.get('/profile', authCoordinator, coordinatorProfile)
trailRouter.post('/update-profile', authCoordinator, updateCoordinatorProfile)


trailRouter.get('/:trailId', getTrailById);


export default trailRouter;
