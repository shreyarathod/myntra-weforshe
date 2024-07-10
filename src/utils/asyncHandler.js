//method 1
/*
const asyncHandler = (func)=> async ()=>{
        try {
                await func(req, res, next)
            
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
            
        }
}

export {asyncHandler}
*/

const asyncHandler = (requestHandler)=>{
    return (req, res, next) =>{
        Promise.resolve(requestHandler(req, res, next)).catch((error)=>next(error))
    }
}

export {asyncHandler}