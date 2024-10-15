
import coupon from "../../../DB/model/coupon.model.js";

export const createCoupon = async(req,res)=>{
    if (await coupon.findOne({name: req.body.name})){
        return res.status(409).json({message:"coupon already exists"});
    }
    req.body.expireDate = new Date( req.body.expireDate);
    const coupon = await coupon.createCoupon(req.body);
    return res.status(201).json({message: "success",coupon});
}
// Get all coupons (Admin only)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await coupon.find();
        res.status(200).json(coupons);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete a coupon (Admin only)
export const deleteCoupon = async (req, res) => {
    const { id } = req.params;
    try {
        const coupon = await coupon.findById(id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        await coupon.remove();
        res.status(200).json({ message: 'Coupon deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};