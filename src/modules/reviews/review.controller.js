import reviewModel from "../../../DB/model/reviews.model.js";

// Add a review for a product
export const addReview = async (req, res) => {
    const { productId, UserName, reviewText, rating } = req.body;

    // Validate input
    try {
        if (!productId || !UserName || !reviewText || !rating) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5.' });
        }

        const newReview = new reviewModel({
            productId,
            UserName,
            reviewText,
            rating,
            createdAt: new Date(),
        });

        await newReview.save(); // Save the review to the database

        return res.status(201).json({ message: "Review added successfully", review: newReview });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while adding the review", error });
    }
};

// Show reviews for a product
export const showReviewsForProduct = async (req, res) => {
    const { productId } = req.params;

    try {
        const productReviews = await reviewModel.find({ productId });

        if (productReviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this product.' });
        }

        return res.json({ message: 'Reviews found', reviews: productReviews });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred while fetching the reviews", error });
    }
};
