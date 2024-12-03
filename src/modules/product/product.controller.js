import { match } from "assert";
import productModel from "../../../DB/model/product.model.js";
import { pagination } from "../../utils/pagination.js";

//add product
export const addProduct = async (req, res) => {
    try {
        const { name, description, price, discount, stock, category, subcategory, colors, sizes, status } = req.body;

        if (!req.file || !req.files) {
            return res.status(400).json({ message: "File(s) are required" });
        }

        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const subImages = req.files.map(file => file.path); // Corrected mapping
        const product = new productModel({
            name,
            description,
            mainImage: secure_url,
            subImages,
            price,
            discount,
            stock,
            category,
            subcategory,
            colors,
            sizes,
            status,
        });

        await product.save();

        return res.status(200).json({ message: "success", product });
    } catch (error) {
        console.error("Error in addProduct:", error);
        return res.status(500).json({ message: "catch error", error });
    }
};
//get product
export const getProduct = async (req, res) => {
    const { id } = req.params;
    const product = await productModel.findById({ _id: id });
    return res.status(200).json({ message: "success", product });
}

//get all products
export const getProducts = async (req, res) => {
    try {
        const { skip, limit } = pagination(req.query.page, req.query.limit);
        let queryObj = { ...req.query };

        const execQuery = ["page", "limit"];
        execQuery.forEach((key) => delete queryObj[key]);

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in|nin|eq)\b/g, (match) => `$${match}`);
        queryObj = JSON.parse(queryStr);

        let mongooseQuery = productModel.find(queryObj).skip(skip).limit(limit);

        if (req.query.search) {
            mongooseQuery = mongooseQuery.find({
                $or: [
                    { name: { $regex: req.query.search, $options: "i" } }, // Case-insensitive search
                    { description: { $regex: req.query.search, $options: "i" } },
                ],
            });
        }

        const products = await mongooseQuery.sort(req.query.sort);
        const count = await productModel.countDocuments(queryObj);

        return res.status(200).json({ message: "success", products, count });
    } catch (error) {
        console.error("Error in getProducts:", error);
        return res.status(500).json({ message: "catch error", error });
    }
}

//update product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { price, description } = req.body;

        const product = await productModel.updateOne({ _id: id }, { price, description });

        if (!(product.modifiedCount > 0)) {
            return res.status(400).json({ message: "Can't update product" });
        }

        return res.status(200).json({ message: "success", product });
    } catch (error) {
        console.error("Error in updateProduct:", error);
        return res.status(500).json({ message: "catch error", error });
    }

}

//delete product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let product = await productModel.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Extract the public ID from the image URL
        const imageUrl = product.mainImage; // Assuming `mainImage` stores the URL
        const publicId = imageUrl.split("/").pop().split(".")[0]; // Extract the public ID

        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId);

        product = await productModel.deleteOne({ _id: id });
        return res.status(200).json({ message: "success", product });
    } catch (error) {
        console.error("Error in deleteProduct:", error);
        return res.status(500).json({ message: "catch error", error });
    }
}