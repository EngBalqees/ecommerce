import mongoose, { Types, model, Schema } from "mongoose";
import CategoryModel from "./category.model.js";
import UserModel from "./user.model.js";

const subcategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: CategoryModel,
        required: true
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
},
    {
        timestamps: true
    });

const subCategoryModel = mongoose.model('subcategory', subcategorySchema);
export default subCategoryModel;