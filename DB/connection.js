import mongoose from "mongoose";

const connection = ()=>{
    return mongoose.connect(process.env.DbConnection).then(result=>{
        console.log(`DB CONNECTION DONE`);
    }).catch(err =>{
        console.log(`error to connect db :${err}`);
    })
}
export default connection;