import { Router } from "express";
import { auth } from "../../midleware/auth.js";
import * as couponController from "./coupon.controller.js";

const router = Router();
router.post('/createcoupon',auth(['Admin']),couponController.createCoupon);
router.get('/getcoupons',auth(['Admin']),couponController.getAllCoupons);
router.delete('/deletecoupon/:id',auth(['Admin']),couponController.deleteCoupon);
export default router;