import { Router } from "express";
import * as userController from './user.controller.js';

const router = Router();
router.post('/Register',userController.Register);
router.post('/login',userController.Login);
export default router;