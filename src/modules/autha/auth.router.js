import { Router } from "express";
import * as authController from "./auth.controller.js";
import validation from "../../midleware/validation.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import { LoginSchema, RegisterSchema } from "./user.validation.js";
const router = Router();
router.post('/Register',validation(RegisterSchema),asyncHandler(authController.Register));
router.post('/login',validation(LoginSchema),asyncHandler(authController.Login));
router.patch('/foregetPassword',authController.forgetPassword);
router.patch('/resetPassword',authController.resetPassword);
router.patch('/sendConfirmEmail',authController.sendConfirmEmail);
router.patch('/confirmEmail',authController.confirmEmail);
export default router;