import connection from "../DB/connection.js";
import user from "../src/modules/user/user.router.js";
import product from "../src/modules/product/product.router.js";
import cart from "../src/modules/cart/cart.router.js";
import category from "../src/modules/category/category.router.js";
import subcategory from "../src/modules/subcategory/subcategory.router.js";
export const initApp = (app, express) => {
    connection();
    app.use(express.json());
    app.use('/user',user);
    app.use('/category',category);
    app.use('/subcategory',subcategory);
    app.use('/product',product);
    app.use('/cart',cart);
    app.use('*',(req,res)=>{
       return res.status(404).json({message:"page not found"});
    });
}