import mongoose, { Types, model, Schema } from "mongoose";
import UserModel from "./user.model.js";




const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'not active'],
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: UserModel,
        required: true,
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: UserModel,
        required: true,
    }
})
const CategoryModel= mongoose.model('category',CategorySchema);
export default CategoryModel;