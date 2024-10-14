import UserModel from "../../DB/model/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
export const auth = (accessRole = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.BEARERTOKEN)) {
                return next(new AppError('invalid token', 400));
            }
            const token = authorization.split(process.env.BEARERTOKEN)[1];
            const decoded = jwt.verify(token, process.env.LOGINSIGNTURE);
            if (!decoded) {
                return next(new AppError('invalid token', 400));
            }
            const user = await UserModel.findById(decoded.id).select("userName role");
            req.id = user._id;
            req.role = user.role;
            next();

        } catch (error) {
            return res.status(500).json({ message: 'catch error', error: error.stack });

        }
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