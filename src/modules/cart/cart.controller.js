import Cart from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import UserModel from "../../../DB/model/user.model.js";

async function calculateprice(cart) {
    let totalPrice = 0;
    for (const item of cart.products) {
      const product = await productModel.findById(item.product);
      totalPrice += product.price * item.quantity;
    }
    return totalPrice;
  }
//create cart
export const createCart = async(req,res)=>{
    try{
        const {userId,products} = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({message: 'user not found'});
        }
        const cart = new Cart({userId,products});
        cart.totalPrice = await calculateprice(cart);
        await cart.save;
        res.status(201).json({message: "success",cart});
    }
    catch(error){
        res.status(400).json({message:"catch error",error});

    }
}
//add product to a cart
export const addtoCart = async(req,res)=>{
    try{
        const {id} = req.params;
        const cart = await Cart.findById(_id);
        const product = await productModel.findById(req.body.productId);
        if (!cart || !product){
            return res.status(404).json({message:"cart or product not found"});
        }
        const productInCart = cart.products.find(p =>p.product.toString() === req.body.quantity);
        if(productInCart){
            productInCart.quantity += req.body.quantity || 1;
        }
        else{
            cart.products.push({ product: req.body.productId, quantity: req.body.quantity || 1 });
        }
        cart.totalPrice = await calculateprice(cart);
        await cart.save();
        res.status(200).json({message:"added successfully"});
        }catch(error){
            res.status(400).json({message:"catch error",error});

    }
}
//remove item from cart
export const removeItem = async(req,res)=>{
    try{
    const cart = await Cart.findById(req.params.id);
    if(!cart){
        return res.status(404).json({message:"no cart"});
    }
    const productId = req.body.productId;
    cart.products = cart.products.filter(p => p.product.toString() !== productId);

    cart.totalPrice = await calculateprice(cart);
    await cart.save();
    return res.status(200).json({message: "successful",cart});
}catch(error){
    return res.status(400).json({message:"catch error",error});
}
}
//clear cart
export const clearCart = async(req,res)=>{
    try{
        const cart = await Cart.findById(req.params.id);
        if(!cart){
            return res.status(404).json({message:"cart not found"});
        }
        cart.products = [];
        cart.totalPrice = 0;
        await cart.save();
        return res.status(200).json({message:"successful",cart});
    }catch(error){
        return res.status(500).json({message:"catch error",error});
    }
}
//increate quantity
export const increareQTY = async(req,res)=>{
    try{
        const cart = await Cart.findById(req.params.id);
        if(!cart){
            return res.status(404).json({message:"cart not found"});
        }
        const quantity = Cart.products.find(p => p.product.toString() === req.body.productId);
        if(!quantity){
            return res.status(404).json({message:"product not in cart"});
        }
        quantity.quantity +=1;
        cart.totalPrice = await calculateprice(cart);
        await cart.save();
        return res.status(200).json({message:"successful",cart});
    }catch(error){
        return res.status(400).json({message:"catch error",error});
    }
}
//decrease quantity
export const decreaseQTY = async(req,res)=>{
    try{
       const cart = await Cart.findById(req.params.id);
       if(!cart){
        return res.status(404).json({message:"cart not found"});
       }
       const productQTY = cart.products.find(p => p.product.toString() === req.body.params);
       if(!productQTY){
        return res.status(404).json({message:"product not in the cart"});
       }
       if(productQTY.quantity > 1){
        productQTY.quantity -=1;
       }
       else{
        cart.products = cart.products.filter(p => p.product.toString() !== req.body.productId);
       }
       cart.totalPrice = await calculateprice(cart);
       await cart.save();
       return res.status(200).json({message :"successful",cart});
    }catch(error){
        return res.status(400).json({message:"catch error",error});
    }
}
//get cart products
export const getCart = async(req,res)=>{
    try{
        const cart = await Cart.find({userId: req.params.userId}).populate('products.product');
        if(!cart){
            return res.status(404).json({message:"no cart for this user"});
        }
        return res.status(200).json({message:"cart",cart});

    }catch(error){
        return res.status(400).json({message:"catch error",error});
    }

}