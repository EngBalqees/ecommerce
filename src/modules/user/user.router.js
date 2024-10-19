import { Router } from "express";
import upload, { fileType } from "../../utils/multer.js";
import * as userController from './user.controller.js';

import {asyncHandler} from "../../utils/asyncHandler.js";

const router = Router();

router.get('/getUsers',asyncHandler(userController.getUsers));
router.get('/getUserProfile',asyncHandler(userController.getUserProfile));
router.post('/uploadExcel',upload(fileType.excel).single('excel') ,asyncHandler(userController.addUserExcel));
router.post('/uploadImage',upload(fileType.image).single('image'),asyncHandler(userController.uploadImage));
export default router;