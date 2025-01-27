import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import connectMongoDB from './db/connectMongoDB.js';
import authRoutes from './routes/auth.routes.js';
dotenv.config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use('/api/auth',authRoutes);

app.listen(5000,()=>{
    connectMongoDB();
    console.log("Server is up and running")
})