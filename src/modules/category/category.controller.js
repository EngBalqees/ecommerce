import CategoryModel from "../../../DB/model/category.model.js";
import UserModel from "../../../DB/model/user.model.js";
import fileUpload from "../../utils/multer.js";
import cloudinary from "../../utils/cloudinary.js";
export const addCategory = async(req,res)=>{
    try{
        const {name,status} = req.body;
        const {secure_url} = await cloudinary.uploader.upload(req.file.path);
        const category = new CategoryModel({name,image:secure_url,status});
        await category.save();

        return res.status(200).json({message:"success",category});
    }catch(error){
      return res.status(500).json({message:"catch error",error});
    }
}
//get category
export const getCategory = async(req,res)=>{
    const {id} = req.params;
    const category = await CategoryModel.findById({_id:id});
    return res.status(200).json({message:"success",category});
}

//get all categories
export const getCategories = async(req,res)=>{
    const categories = await CategoryModel.findAll({
        attributes: ['name','image','status']
    });
    return res.status(200).json({message:"success",categories});
}

//update category
export const updateCategory = async(req,res) =>{
    const {id} = req.params;
    const {image} =req.body;
    const category = await CategoryModel.updateOne({_id:id},{image:image});
    
    if (!category.modifiedCount > 0){
        return res.status(400).json({message : "can't update category image"});
    }
    return res.status(200).json({mesage:"success",category});

}

//delete category
export const deleteCategory = async(req,res)=>{
    const {id} = req.params;
    const category = await CategoryModel.findById(id);
        if (!category) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        // Extract the public ID from the image URL
        const imageUrl = category.image;
        const publicId = imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from URL
        
        // Delete the image from Cloudinary
        await cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                return res.status(500).json({ error: 'Failed to delete image from Cloudinary' });
            }
            console.log('Cloudinary delete result:', result);
        });

    category = await CategoryModel.deleteOne({_id:id});
    return res.status(200).json({message:"success",category});
}