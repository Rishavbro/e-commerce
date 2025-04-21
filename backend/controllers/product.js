import { redis } from '../lib/redis.js';
import Product from '../models/product.js';
import cloudinary from '../lib/cloudinary.js';

export const getAllProducts = async(req,res)=>{

    try {
        const products = await Product.find({});
        // console.log(products)
        res.json({products})
    } catch (error) {
        console.log(error);
        res.status(500).json(
            {
                Message:'internal server error'
            }
        )
    }
};

export const getFeaturedProducts = async(req,res)=>{
    try {
        let featuredProducts = await redis.get("featured_products");
        // console.log('from redis',featuredProducts)
        if(featuredProducts){
            return res.status(200).json(JSON.parse(featuredProducts))
        }

        featuredProducts = await Product.find({isFeatured:true}).lean();
        if(!featuredProducts){
            return res.status(404).json({
                message:'no featured product found'
            })
        }
        console.log("from database",featuredProducts)

        await redis.set("featured_products",JSON.stringify(featuredProducts));
        res.status(200).json(featuredProducts)

    } catch (error) {
        
    }
}

export const createProduct = async(req,res)=>{
    try {
        const {name,description,price,image,category} = req.body;
        let cloudinaryResopnse = null;

        if(image){
            cloudinaryResopnse =  await cloudinary.uploader.upload(image,{folder:"products"})
        }

        const product = await Product.create({
            name,
            description,
            price,
            image:cloudinaryResopnse?.secure_url  || "",
            category
        })
        res.status(200).json(product)

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Interal server error'
        })
    }
};

export const deleteProduct = async(req,res)=>{
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({
                message:'product not found'
            })
        };

        if(product.image){
            const publicId = product.image.split("/").pop().split(".")[0];
            try{
                    await cloudinary.uploader.destroy(`products/${publicId}`);
                    console.log('delted from cloudianry')
            }catch(err){
                    console.log('error deletein from cloudinary',err)
            }
        };

        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            message:'succefully delted the product'
        })



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
};

export const getRecommendedProducts = async(req,res)=>{

    try{

        const products = await Product.aggregate([
            {
                $sample:{size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
            }
        ])
        

        res.json(products)

    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
};

export const getProductCategory = async(req,res)=>{
    const {category} = req.params;
     //console.log(category)
    try {
        const products = await Product.find({category:category});
       // console.log(products)
        return res.status(200).json({products})
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Internal server error'
        })
    }
};

export const toggleFeaturedProduct = async (req,res)=>{
    try {
      
        const id = req.params.id;
      
        const product = await Product.findById(id);
        if(product){
            product.isFeatured = !product.isFeatured;
            const updateProduct = await product.save();
            await updateFeatureProdctsCache();
            res.status(200).json(updateProduct)
        }else{
            res.status(404).json({
                message:"Product not found"
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:'Internal server error'
        })
    }
};

async function updateFeatureProdctsCache() {
    try{
        const featuredProducts = await Product.find({isFeatured:true}).lean();
        await redis.set("featured_products",JSON.stringify(featuredProducts));
    }catch(err){
        console.log('error in update feature cach',err);
          return res.status(500).json({
            message:'Internal server error'
        })
    }
}