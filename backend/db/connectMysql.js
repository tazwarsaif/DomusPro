import dotenv from 'dotenv';
import { Sequelize } from "sequelize";
dotenv.config()
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
});


export default sequelize;