import { Router } from "express";
import * as subCategoryController from "./subcategory.controller.js";
import fileUpload from "../../utils/multer.js";
import { auth } from "../../midleware/auth.js";
import {asyncHandler} from "../../utils/asyncHandler.js";
const router = Router();
router.post('/addsubCategory',auth(['Admin']),asyncHandler(subCategoryController.addsubCategory));
router.get('/getsubcategory/:id',auth(['Admin','User']),asyncHandler(subCategoryController.getsubcategory));
router.get('/getsubcategories ',auth(['Admin','User']),asyncHandler(subCategoryController.getsubcategories) );
router.put('/updatesubcategory/:id',auth(['Admin']),asyncHandler(subCategoryController.updatesubcategory));
router.delete('/deletesubcategory/:id',auth(['Admin']),asyncHandler(subCategoryController.deletesubcategory));

export default router;