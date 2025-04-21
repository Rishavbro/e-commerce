import express from 'express';
import { protectRoute } from '../middlewares/auth.js';
import {createCheckoutSession , createCheckOutSuccess} from '../controllers/payment.js'

const router = express.Router();

router.post("/create-checkout-session",protectRoute,createCheckoutSession);
router.post("/checout-success",protectRoute,createCheckOutSuccess)

export default router