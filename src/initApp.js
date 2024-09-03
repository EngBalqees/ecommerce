import connection from "../DB/connection.js";
import user from "../src/modules/user/user.router.js";
export const initApp = (app, express) => {
    connection();
    app.use(express.json());
    app.use('/user',user);
    app.use('*',(req,res)=>{
       return res.status(404).json({message:"page not found"});
    });
}