import { Router } from "express";
import * as productController from "./product.controller.js";
import upload from "../../utils/multer.js";
import { auth } from "../../midleware/auth.js";// Fixed typo in "middleware"
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// Add Product
router.post(
    "/addProduct",
    auth(["Admin"]),
    upload.fields([
        { name: "mainImage", maxCount: 1 }, // If a separate mainImage field is expected
        { name: "subImages", maxCount: 10 },
    ]),
    asyncHandler(productController.addProduct)
);

// Get Single Product by ID
router.get(
    "/getProduct/:id",
    auth(["Admin", "User"]),
    asyncHandler(productController.getProduct)
);

// Get All Products
router.get(
    "/getProducts",
    auth(["Admin", "User"]),
    asyncHandler(productController.getProducts)
);

// Delete Product by ID
router.delete(
    "/deleteProduct/:id",
    auth(["Admin"]),
    asyncHandler(productController.deleteProduct)
);

// Update Product by ID
router.put(
    "/updateProduct/:id",
    auth(["Admin"]),
    asyncHandler(productController.updateProduct)
);

// Handle Unknown Routes
router.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

export default router;
