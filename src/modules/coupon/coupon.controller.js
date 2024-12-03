
import coupon from "../../../DB/model/coupon.model.js";
// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        // Check if coupon already exists
        const existingCoupon = await coupon.findOne({ name: req.body.name });
        if (existingCoupon) {
            return res.status(409).json({ message: "Coupon already exists" });
        }

        // Parse the expireDate properly and validate it
        req.body.expireDate = new Date(req.body.expireDate);

        // Create the coupon
        const newCoupon = await coupon.create(req.body);
        return res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
}

// Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await coupon.find();
        return res.status(200).json(coupons);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Delete a coupon (Admin only)
export const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const couponToDelete = await coupon.findById(id);
        if (!couponToDelete) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Remove the coupon from the database
        await couponToDelete.remove();
        return res.status(200).json({ message: 'Coupon deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message });
    }
};