import CategoryModel from "../../../DB/model/category.model";

export const addCategory = async(req,res)=>{
    try{
        const {name,image,status} = req.body;
        const category = new CategoryModel({name,image,status});
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

    const category = await CategoryModel.deleteOne({_id:id});
    return res.status(200).json({message:"success",category});
}