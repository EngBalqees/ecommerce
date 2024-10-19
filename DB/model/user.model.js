
import mongoose, {Schema,model,Types} from "mongoose";


const UserSchema = new Schema({
    UserName:{
        type: String,
        required:true,
     },
     email:{
        type: String,
        required:true,
     },
     isDeleted:{
      type: Boolean,
      default: false,
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
     address:{
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
        default: 'user',
     },
});
const UserModel = mongoose.model('user',UserSchema);
export default UserModel;