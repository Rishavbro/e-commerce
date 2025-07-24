import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import couponRoutes from './routes/coupon.js'
import paymentRoutes from './routes/payment.js'
import analyticRoutes from './routes/analytics.js'
import {concetDB} from './lib/db.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


const corsOption = {
    origin:[
        'http://localhost:5173',
        'http://localhost:4173',
         process.env.CLIENT_URL
        ],
        methods:["GET","POST","PUT","DELETE","PATCH"],
    credentials:true,
};

dotenv.config();

const app = express();
app.use(cors(corsOption))
app.use(express.json({limit:"10mb"}));
app.use(cookieParser())

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get('/api/test', (req, res) => {
    res.json({ success: true,message:"hello" });
  });

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/coupon',couponRoutes);
app.use('/api/payments',paymentRoutes);
app.use('/api/analytics',analyticRoutes);

// if (process.env.NODE_ENV === "production") {
// 	app.use(express.static(path.join(__dirname, "../frontend/dist")));

// 	app.get("*", (req, res) => {
// 		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
// 	});
// }

if (process.env.NODE_ENV === "production") {
	const staticPath = join(__dirname, "../frontend/dist");
	console.log("✅ Serving frontend...");
	console.log("Static Path:", staticPath);

	app.use(express.static(staticPath));

	app.get("/*", (req, res) => {
		res.sendFile(join(staticPath, "index.html"));
	});
}

app.listen(PORT,()=>{
    console.log('server listenin at',+ PORT)
    concetDB()
})