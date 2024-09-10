import subCategoryModel from "../../../DB/model/subcategory.model.js";
import UserModel from "../../../DB/model/user.model.js";
import cloudinary from "../../utils/cloudinary.js";

//create category
export const addsubCategory = async (req, res) => {
    try {
        const userId = req.id;
        const user = UserModel.findById(userId);
        if (!user) {

        }
        const { name, status, categoryId, createdBy } = req.body;
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const subcategory = new CategoryModel({ name, image: secure_url, status, categoryId, createdBy });
        await subcategory.save();

        return res.status(200).json({ message: "success", category });
    } catch (error) {
        return res.status(500).json({ message: "catch error", error });
    }
}

// Get all subcategories
export const getsubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('categoryId createdBy updatedBy');
        res.json(subcategories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get a specific subcategory by ID
export const getsubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findById(req.params.id).populate('categoryId createdBy updatedBy');
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Update a subcategory
export const updatesubcategory = async (req, res) => {
    try {
        const { name, image, status, categoryId, updatedBy } = req.body;
        const subcategory = await Subcategory.findByIdAndUpdate(
            req.params.id,
            { name, image, status, categoryId, updatedBy },
            { new: true }
        );
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.json(subcategory);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

// Delete a subcategory
export const deletesubcategory = async (req, res) => {
    try {
        const {id} = req.params;
        const subcategory = await subCategoryModel.findById(id);
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // Extract the public ID from the image URL
        const imageUrl = subcategory.image;
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from URL
        
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
            }
            console.log('Cloudinary delete result:', result);
        });
         subcategory = await subCategoryModel.findByIdAndDelete(id);
        if (!subcategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        res.json({ message: 'Subcategory deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}