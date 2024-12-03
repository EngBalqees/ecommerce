export const asyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            return await func(req, res, next); // Call the controller function with next
        } catch (error) {
            // Pass the error to the next middleware for handling
            return next({
                status: 500,
                message: "catch error",
                error: error.stack,
            });
        }
    };
};

