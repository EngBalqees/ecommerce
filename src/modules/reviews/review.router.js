import { Router } from "express";
import * as reviewController from "./review.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { auth } from "../../midleware/auth.js";// Fixed typo in "middleware"


const router = Router();

// Route to show all reviews for a specific product
router.get('/getProductReviews/:id', asyncHandler(reviewController.showReviewsForProduct));

// Route to add a new review (authentication middleware can be added if needed)
router.post('/addNewReview', auth(["User", "Admin"]), asyncHandler(reviewController.addReview));

export default router;
