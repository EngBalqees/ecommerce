import UserModel from '../../../DB/model/user.model.js';
import upload from '../../utils/multer.js';
import cloudinary from '../../utils/cloudinary.js';
import xlsx from 'xlsx'; // Make sure to import xlsx

// Get User Profile by ID
export const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "success", user });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching user profile", error });
    }
};

// Get all users (Admin only)
export const getUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select('UserName phone address gender');
        return res.status(200).json({ message: "success", users });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching users", error });
    }
};

// Upload user profile image
export const uploadImage = async (req, res) => {
    try {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path);
        const user = await UserModel.findByIdAndUpdate(req.user.id, { image: secure_url });
        return res.status(200).json({ message: "success", user });
    } catch (error) {
        return res.status(500).json({ message: "Image upload failed", error });
    }
};

// Add users from Excel file
export const addUserExcel = async (req, res) => {
    try {
        const workbook = xlsx.readFile(req.file.path);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const users = xlsx.utils.sheet_to_json(worksheet);
        await UserModel.insertMany(users);
        return res.status(200).json({ message: "Users imported successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Error importing users", error });
    }
};
