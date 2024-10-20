import { match } from "assert";
import productModel from "../../../DB/model/product.model.js";
import { pagination } from "../../utils/pagination.js";

//add product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, discount,
            stock, category, subcategory, colors, sizes, status } = req.body;
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const subImages = req.files.map(file => req.file.path);
        const product = new productModel({
            name, description, mainImage: secure_url, subImages: subImages, price, discount,
            stock, category, subcategory, colors, sizes, status
        });
        await product.save();

        return res.status(200).json({ message: "success", product });
    } catch (error) {
        return res.status(500).json({ message: "catch error", error });
    }
}
//get product
export const getProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById({ _id: id });
    return res.status(200).json({ message: "success", product });
}

//get all products
export const getProducts = async (req, res) => {
   const {skip,limit} = pagination(req.query.page,req.query.limit);
    let queryObj = {...req.query};
    const execQuery = ['page','limit'];
    execQuery.map((ele) =>{
        delete queryObj[ele];
    });
    queryObj = JSON.stringify(queryObj);
    queryObj = queryObj.replace(/gt||gte|lt|lte|in|nin|eq/g,match => `$${match}`);
    queryObj = JSON.parse(queryObj);


    const mongoseQuery = productModel.find(queryObj).skip(skip).limit(limit);
    /*populate({
        path: 'reviews',
        populate:{
            path: 'userId',
            select: 'user-_id',
        },
    }).select('name')*/
    if(req.query.search){
        mongoseQuery.find({
            $or :[
                {name : {$regex : req.query.search}},
                {description : {$regex: req.query.search}}
            ]
        });
    }
    const count = await productModel.estimatedDocumentCount();
    const products = await mongoseQuery.sort(req.query.sort);
 
    return res.status(200).json({ message: "success", products });
}

//update product
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { price, description } = req.body;
    const product = await productModel.updateOne({ _id: id }, { price, description });

    if (!product.modifiedCount > 0) {
        return res.status(400).json({ message: "can't update poduct image" });
    }
    return res.status(200).json({ mesage: "success", product });

}

//delete product
export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById(id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    // Extract the public ID from the image URL
    const imageUrl = product.image;
    const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from URL

    // Delete the image from Cloudinary
    await cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
        }
        console.log('Cloudinary delete result:', result);
    });

    product = await productModel.deleteOne({ _id: id });
    return res.status(200).json({ message: "success", product });
}