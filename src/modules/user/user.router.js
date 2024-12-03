import { Router } from "express";
import upload, { fileType } from "../../utils/multer.js";
import * as userController from './user.controller.js';

import {asyncHandler} from "../../utils/asyncHandler.js";

const router = Router();

router.get('/getUsers',asyncHandler(userController.getUsers));
router.get('/getUserProfile',asyncHandler(userController.getUserProfile));
router.post('/uploadExcel', upload.single('excel'),asyncHandler(userController.addUserExcel));
router.post('/uploadImage' ,upload.single('img'),asyncHandler(userController.uploadImage));
export default router;