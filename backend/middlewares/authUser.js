import jwt from "jsonwebtoken";

const authUser = async (req, res, next) => {
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({success: false, message: 'Not Authorized. Login Again' })
    }

    try{
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET)
        
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id
        }else{
            return res.status(401).json({success: false, message: 'Not Authorized. Login Again.'})
        }

        next()
        
    }catch (error) {
        return res.status(401).json({success: false, message: error.message})
    }
}

export default authUser;