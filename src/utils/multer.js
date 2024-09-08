import multer from 'multer';
import { nanoid } from 'nanoid';

function fileUpload(){
 const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        const uniqueSuffix = nanoid()+Date.now();
        cb(null,uniqueSuffix + "_" +file.originalname)
    }
 });
 const upload = multer({storage});
 return upload;
}
export default fileUpload