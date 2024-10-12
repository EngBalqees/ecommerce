import mongoose , { Types, model, Schema } from "mongoose";

const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
});
const Cart = mongoose.model('Cart',cartSchema);
export default Cart;