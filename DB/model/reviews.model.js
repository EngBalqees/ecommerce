import mongoose, { Types, model, Schema } from "mongoose";
import productModel from "./product.model.js";
import UserModel from "./user.model.js";
const reviewsSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: productModel,
        required: true
    },
   UserName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
        required: true
    },
    reviewText :{
        type : String,
        required : true
    },
    rating:{
        type : Number,
        required : true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: UserModel,
    },

});
const reviewModel = model( "review",reviewsSchema);
export default reviewModel;