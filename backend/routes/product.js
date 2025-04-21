import express from 'express';
import { protectRoute , adminRoute } from '../middlewares/auth.js';
import {getAllProducts,getFeaturedProducts,getProductCategory,getRecommendedProducts,createProduct,deleteProduct,toggleFeaturedProduct} from '../controllers/product.js'
const router = express.Router();

router.get('/',protectRoute ,adminRoute,getAllProducts);
router.get('/featured',getFeaturedProducts);
router.get('/category/:category',getProductCategory);
router.get('/recommend',getRecommendedProducts);
router.post('/',protectRoute,adminRoute,createProduct);
router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProduct);
router.delete('/:id',protectRoute,adminRoute,deleteProduct);


export default router