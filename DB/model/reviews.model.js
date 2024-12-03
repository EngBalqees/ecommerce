import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Assuming you have a Product model
        required: true,
    },
    UserName: {
        type: String,
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
        maxlength: 1000, // Optionally, set a max length for review text
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5, // Rating should be between 1 and 5
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const reviewModel = mongoose.model('Review', reviewSchema);

export default reviewModel;
