import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "teste2_petshop",
  "root",
  process.env.PASSWORD_MYSQL,
  {
    // host: process.env.HOST,
    host: process.env.DATABASE_URL,
    dialect: "mysql",
  }
);

export default sequelize;
