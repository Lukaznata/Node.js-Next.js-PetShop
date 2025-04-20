import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;

const sequelize = new Sequelize(
  process.env.DB_NAME || "DB_petshop",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD,
  {
    dialect: "mysql",
    host: process.env.DB_HOST,
    port: port,
  }
);

export default sequelize;
