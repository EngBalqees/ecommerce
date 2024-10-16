import UserModel from "../../DB/model/user.model";

export const checkEmail = async(req,res)=>{
    const {email} = req.body;
    const user = await UserModel.findOne({email});
    if(user){
        return res.status(409).json({message: "email already exist"});
    }
    next();
}