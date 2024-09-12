export const asyncHandler = (func)=>{
    return async (req,res,next)=>{
        try{
            return await func(req,res);
        }
        catch(error){
            return res.status(500).json({message:"catch error",error:error.stack});
        }
    }
}