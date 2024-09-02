import { required } from "joi";
import mongoose, {Schema,model,Types} from "mongoose";
import { type } from "os";

const UserSchema = new Schema({
    userName:{
        type: String,
        required:true,
     },
     email:{
        type: String,
        required:true,
     },
     password:{
        type: String,
        required:true,
     },
     image:{
        type: String,
        required:true,
     },
     phone:{
        type:Number,
        required: true,
     },
     addres:{
        type:Number,
        required: true,
     },
     gender:{
        type:String,
        enum:['Male','Female'],
     },
     confirmEmail:{
        type:Boolean,
        default:false,
     },
     status:{
        type:String,
        enum:['active','not active'],
     },
     role:{
        type:String,
        enum: ['admin','user'],
     },
});
const UserModel = mongoose.model('user',UserSchema);
export default UserModel;