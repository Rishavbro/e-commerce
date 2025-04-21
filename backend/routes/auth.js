import express from 'express';
import { login, logout, signup ,refreshToken,getProfile} from '../controllers/auth.js';
import { protectRoute  } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup',signup);

router.post("/login",login);





router.post('/refreshToken',refreshToken);

router.post("/logout",logout);
router.get('/profile',protectRoute ,getProfile)

export default router