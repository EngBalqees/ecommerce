import Joi from "joi";
import { generalFeilds} from "../../midleware/validation.js";

export const RegisterSchema = {
    body: Joi.object({
        userName: Joi.string().min(3).max(40).required().messages({
            'string.empty':'user name is required',
        }),
        email: generalFeilds.email,
        password: generalFeilds.password,
        cpassword : Joi.valid(Joi.ref('password')).required(),
    })
}

export const LoginSchema = {
    body: Joi.object({
        email: generalFeilds.email,
        password: generalFeilds.password,
       
    })
}