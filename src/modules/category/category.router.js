import { Router } from "express";
import * as CategoryController from "./category.controller.js";
import upload from "../../utils/multer.js";
import { auth } from "../../midleware/auth.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
import validation from "../../midleware/validation.js";
import  "./category.validation.js";

const router = Router();
router.post('/addCategory',auth(['Admin']),upload.single('img'),asyncHandler(CategoryController.addCategory));
router.get('/getCategory/:id',auth(['Admin','User']),asyncHandler(CategoryController.getCategory));
router.get('/getCategories',auth(['Admin','User']),asyncHandler(CategoryController.getCategories));
router.delete('/deleteCategory/:id',auth(['Admin']),asyncHandler(CategoryController.deleteCategory));
router.put('/updateCategory/:id',auth(['Admin']),asyncHandler(CategoryController.updateCategory));

export default router;