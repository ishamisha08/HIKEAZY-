import express from 'express';

import upload from '../middlewares/multer.js';
import { addReview, getReviewsForTrail } from '../controllers/reviewControllers.js';
import authUser from '../middlewares/authUser.js';

const reviewRouter = express.Router();

// Add a review with a single image
reviewRouter.post('/add', upload.single('image'), addReview);

// Get reviews for a trail
reviewRouter.get('/trail/:trailId', getReviewsForTrail);

export default reviewRouter;
