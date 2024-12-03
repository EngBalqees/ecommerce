import Cart from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import UserModel from "../../../DB/model/user.model.js";

async function calculatePrice(cart) {
    let totalPrice = 0;
    for (const item of cart.products) {
        const product = await productModel.findById(item.product);
        if (product) {
            totalPrice += product.price * item.quantity;
        }
    }
    return totalPrice;
}

// Create cart
export const createCart = async (req, res) => {
    try {
        const { userId, products } = req.body;
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const cart = new Cart({ userId, products });
        cart.totalPrice = await calculatePrice(cart);
        await cart.save();
        res.status(201).json({ message: "Success", cart });
    } catch (error) {
        res.status(400).json({ message: "Catch error", error });
    }
};

// Add product to a cart
export const addToCart = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await Cart.findById(id);
        const product = await productModel.findById(req.body.productId);
        if (!cart || !product) {
            return res.status(404).json({ message: "Cart or product not found" });
        }
        const productInCart = cart.products.find(p => p.product.toString() === req.body.productId);
        if (productInCart) {
            productInCart.quantity += req.body.quantity || 1;
        } else {
            cart.products.push({ product: req.body.productId, quantity: req.body.quantity || 1 });
        }
        cart.totalPrice = await calculatePrice(cart);
        await cart.save();
        res.status(200).json({ message: "Added successfully", cart });
    } catch (error) {
        res.status(400).json({ message: "Catch error", error });
    }
};

// Remove item from cart
export const removeItem = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productId = req.body.productId;
        cart.products = cart.products.filter(p => p.product.toString() !== productId);
        cart.totalPrice = await calculatePrice(cart);
        await cart.save();
        return res.status(200).json({ message: "Successful", cart });
    } catch (error) {
        return res.status(400).json({ message: "Catch error", error });
    }
};

// Clear cart
export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.products = [];
        cart.totalPrice = 0;
        await cart.save();
        return res.status(200).json({ message: "Successful", cart });
    } catch (error) {
        return res.status(500).json({ message: "Catch error", error });
    }
};

// Increase quantity
export const increaseQTY = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productInCart = cart.products.find(p => p.product.toString() === req.body.productId);
        if (!productInCart) {
            return res.status(404).json({ message: "Product not in cart" });
        }
        productInCart.quantity += 1;
        cart.totalPrice = await calculatePrice(cart);
        await cart.save();
        return res.status(200).json({ message: "Successful", cart });
    } catch (error) {
        return res.status(400).json({ message: "Catch error", error });
    }
};

// Decrease quantity
export const decreaseQTY = async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.id);
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const productInCart = cart.products.find(p => p.product.toString() === req.body.productId);
        if (!productInCart) {
            return res.status(404).json({ message: "Product not in cart" });
        }
        if (productInCart.quantity > 1) {
            productInCart.quantity -= 1;
        } else {
            cart.products = cart.products.filter(p => p.product.toString() !== req.body.productId);
        }
        cart.totalPrice = await calculatePrice(cart);
        await cart.save();
        return res.status(200).json({ message: "Successful", cart });
    } catch (error) {
        return res.status(400).json({ message: "Catch error", error });
    }
};

// Get cart products
export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate("products.product").exec();
        if (!cart) {
            return res.status(404).json({ message: "No cart for this user" });
        }
        return res.status(200).json({ message: "Cart retrieved", cart });
    } catch (error) {
        return res.status(400).json({ message: "Catch error", error });
    }
};