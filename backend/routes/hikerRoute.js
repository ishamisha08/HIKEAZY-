import express from 'express';
import authUser from '../middlewares/authUser.js';
import { getUserData } from '../controllers/hikerControllers.js';

const hikerRouter = express.Router();

hikerRouter.get('/data', authUser, getUserData);

export default hikerRouter;