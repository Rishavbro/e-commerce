import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const protectRoute  = async(req,res,next)=>{
    const accessToken = req.cookies.accessToken;
   

    if(!accessToken){
        return res.status(401).json({
            message:'please login to access '
        })
    }
    try {
        const decodedData = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        const user  = await User.findById(decodedData.userId).select("-password");
        if(!user){
            return res.status(404).json({
                message:'User not found'
            })
        }
        req.user = user
        next();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message:'Interna server error'
        })
    }

  

    
};

export const adminRoute = async(req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        return res.status(401).json({
            message:'only admin can access this route'
        })
    }
}