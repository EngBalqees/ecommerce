import { Router } from "express";
import * as userController from './user.controller.js';
import validation from "../../midleware/validation.js";
import { LoginSchema, RegisterSchema } from "./user.validation.js";
const router = Router();
router.post('/Register',validation(RegisterSchema),userController.Register);
router.post('/login',validation(LoginSchema),userController.Login);
export default router;