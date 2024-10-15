import order from "../../../DB/model/order.model.js";
import Cart from "../../../DB/model/cart.model.js";
import productModel from "../../../DB/model/product.model.js";
import coupon from "../../../DB/model/coupon.model.js";
//create order
export const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    try {
        // Validate cart and user
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.status(404).json({ message: 'Cart not found' });
        if (req.body.couponId){
            const coupon = await coupon.findById(req.body.couponId);
            if(!coupon) return res.status(400).json({message: 'coupon not found'});
        }
        if(coupon.expireDate < new Date()){
            return res.status(400).json({message: 'coupon expired'});
        }
        if(coupon.usedBy.includes(req.user._id)){
            return res.status(409).json({message:"coupon already uesd"});
        }
        // Check if the user is passing items manually instead of cart (if required)
        const orderItems = items || cart.items;
        let totalAmount = 0;

        // Calculate the total price of the order
        for (const item of orderItems) {
            const product = await productModel.findById(item.product);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            totalAmount += product.price * item.quantity;
        }
        if (coupon){
            if(totalAmount < coupon.minimumOrderValue){
                return res.status(400).json({ message: `Minimum order value for this coupon is ${coupon.minimumOrderValue}` });
            }
        }
        if(coupon.discountType === 'percent'){
            discountAmount = (totalAmount * coupon.discountValue) / 100;
        } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountValue;
        }
           // Ensure the discount doesn't exceed the total amount
           discountAmount = Math.min(discountAmount, totalAmount);
           totalAmount -= discountAmount;

           // Mark the coupon as used by this user
           coupon.usedBy = coupon.usedBy ? [...coupon.usedBy, req.user._id] : [req.user._id];
           await coupon.save();
       

        // Create a new order
        const order = new order({
            user: req.user.id,
            items: orderItems,
            totalAmount,
            discountAmount,  // Save the discount amount
            coupon: coupon ? coupon._id : null,  // Save the applied coupon
            shippingAddress,
            paymentMethod
        });

        await order.save();

        // Clear cart after placing the order
        await cart.remove();

        return res.status(201).json(order);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get All Orders (Admin View)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await order.find().populate('user').populate('items.product');
        return res.status(200).json(orders);
    } catch (err) {
        return res.status(500).json({ msg: 'Server error' });
    }
};

// Get User Orders
export const getUserOrders = async (req, res) => {
    try {
        const orders = await order.find({ user: req.user.id }).populate('items.product');
        if (!orders) return res.status(404).json({ msg: 'No orders found' });
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

//get order by id
export const getOrderbyId = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await order.findById(id).populate('user').populate('items.product');
        if (!order) return res.status(404).json({ msg: 'Order not found' });
        return res.status(200).json({ message: "success", order });
    } catch (error) {
        return res.status(500).json({ message: "server error", error });
    }

};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { orderStatus } = req.body;
    try {
        const order = await order.findById(id);
        if (!order) return res.status(404).json({ msg: 'Order not found' });

        // Validate order status
        const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ msg: 'Invalid order status' });
        }

        // Update order status
        order.orderStatus = orderStatus;
        await order.save();

        return res.status(200).json(order);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error });
    }
};

//delete order (Admin or User can delete their own orders)
export const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await order.findById(id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Check if the user is authorized to delete the order
        if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        await order.remove();
        return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
}
