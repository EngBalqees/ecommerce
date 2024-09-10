import UserModel from "../../DB/model/user.model";
export const auth = (accessRole = []) => {
    return async (req, res, next) => {
        try {
            const { authorization } = req.headers;
            if (!authorization?.startsWith(process.env.BEARERTOKEN)) {
                return next(new AppError('invalid token', 400));
            }
            const token = authorization.split(process.env.BEARERTOKEN)[1];
            const decoded = jwt.verify(token, process.env.LOGINSIGNTURE);
            if (!decoded) {
                return next(new AppError('invalid token', 400));
            }
            const user = await UserModel.findById(decoded.id).select("userName role");
            req.id = user._id;
            req.role = user.role;
            next();

        } catch (error) {
            return res.status(500).json({ message: 'catch error', error: error.stack });

        }
    }
}