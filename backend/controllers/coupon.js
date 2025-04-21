import Coupon from "../models/coupon.js"


export const getCoupon = async (req,res) => {
    try {
        const coupon = await Coupon.findOne({userId:req.user._id,isActive:true});
     

        res.json(coupon || null)
    } catch (error) {
        console.log('error in getCoupon controller',error);
        return res.status(500).josn({
            message:'Internal server error'
        })
    }
};

export const validateCoupon = async(req,res)=>{
    try {
        const {code} = req.body;
        const coupon = await Coupon.findOne({code:code,userId:req.user._id,isActive:true})
        if(!coupon){
            return res.status(404).json({message:"coupon not found"})
        }
        if(coupon.expirationDate < new Date()){
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({message:"coupon expired"})
        }
        res.json({
            message:"coupon is valid",
            code:coupon.code,
            discountPercentage:coupon.discountPercentage
        })
    } catch (error) {
        console.log('error in validateCoupon controller',error);
        return res.status(500).josn({
            message:'Internal server error'
        })
    }
}