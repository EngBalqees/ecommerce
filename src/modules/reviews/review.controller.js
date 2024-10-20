import reviewModel from "../../../DB/model/reviews.model.js";

let reviews = [];
export const addreview = async (req, res) => {
    const { productId, UserName, reviewText, rating } = req.body;
    // Validate input
    try {
        if (!productId || !UserName || !reviewText || !rating) {
            return res.status(400).json({ error: 'All fields are required.' });
        }
        const newReview = {
            productId,
            UserName,
            reviewText,
            createdAt: new Date(),
            rating,
        };
        reviews.push(newReview);
        return res.status(201).json(newReview);
    } catch (error) {
        return res.status(500).json({ message: "catch error", error });
    }

}
export const showreviewsforProduct = async (req, res) => {
    const { productId } = req.params;
    const productReviews = reviews.filter(review => review.productId === productId);
    if (productReviews.length === 0) {
        return res.status(404).json({ message: 'No reviews found for this product.' });
    }
    return res.json(productReviews);
}