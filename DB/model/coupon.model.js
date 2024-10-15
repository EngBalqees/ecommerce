import mongoose, {model, Schema,Types} from "mongoose";

const couponSchema = new Schema({
    Name:{
        type: String,
        required: true,
        unique: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    discountType: {
        type: String,
        enum: ['percent', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minimumOrderValue: {
        type: Number,
        default: 0
    },
    usedBy:[{
        userId: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
    }],
},{
    timestamps: true,
});
const coupon = model('coupon',couponSchema);
export default coupon;