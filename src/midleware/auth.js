import UserModel from "../../DB/model/user.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Import bcrypt for password hashing

// Authorization Middleware
export const auth = (accessRole = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith("Bearer ")) {
                return res.status(400).json({ message: "Invalid token format" });
            }
            const token = authorization.split("Bearer ")[1];
            const decoded = jwt.verify(token, process.env.LOGINSIGNTURE);
            if (!decoded) {
                return res.status(400).json({ message: "Invalid token" });
            }
            const user = await UserModel.findById(decoded.id).select("userName role");
            if (!user || (accessRole.length && !accessRole.includes(user.role))) {
                return res.status(403).json({ message: "Access denied" });
            }
            req.id = user._id;
            req.role = user.role;
            next();
        } catch (error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
    };
};

// Send Email Confirmation
export const sendConfirmEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNTURE, { expiresIn: "1h" });
        const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
        await sendEmail(user.email, "Confirm Your Email", `Click here to confirm: ${confirmationLink}`);
        return res.status(200).json({ message: "Confirmation email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Confirm Email Token
export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const decoded = jwt.verify(token, process.env.LOGINSIGNTURE);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }
        user.confirmEmail = true;
        await user.save();
        return res.status(200).json({ message: "Email confirmed" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Forget Password
export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const token = jwt.sign({ id: user._id }, process.env.LOGINSIGNTURE, { expiresIn: "1h" });
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendEmail(user.email, "Reset Your Password", `Click here to reset: ${resetLink}`);
        return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Reset Password
export const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.LOGINSIGNTURE);
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: "Invalid token" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALTROUND || 10));
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        return res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};
