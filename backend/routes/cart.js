import express from 'express';
import {addtoCart,removeAllFromCart,upadateQuantity,getCartProducts} from '../controllers/cart.js'
import { protectRoute } from '../middlewares/auth.js';

const router = express.Router();

router.get('/',protectRoute,getCartProducts)
router.post('/',protectRoute,addtoCart);

router.delete('/',protectRoute,removeAllFromCart);
router.put('/:id',protectRoute,upadateQuantity);


export default router;