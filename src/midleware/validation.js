import Joi from "joi";

export const generalFeilds = {
   email: Joi.string().email().min(6).required(),
   password: Joi.string().min(8).required(),

}
const dataMethod = ['body', 'params', 'query'];

const validation = (schema) => {
   const validationArray = [];
   return (req, res, next) => {
       dataMethod.forEach(key => {
           if (schema[key]) {
               const validationResult = schema[key].validate(req[key], { abortEarly: false });
               if (validationResult.error) {
                   validationArray.push(validationResult.error.details);
               }
           }
       });
       if(validationArray.length > 0){
           return res.status(400).json({message:"validation error",Error: validationArray})
       }else{
           next();
       }
   }
}
export default validation;