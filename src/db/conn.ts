import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";

// const sequelize = new Sequelize(
//   "teste2_petshop",
//   "root",
//   process.env.PASSWORD_MYSQL,
//   {
//     // host: process.env.HOST,
//     host: process.env.DATABASE_URL,
//     dialect: "mysql",
//   }
// );

const port = Number(process.env.MYSQL_PORT) || 3306;

const sequelize = new Sequelize(
  "petshopDB",
  "root",
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.HOST,
    port,
    dialect: "mysql",
  }
);





export default sequelize;
