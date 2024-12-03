import UserModel from "../../../DB/model/user.model.js";
import { sendEmail } from "../../utils/sendEmail.js";
import upload from '../../utils/multer.js';
import { LoginSchema, RegisterSchema } from "../autha/user.validation.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
export const Register = async (req, res) => {
    try {
        console.log(req.body);
        const { UserName, email, password, phone, address, gender, status, role } = req.body;
        /*const {error,value} = await RegisterSchema.body.validate(req.body, { abortEarly: false});
        if(error){
            return res.status(400).json({message:"validation failes",details: error.details});
        }*/
        const checkuser = await UserModel.findOne({ email });
        if (checkuser) {
            return res.status(409).json({ message: "email exist" });
        }
     
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const passwordhashed = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
       const newUser = await UserModel.create({ UserName, email, password: passwordhashed,image: secure_url, phone, address, gender, status, role });
        const html = `
         <div>
         <p>Dear: ${UserName}</p>
         <h1 style = 'background-color:teal'>Welcome to our site</h1>
         <h2>New Account Created</h2>
         <p>Thanks for joining us</p>
         </div> `

        sendEmail(email, 'welcome', html);
        return res.status(200).json({ message: "success", newUser });
        
    } catch (error) {
        return res.status(500).json({ message: "catch error", error });
    }
}

export const Login = async (req, res) => {
    console.log("Request Body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            message: "validation error", 
            error: [
                { email: '"email" is required' },
                { password: '"password" is required' }
            ] 
        });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ message: "invalid password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNATURE, { expiresIn: "1h" });
        return res.status(200).json({ message: "success", token });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ message: "internal server error", error: err.message });
    }
}

// Send email confirmation
export const sendConfirmEmail = async (req,res)=>{
    const {email} = req.body;
    try{
        const user =UserModel.findOne({email});
        if (!user){
            return res.status(404).json({message: "user not found"});
        }
        const token = jwt.sign({id: user._id},process.env.BEARERTOKEN, {expiresIn: '1h'});
        const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
        await sendEmail(user.email,'confirm your email',`Click here to confirm: ${confirmationLink}`);
        return res.status(200).json({message:"email sent"});

    }catch(error){
        return res.status(500).json({message: "server error",error});

    }
}

// confirm email token
export const confirmEmail = async (req,res) =>{
    try{
          const token = req.params.token;
          const decoded = jwt.verify(token,process.env.BEARERTOKEN);
          const user = await UserModel.findById(decoded.id);
          if(!user){
            return res.status(404).json({message:"invalid token"});
          }
          user.confirmEmail = true;
          await user.save();
          return res.status(200).json({message:"Email confirmed"});
    }catch(error){
        return res.status(500).json({message:"server error",error});

    }
}
//forget password
export const forgetPassword = async (req,res) =>{
    const {email} = req.body;
    try{
        const user =UserModel.findOne({email});
        if (!user){
            return res.status(404).json({message: "user not found"});
        }
        const token = jwt.sign({id: user._id},process.env.BEARERTOKEN, {expiresIn: '1h'});
        const resetLink = `${process.env.FRONTEND_URL}/reset password/${token}`;
        await sendEmail(user.email,'reset your password',`Click here toreset: ${resetLink}`);
        return res.status(200).json({message:"reset email sent"});
    }catch(error){
        return res.status(500).json({message: "server error",error});
    }
}

//reset password
export const resetPassword = async (req,res) =>{
    const {token ,newpassword} = req.body;
    try{
        const decoded = jwt.verify(token,process.env.BEARERTOKEN);
        const user = await UserModel.findById(decoded.id);
        if(!user){ 
            return res.status(404).json({message :"invalid token"});
        }
        user.password = newPassword;
        await user.save();
       return res.status(200).json({ message: 'Password reset successful' });

    }catch(error){
       return res.status(500).json({ message: 'Server error' });
    }
}