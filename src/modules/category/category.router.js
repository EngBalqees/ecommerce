import { Router } from "express";
import * as CategoryController from "./category.controller.js";
import fileUpload from "../../utils/multer.js";
import { auth } from "../../midleware/auth.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
const router = Router();
router.post('/addCategory',auth(['Admin']),asyncHandler(CategoryController.addCategory));
router.get('/getCategory/:id',auth(['Admin','User']),asyncHandler(CategoryController.getCategory));
router.get('/getCategories',auth(['Admin','User']),asyncHandler(CategoryController.getCategories));
router.delete('/deleteCategory/:id',auth(['Admin']),asyncHandler(CategoryController.deleteCategory));
router.put('/updateCategory/:id',auth(['Admin']),asyncHandler(CategoryController.updateCategory));

export default router;