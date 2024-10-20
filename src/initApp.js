import connection from "../DB/connection.js";
import user from "../src/modules/user/user.router.js";
import product from "../src/modules/product/product.router.js";
import cart from "../src/modules/cart/cart.router.js";
import category from "../src/modules/category/category.router.js";
import subcategory from "../src/modules/subcategory/subcategory.router.js";
import order from "../src/modules/order/order.router.js";
import coupon from "../src/modules/coupon/coupon.router.js";
import auth from "../src/modules/autha/auth.router.js";
import review from "../src/modules/reviews/review.router.js";
export const initApp = (app, express) => {
    connection();
    app.use(express.json());
    app.use('/auth',auth);
    app.use('/user', user);
    app.use('/category', category);
    app.use('/subcategory', subcategory);
    app.use('/product', product);
    app.use('/cart', cart);
    app.use('/order', order);
    app.use('/coupon', coupon);
    app.use('/review',review);

    app.use('*', (req, res) => {
        return res.status(404).json({ message: "page not found" });
    });
    app.use((err, req, res, next) => {
        res.json({ message: err.message });
    });
}