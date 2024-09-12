import { Router } from "express";
import * as productController from "./product.controller.js";
import fileUpload from "../../utils/multer.js";
import { auth } from "../../midleware/auth.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
const router = Router();
router.post('/addProduct',auth(['Admin']),upload.array('subImages', 10),asyncHandler(productController.addProduct));
router.get('/getProduct/:id',auth(['Admin','User']),asyncHandler(productController.getProduct));
router.get('/getProducts',auth(['Admin','User']),asyncHandler(productController.getProducts));
router.delete('/deleteProduct/:id',auth(['Admin']),asyncHandler(productController.deleteProduct));
router.put('/updateProduct/:id',auth(['Admin']),asyncHandler(productController.updateProduct));

export default router;