import multer from 'multer';
import { nanoid } from 'nanoid';

function upload(){
 const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        console.log('Setting destination'); // Debugging
        cb(null,'uploads/');
    },
    filename:(req,file,cb)=>{
        console.log('Setting filename'); // Debugging
        const uniqueSuffix = nanoid()+Date.now();
        cb(null,uniqueSuffix + "_" +file.originalname)
    }
 });
 const upload = multer({storage});
 return upload;
}
export default upload;