import Joi from "joi";

export const generalFeilds = {
   email: Joi.string().email().min(6).required(),
   password: Joi.string().min(8).required(),

}
const dataMethod = ['body', 'params', 'query'];

const validation = (schema) => {
    return(req,res,next) => {
   const errorMessage = [];
   let filterData= {...req.body,...req.params,...req.query};
   const {error} = schema.validate({filterData},{abortEarly: false});
   if(error){
    error.details.forEach( err => {
        const key = err.context.key;
        errorMessage.push({[key] :err.message}); 
    });
    return res.status(400).json({message:"validation error",error:errorMessage});
   }
   next();
}}
export default validation;