import multer from 'multer';
import { nanoid } from 'nanoid';

export const fileType ={
    image: ['image/png','image/jpeg','image/webp'],
    pdf :['application/pdf'],
    excel : ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
}
function upload(customTypes = []){
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