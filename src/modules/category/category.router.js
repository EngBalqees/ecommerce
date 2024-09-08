import { Router } from "express";
import * as CategoryController from "./category.controller.js";
import fileUpload from "../../utils/multer.js";

const router = Router();
router.post('/addCategory',fileUpload().single('image'),CategoryController.addCategory);
router.get('/getCategory',CategoryController.getCategory);
router.get('/getCategories',CategoryController.getCategories);
router.delete('/deleteCategory',CategoryController.deleteCategory);
router.put('/updateCategory',CategoryController.updateCategory);

export default router;