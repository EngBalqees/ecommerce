import { Router } from "express";
import * as authController from "./auth.controller.js";
import validation from "../../midleware/validation.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import { LoginSchema, RegisterSchema } from "./user.validation.js";
const router = Router();
// Register user
router.post('/register', validation(RegisterSchema), asyncHandler(authController.Register));

// Login user
router.post('/login', validation(LoginSchema), asyncHandler(authController.Login));

// Forget password (send reset email)
router.post('/forgetPassword', asyncHandler(authController.forgetPassword));

// Reset password
router.post('/resetPassword', asyncHandler(authController.resetPassword));

// Send confirmation email
router.post('/sendConfirmEmail', asyncHandler(authController.sendConfirmEmail));

// Confirm email
router.get('/confirmEmail/:token', asyncHandler(authController.confirmEmail));

export default router;