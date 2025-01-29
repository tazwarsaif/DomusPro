import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import sequelize from './db/connectMysql.js';
import authRoutes from './routes/auth.routes.js';
dotenv.config()
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.use('/api/auth',authRoutes);

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync({ alter: true });
        console.log('All tables synchronized successfully.');
        app.listen(5000,()=>{
            console.log("Server is up and running")
        })
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
})();

