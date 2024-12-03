import multer from 'multer';
import { nanoid } from 'nanoid';

// Setup file upload types
export const fileType = {
  image: ['image/png', 'image/jpeg', 'image/webp'],
  pdf: ['application/pdf'],
  excel: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'uploads/'); // specify folder to store files
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = nanoid() + Date.now();
    cb(null, uniqueSuffix + '_' + file.originalname); // create unique file name
  },
});

// Create an instance of multer with storage settings
const upload = multer({ storage });

export default upload; // Export multer instance directly
