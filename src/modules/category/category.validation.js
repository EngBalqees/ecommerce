import Joi from "joi";

export const deleteCategorySchema = Joi.object({
    id: Joi.string().hex().length(24).required(), // Ensure id is required
});

export const createCategorySchema = Joi.object({
    name: Joi.string().min(3).required(), // Correct required usage
    image: Joi.any().required(), // Validate image field existence; detailed checks can occur elsewhere
});

export const updateCategorySchema = Joi.object({
    id: Joi.string().hex().length(24).required(), // Ensure id is required
    name: Joi.string().min(3).optional(), // Optional for partial updates
    status: Joi.string().valid('Active', 'NotActive').optional(), // Optional for updates
    image: Joi.any().optional(), // Validate existence if needed
});

export default {
    createCategorySchema,
    updateCategorySchema,
    deleteCategorySchema,
};