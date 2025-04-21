import express from 'express';
import { protectRoute } from '../middlewares/auth.js';
import {createCheckoutSession , checkoutSuccess} from '../controllers/payment.js'

const router = express.Router();

router.post("/create-checkout-session",protectRoute,createCheckoutSession);
router.post("/checkout-success",protectRoute,checkoutSuccess)

export default router