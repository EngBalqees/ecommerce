import bcrypt from 'bcryptjs';
import UserModel from '../../../DB/model/user.model.js';
import jwt from 'jsonwebtoken';
import { LoginSchema, RegisterSchema } from "./user.validation.js";
import fileUpload from '../../utils/multer.js';
import cloudinary from '../../utils/cloudinary.js';
import { sendEmail } from '../../utils/sendEmail.js';
export const Register = async (req, res) => {
    try {
        const { UserName, email, password, phone, address, gender, status, role } = req.body;
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({ message: "email exist" });
        }
        const validationResult = await RegisterSchema.body.validate(req.body, { abortEarly: false });
        const passwordhashed = await bcrypt.hash(password, parseInt(process.env.SALTROUND));
        await UserModel.create({ UserName, email, password: passwordhashed, image: secure_url, phone, address, gender, status, role });
        const html = `
         <div>
         <p>Dear: ${userName}</p>
         <h1 style = 'background-color:teal>Welcome to our site</h1>
         <h2>New Account Created</h2>
         <p>Thanks for joining us</p>
         </div> `

        sendEmail(email, 'welcome', html);
        return res.status(200).json({ message: "success", user });
    } catch (error) {
        return res.status(500).json({ message: "catch error", error });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(409).json({ message: "user not found" });
    }
    const check = await bcrypt.compareSync(password, user.password);
    if (!check) {
        return res.status(400).json({ message: "invalid password" });
    }
    const token = await jwt.sign({ id: user._id }, process.env.LOGINSIGNTURE);
    return res.status(200).json({ message: "success", token });
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