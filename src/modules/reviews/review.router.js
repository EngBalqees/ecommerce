import { Router } from "express";
import * as reviewController from "./review.controller.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
const router = Router();

router.get('/showProductReviews/:id',asyncHandler(reviewController.showreviewsforProduct));
router.post('/addnewReview',asyncHandler(reviewController.addreview));

export default router;
