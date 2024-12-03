import upload from "../../utils/multer.js"; // Make sure multer has proper config
import { createCategorySchema, updateCategorySchema } from "./category.validation.js"; // Import schemas
import validation from "../../midleware/validation.js"; // Validation middleware
import { asyncHandler } from "../../utils/asyncHandler.js"; // Async error handler
import { auth } from "../../midleware/auth.js"; // Authentication middleware
import * as CategoryController from "./category.controller.js";
import { Router } from "express";
const router = Router();

// Define the route
router.post(
    '/addCategory',
    auth(['Admin']), // Admin-only authentication
    upload.single('img'), // Specify the field name for image upload in your form
    validation(createCategorySchema), // Apply the validation middleware
    asyncHandler(CategoryController.addCategory) // Async handler for error management
  );
  

// Get Category by ID
router.get(
    "/getCategory/:id",
    auth(["Admin", "User"]),
    asyncHandler(CategoryController.getCategory)
);

// Get all Categories
router.get(
    "/getCategories",
    auth(["Admin", "User"]),
    asyncHandler(CategoryController.getCategories)
);

// Delete Category
router.delete(
    "/deleteCategory/:id",
    auth(["Admin"]),
    asyncHandler(CategoryController.deleteCategory)
);

// Update Category
router.put(
    "/updateCategory/:id",
    auth(["Admin"]),
    validation(updateCategorySchema), // Apply validation to update
    asyncHandler(CategoryController.updateCategory)
);

export default router;
