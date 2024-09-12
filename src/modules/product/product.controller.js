import productModel from "../../../DB/model/product.model.js";


//add product
export const addProduct = async(req,res)=>{
    try{
        const {name,status} = req.body;
        const {secure_url} = await cloudinary.uploader.upload(req.file.path);
        const product = new productModel({name,image:secure_url,status});
        await product.save();

        return res.status(200).json({message:"success",product});
    }catch(error){
      return res.status(500).json({message:"catch error",error});
    }
}
//get product
export const getProduct = async(req,res)=>{
    const {id} = req.params;
    const product = await productModel.findById({_id:id});
    return res.status(200).json({message:"success",product});
}

//get all products
export const getProducts = async(req,res)=>{
    const products = await productModel.findAll();
    return res.status(200).json({message:"success",products});
}

//update product
export const updateProduct = async(req,res) =>{
    const {id} = req.params;
    const {price,description} =req.body;
    const product = await productModel.updateOne({_id:id},{price,description});
    
    if (!product.modifiedCount > 0){
        return res.status(400).json({message : "can't update poduct image"});
    }
    return res.status(200).json({mesage:"success",product});

}

//delete product
export const deleteProduct = async(req,res)=>{
    const {id} = req.params;
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

    product = await productModel.deleteOne({_id:id});
    return res.status(200).json({message:"success",product});
}