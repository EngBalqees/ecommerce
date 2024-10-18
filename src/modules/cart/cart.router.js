import * as cartController from '../cart/cart.controller.js';
import { Router } from "express";
const router = Router();
router.post('/createcart',cartController.createCart);
router.post('/addproduct/:id',cartController.addtoCart);
router.get('/getcart/:id',cartController.getCart);
router.delete('/removeitem/:id',cartController.removeItem);
router.delete('/clearcart/:id',cartController.clearCart);
router.patch('/increaseQuantity/:id',cartController.increareQTY);
router.patch('/decreaseQuantity/:id',cartController.decreaseQTY);

export default router;