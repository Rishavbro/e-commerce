
import express from 'express';
import {getCoupon,validateCoupon}from '../controllers/coupon.js'
import { protectRoute ,  } from '../middlewares/auth.js';

const router = express.Router();

router.get("/",protectRoute,getCoupon)
router.post("/validate",protectRoute,validateCoupon)

export default router;