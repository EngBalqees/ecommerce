const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    mainImage: {
        type: String,
        required: true
    },
    subImages: [String],
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    priceAfterDiscount: { type: Number },
    stock: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    subcategory: { type: String },
    colors: [String],
    sizes: [String],
    status: {
        type: String,
        enum: ['available', 'unavailable'],
        default: 'available'
    }
});

// Calculate the price after discount
productSchema.pre('save', function (next) {
    this.priceAfterDiscount = this.price - (this.price * (this.discount / 100));
    next();
});

const productModel = mongoose.model('Product', productSchema);
export default productModel;
