
import UserModel from '../../../DB/model/user.model.js';

import upload from '../../utils/multer.js';
import cloudinary from '../../utils/cloudinary.js';


export const getUserProfile = async(req,res) =>{
    const {id} = req.params;
    const user = await UserModel.findById({_id:id});
    return res.status(200).json({message:"success",user});
}

export const getUsers = async(req,res) =>{
    const users = await UserModel.findAll({
        attributes: [' UserName',' phone','address',' gender']
    });
    return res.status(200).json({message:"success",users});
}

export const uploadImage = async (req, res) => {
    const { secure_url } = await cloudinary.uploader.upload(req.file.path);
    const user = await UserModel.findByIdAndUpdate(req.id, { image: secure_url });
    return res.status(200).json({ message: "success" });
}
export const addUserExcel = async(req,res) =>{
    const workbook = xlsx.readFile(req.file.path);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(worksheet);

    await UserModel.insertMany(users);

    return res.status(200).json({message: "success"});
}