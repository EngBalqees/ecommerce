import Joi from "joi";
import { generalFeilds} from "../../midleware/validation.js";

export const RegisterSchema =  Joi.object({
    UserName: Joi.string().required().messages({
        "any.required": "UserName is required",
    }),
    email: Joi.string().email().required().messages({
        "any.required": "email is required",
        "string.email": "invalid email format",
    }),
    password: Joi.string().min(6).required().messages({
        "any.required": "password is required",
    }),
    cpassword: Joi.string().valid(Joi.ref('password')).required().messages({
        "any.required": "cpassword is required",
        "any.only": "Passwords do not match",
    })
    }).unknown(true).required()
  


   export  const LoginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }).unknown(false);
    
