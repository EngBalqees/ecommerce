import bcrypt from 'bcryptjs';
import UserModel from '../../../DB/model/user.model.js';
import jwt from 'jsonwebtoken';
import { LoginSchema, RegisterSchema } from "./user.validation.js";
import fileUpload from '../../utils/multer.js';

export const Register = async (req,res)=>{
    try{
         const {UserName,email,password,phone,address,gender,status,role} = req.body;
         const image = req.file ? req.file.filename : null;
         const user = await UserModel.findOne({email});
         if(user){
            return res.status(409).json({message:"email exist"});
         }
         const validationResult = await RegisterSchema.body.validate(req.body,{abortEarly:false});
         const passwordhashed = await bcrypt.hash(password,parseInt(process.env.SALTROUND));
         await UserModel.create({UserName,email,password:passwordhashed,image,phone,address,gender,status,role});
         return res.status(200).json({message:"success",user});
    }catch(error){
      return res.status(500).json({message:"catch error",error});
    }
}

export const Login = async(req,res)=>{
    const {email,password} = req.body;
    const user = await UserModel.findOne({email});
    if(!user){
        return res.status(409).json({message:"user not found"});
    }
    const check = await bcrypt.compareSync(password,user.password);
    if(!check){
        return res.status(400).json({message:"invalid password"});
    }
    const token = await jwt.sign({id:user._id},process.env.LOGINSIGNTURE);
    return res.status(200).json({message:"success",token});
} 
