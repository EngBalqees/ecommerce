import * as OrderController from './order.controller.js';
import { Router } from "express";
import { auth } from "../../midleware/auth.js";

const router = Router();
router.post('/createorder',auth(['Admin','User']),(req,res,next) =>{
    console.log('Auth middleware passed');
    next();
},OrderController.createOrder);
router.get('/showallorders',auth(['Admin']), OrderController.getAllOrders);
router.get('/getUserOrders',auth(['Admin','User']), OrderController.getUserOrders);
router.get('/getOrder/:id',auth(['Admin','User']), OrderController.getOrderbyId);
router.put('/updateorder/:id',auth(['Admin']), OrderController.updateOrderStatus);
router.delete('/deleteorder/:id',auth(['Admin','User']), OrderController.deleteOrder);

export default router;