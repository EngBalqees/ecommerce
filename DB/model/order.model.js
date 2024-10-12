import mongoose ,{Schema,model,Types} from "mongoose";

const OrderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed'],
        default: 'pending'
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    }
}, { timestamps: true});

const order = mongoose.model('order',OrderSchema);
export default order;