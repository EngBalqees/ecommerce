import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: 'dhcn8aovi', 
    api_key: '667819395594952', 
    api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;